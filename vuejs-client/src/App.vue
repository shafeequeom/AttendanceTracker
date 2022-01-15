<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col md="6">
            <image-capture />
          </v-col>
          <v-col md="6"> </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as faceapi from "face-api.js";
import ImageCapture from "./components/ImageCapture";
export default {
  name: "App",
  data: () => {
    return {
      image: null,
    };
  },
  components: {
    "image-capture": ImageCapture,
  },
  mounted() {
    this.loadModels();
  },
  methods: {
    loadModels() {
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ]);
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
