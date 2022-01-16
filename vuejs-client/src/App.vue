<template>
  <v-app class="background">
    <v-main>
      <div
        style="
          top: 0;
          left: 0;
          position: fixed;
          overflow: hidden;
          width: 100%;
          height: 100%;
        "
      >
        <vue-particles
          color="#ccc"
          :particleOpacity="0.7"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="4"
          linesColor="#dedede"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
        >
        </vue-particles>
      </div>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import * as faceapi from "face-api.js";
import "vue-toastification/dist/index.css";
export default {
  name: "App",
  data: () => {
    return {
      image: null,
    };
  },
  mounted() {
    this.loadModels();
  },
  methods: {
    loadModels() {
      Promise.all([
        faceapi.loadFaceLandmarkModel("/models"),
        faceapi.loadFaceRecognitionModel("/models"),
        faceapi.loadFaceExpressionModel("/models"),
        faceapi.loadMtcnnModel("/models"),
        // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        // faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ]).then();
    },
    async detectFaces() {
      // let container = this.$refs.main;
      const image = await faceapi.bufferToImage(this.image);
      // const canvas = faceapi.createCanvasFromMedia(image);
      // container.append(canvas);
      // const displaySize = { width: image.width, height: image.height };
      // faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log(detections);
    },
  },
};
</script>
<style>
body {
  font-family: "Roboto", sans-serif;
}

.background {
  background-color: black !important;
  overflow-y: hidden;
}
</style>
