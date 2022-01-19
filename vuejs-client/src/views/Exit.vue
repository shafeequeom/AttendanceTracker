<template>
  <v-container fluid>
    <div>
      <div class="text-center welcome-text">THANK YOU, VISIT AGAIN</div>
      <div class="text-center museum-text">MUSEUM OF FUTURE</div>
    </div>

    <v-card class="ma-auto mt-4 fill-height" height="100%" width="80%" round>
      <v-card-text>
        <v-row>
          <v-col md="6" sm="12">
            <image-capture
              @capture="
                (img) => {
                  user.image = img;
                }
              "
              :matcher="matchMode"
              :detectedUserEmail="user.email"
              @bestMatch="userMatchFound"
              ref="camera"
            />
          </v-col>
          <v-col md="6">
            <div style="margin: 20 auto">
              <v-img
                :src="require('@/assets/logo.png')"
                contain
                :height="height"
              ></v-img>
            </div>
            <div class="d-flex align-center justify-center pt-8">
              <span class="mr-2 subtitle-2">Detection Mode</span>
              <v-btn-toggle
                v-model="mode"
                tile
                @change="modeChange"
                color="deep-purple accent-3"
                group
              >
                <v-btn value="automatic"> Automatic </v-btn>
                <v-btn value="manual"> Manual </v-btn>
              </v-btn-toggle>
            </div>
            <div class="pa-4" v-if="mode == 'manual'">
              <v-form class="mt-6">
                <v-row>
                  <v-autocomplete
                    outlined
                    v-model="user"
                    :items="activeEntries"
                    item-text="email"
                    item-value="email"
                    label="Search your email*"
                    placeholder="Search your email.."
                    :rules="[(v) => !!v || 'Name is required is required']"
                    auto-select-first
                    @change="onUserSelect"
                    return-object
                    required
                    ref="nameField"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-avatar
                        v-if="item.picture"
                        rounded
                        color="teal"
                        class="text-h5 font-weight-light white--text"
                      >
                        <v-img :src="$apiUrl + item.picture"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-avatar
                        v-else-if="item.name"
                        rounded
                        color="teal"
                        class="text-h5 font-weight-light white--text"
                      >
                        {{ item.name.charAt(0) }}
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.email
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-row>
              </v-form>
            </div>
            <div v-if="user.name">
              <v-list>
                <v-list-item>
                  <v-list-item-avatar tile size="80">
                    <v-img :src="`${$apiUrl + user.picture}`"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      {{ user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      user.email
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn dark @click="submitEntryForm">Submit</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ImageCapture from "@/components/ImageCapture";
import registerAttendance from "../functions/attendance";
export default {
  data: () => {
    return {
      matchMode: true,
      user: {},
      mode: "automatic",
      height: 250,
    };
  },
  components: {
    "image-capture": ImageCapture,
  },
  mounted() {
    this.$store.dispatch("loadActiveEntries");
  },
  computed: {
    activeEntries() {
      return this.$store.getters.getActiveEntries;
    },
  },
  methods: {
    captureImage(img) {
      this.user.picture = img;
    },
    async submitEntryForm() {
      if (!this.user.image) {
        this.showError("Error! Please capture image");
        return;
      }
      this.user.type = "EXIT";
      this.showLoader("Saving..");
      await registerAttendance(this.user)
        .then((response) => {
          this.showSuccess(response.message);
          this.hideLoader();
          this.$router.push("/");
        })
        .catch((error) => {
          let message = this.errorParser(error);
          this.showError(message);
        });
    },
    modeChange() {
      setTimeout(() => {
        this.height = this.mode == "manual" ? 150 : 250;
        this.matchMode = this.mode == "manual" ? false : true;
        this.$forceUpdate();
      });
    },
    onUserSelect() {
      this.$refs.camera.reCapture();
      setTimeout(() => {
        this.$refs.camera.onCapture();
      }, 1000);
    },
    userMatchFound(user) {
      if (this.user.email != user.email) {
        this.user = user;
      }
    },
  },
};
</script>

<style>
.welcome-text {
  /* background: #7375ff;
  background: -webkit-linear-gradient(to bottom, #7375ff 0%, #ffff95 68%);
  background: -moz-linear-gradient(to bottom, #7375ff 0%, #ffff95 68%);
  background: linear-gradient(to bottom, #7375ff 0%, #ffff95 68%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  color: azure;
  font-size: 40px;
  font-weight: 200;
}
.museum-text {
  /* background: #35f3d0;
  background: -webkit-linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  background: -moz-linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  background: linear-gradient(to bottom, #35f3d0 0%, #ffff95 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  color: azure;
  font-size: 50px;
  font-weight: 400;
}
</style>