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
              <v-form>
                <v-row>
                  <v-col md="12" sm="12" lg="12">
                    <v-text-field
                      outlined
                      v-model="form.name"
                      round
                      label="Enter your name"
                    ></v-text-field>
                  </v-col>
                  <v-col md="12" sm="12" lg="12">
                    <v-text-field
                      v-model="form.email"
                      outlined
                      label="Enter your email"
                    ></v-text-field>
                  </v-col>
                  <v-col>
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
  </v-container>
</template>

<script>
import ImageCapture from "@/components/ImageCapture";
export default {
  data: () => {
    return {
      form: {
        name: "Shafeeque OM",
        email: "shafeequeom7@gmail.com",
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
      this.form.picture = img;
    },
    submitEntryForm() {
      let formData = new FormData();
      if (!this.form.image) {
        this.$toast.error("Error! Please capture image");
        return;
      }
      formData.append("picture", this.form.image);
      formData.append("name", this.form.name);
      formData.append("email", this.form.email);
      formData.append("type", "ENTRY");
      console.log(formData);
      this.$http
        .post(`attendances`, formData, {
          headers: {
            "Content-Type": "multipart/form-data; boundary=${form._boundary}",
          },
        })
        .then((res) => {
          if (res.status == 200) {
            this.form = { name: null, email: null, picture: null };
            this.$refs.camera.reCapture();
            this.$toast.success("Welcome! Please scan your face for exit");
          }
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