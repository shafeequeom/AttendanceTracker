<template>
  <v-container fluid>
    <div style="position: absolute; left: 52%; bottom: 10px">
      <v-switch
        dark
        style="z-index: 1000 !important"
        v-model="autoShot"
        :label="`Auto Capture: ${autoShot ? 'ON' : 'OFF'}`"
      ></v-switch>
    </div>
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
                  form.image = img;
                }
              "
              :auto="autoShot"
              ref="camera"
            />
          </v-col>
          <v-col md="6">
            <div style="margin: 20 auto">
              <v-img
                :src="require('@/assets/logo.png')"
                contain
                height="150"
              ></v-img>
            </div>
            <div class="pa-4">
              <v-form class="mt-6">
                <v-row>
                  <v-autocomplete
                    outlined
                    v-model="user"
                    :items="entries"
                    :loading="isSearchLoading"
                    :search-input.sync="search"
                    item-text="name"
                    item-value="name"
                    label="Search your email*"
                    placeholder="Search your email.."
                    :rules="[(v) => !!v || 'Name is required is required']"
                    auto-select-first
                    return-object
                    required
                    ref="nameField"
                  >
                  </v-autocomplete>
                </v-row>
              </v-form>
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
      isSearchLoading: false,
      entries: [],
      user: {},
      search: null,
      form: {},
      autoShot: false,
    };
  },
  components: {
    "image-capture": ImageCapture,
  },
  methods: {
    captureImage(img) {
      this.form.picture = img;
    },
    async submitEntryForm() {
      if (!this.form.image) {
        this.$toast.error("Error! Please capture image");
        return;
      }
      this.form.type = "ENTRY";
      await registerAttendance(this.form)
        .then((response) => {
          this.$toast.success(response.message);
        })
        .catch((error) => {
          let message = this.errorParser(error);
          this.$toast.error(message);
        });
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