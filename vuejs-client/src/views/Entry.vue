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
            <image-capture />
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
                      round
                      label="Enter your name"
                    ></v-text-field>
                  </v-col>
                  <v-col md="12" sm="12" lg="12">
                    <v-text-field
                      outlined
                      label="Enter your email"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn height="40" dark block color="black">Enter</v-btn>
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
      image: null,
    };
  },
  components: {
    "image-capture": ImageCapture,
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