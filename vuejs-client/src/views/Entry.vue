<template>
  <v-container fluid>
    <div>
      <div class="text-center welcome-text">WELCOME TO</div>
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
              <v-form ref="form">
                <v-row>
                  <v-col md="12" sm="12" lg="12">
                    <v-text-field
                      outlined
                      v-model="form.name"
                      round
                      label="Enter your name*"
                      :rules="[(v) => !!v || 'Name is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col md="12" sm="12" lg="12">
                    <v-text-field
                      v-model="form.email"
                      outlined
                      label="Enter your email*"
                      :rules="[
                        (v) => !!v || 'E-mail is required',
                        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                      ]"
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <v-switch
                      style="z-index: 1000 !important; margin-top: -30px"
                      v-model="autoShot"
                      :label="`Auto Capture: ${autoShot ? 'ON' : 'OFF'}`"
                    ></v-switch>
                    <v-btn
                      height="40"
                      @click="submitEntryForm"
                      dark
                      block
                      color="black"
                      >Enter</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-btn class="mt-10" absolute top left @click="$router.push('/')" fab>
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import ImageCapture from "@/components/ImageCapture";
import { registerAttendance } from "../functions/attendance";
export default {
  data: () => {
    return {
      form: {
        name: null,
        email: null,
        picture: null,
      },
      autoShot: false,
    };
  },
  components: {
    "image-capture": ImageCapture,
  },
  methods: {
    captureImage(img) {
      this.form.picture = img; //Set form image on capture
    },
    async submitEntryForm() {
      // Image check
      if (!this.form.image) {
        if (this.autoShot) {
          this.$refs.camera.onCapture();
        } else {
          this.showError("Error! Please capture image");
          return;
        }
      }

      //form validation check
      if (!this.$refs.form.validate()) {
        this.showError("Please fill name and email fields");
        return;
      }
      this.form.type = "ENTRY";
      this.showLoader("Saving..");
      await registerAttendance(this.form)
        .then((response) => {
          if (response.status == 200) {
            this.showSuccess(response.data.message);
            this.form = {
              name: null,
              email: null,
              picture: null,
            };
            this.hideLoader();
            this.$refs.camera.reCapture();
            this.$store.dispatch("loadActiveEntries");
            this.$refs.form.resetValidation();
            // this.$router.push("/");
          }
        })
        .catch((error) => {
          let message = this.errorParser(error);
          this.showError(message);
          this.hideLoader();
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