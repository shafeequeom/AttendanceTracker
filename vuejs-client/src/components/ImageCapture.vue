<template>
  <div :style="`height:${height}px`">
    <v-img
      style="border-radius: 10px"
      v-show="image"
      width="100%"
      :height="height"
      :src="image"
    >
      <div class="d-flex align-end justify-center fill-height">
        <v-btn
          v-if="image"
          fab
          style="z-index: 1000 !important"
          dark
          small
          class="mr-2 mb-10"
          @click="reCapture"
        >
          <v-icon>mdi-camera-retake</v-icon>
        </v-btn>
      </div>
    </v-img>
    <div
      class="d-flex align-center justify-center flex-column"
      :style="`height:${height}px`"
      v-if="!started"
    >
      <circle-loader
        class="custom-class"
        color="#ccc"
        :loading="!started"
        :size="150"
        sizeUnit="px"
      ></circle-loader>
      <h4 class="mt-3" font>Loading Camera..</h4>
    </div>

    <div>
      <div :style="`height:${height}px`">
        <vue-web-cam
          v-show="image == null"
          ref="webcam"
          style="border-radius: 10px"
          :device-id="deviceId"
          width="100%"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @cameras="onCameras"
          @camera-change="onCameraChange"
        />
        <canvas
          v-if="image == null"
          :width="canvas.width"
          :height="canvas.height"
          :style="`z-index: 10;transform: translateY(-101%);`"
          ref="canvas"
        >
        </canvas>
      </div>

      <div style="z-index: 1000 !important; margin-top: -80px">
        <div class="d-flex align-center justify-center">
          <v-btn
            v-if="image == null && started"
            fab
            small
            style="z-index: 1000 !important"
            dark
            @click="onCapture"
          >
            <v-icon>mdi-camera-iris</v-icon>
          </v-btn>
          <div
            v-if="detecting"
            style="
              color: red;
              z-index: 10000 !important;
              transform: translateY(-20%);
            "
            class="ml-2"
          >
            Detecting Face..
          </div>
          <!-- <v-btn v-if="started && image == null" icon dark fab @click="onStop"
          ><v-icon dark>mdi-camera-off</v-icon></v-btn
        > -->
          <v-btn v-if="!started" fab dark icon @click="onStart"
            ><v-icon dark>mdi-camera</v-icon></v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import { CircleLoader } from "@saeris/vue-spinners";
import * as faceapi from "face-api.js";
export default {
  components: {
    "vue-web-cam": WebCam,
    "circle-loader": CircleLoader,
  },
  props: {
    auto: { type: Boolean, default: false },
    matcher: { type: Boolean, default: false },
    detectedUserEmail: { type: String, default: null },
  },
  data() {
    return {
      image: null,
      camera: null,
      deviceId: null,
      devices: [],
      started: false,
      height: 400,
      canvas: { height: 400, width: 100, margin: -400 },
      detecting: true,
    };
  },
  computed: {
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
  },
  watch: {
    camera: {
      immediate: true,
      handler(id) {
        if (id) {
          this.deviceId = id;
          this.height = `${this.$refs.webcam.$el.height - 50}`;
          this.detectFaces();
        }
      },
    },
    devices() {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices;
      console.log(tail);
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
  methods: {
    onCapture() {
      setTimeout(() => {
        this.image = this.$refs.webcam.capture();
        let file = this.dataURLtoFile(this.image);
        this.$emit("capture", file);
      });
    },
    dataURLtoFile(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], "image.jpg", { type: mime });
    },
    onStarted(stream) {
      this.started = stream.active;
      this.loadModels();
    },
    loadModels() {
      this.showLoader("Loading Models..");
      Promise.all([
        faceapi.loadFaceLandmarkModel(this.$baseUrl + "models"),
        faceapi.loadFaceRecognitionModel(this.$baseUrl + "models"),
        faceapi.loadFaceExpressionModel(this.$baseUrl + "models"),
        faceapi.loadMtcnnModel(this.$baseUrl + "models"),
        faceapi.loadSsdMobilenetv1Model(this.$baseUrl + "models"),
      ]).then(() => {
        this.hideLoader();
        setInterval(() => {
          if (!this.image) this.detectFaces();
        }, 1000);
      });
    },
    onStopped(stream) {
      this.started = stream.active;
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    reCapture() {
      this.image = null;
      this.$forceUpdate();
      setTimeout(this.onStart(), 1000);
    },
    onError(error) {
      this.showError(error);
    },
    onCameras(cameras) {
      this.devices = cameras;
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
    },
    async detectFaces() {
      const mtcnnParams = {
        // number of scaled versions of the input image passed through the CNN
        // of the first stage, lower numbers will result in lower inference time,
        // but will also be less accurate
        maxNumScales: 10,
        // scale factor used to calculate the scale steps of the image
        // pyramid used in stage 1
        scaleFactor: 0.709,
        // the score threshold values used to filter the bounding
        // boxes of stage 1, 2 and 3
        scoreThresholds: [0.6, 0.7, 0.7],
        // mininum face size to expect, the higher the faster processing will be,
        // but smaller faces won't be detected
        minFaceSize: 150,
      };
      let video = this.$refs.webcam ? this.$refs.webcam.$el : null;
      if (video && video.readyState == 4 && !this.image) {
        const options = new faceapi.MtcnnOptions(mtcnnParams);
        let fullFaceDescriptions = await faceapi
          .detectAllFaces(video, options)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (this.matcher && fullFaceDescriptions.length) {
          const faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions);
          this.$store.getters.getActiveEntries.forEach((user) => {
            this.findMatch(user, faceMatcher);
          });
        }

        if (fullFaceDescriptions.length && video) {
          const canvas = this.$refs.canvas;
          const dims = faceapi.matchDimensions(canvas, video, true);
          fullFaceDescriptions = await faceapi.resizeResults(
            fullFaceDescriptions,
            dims
          );
          this.canvas.width = video.width;
          this.canvas.height = video.height;
          this.canvas.margin = -(video.height + 50);

          fullFaceDescriptions.forEach((element) => {
            faceapi.draw.drawDetections(canvas, element);
          });
          this.detecting = false;
        } else {
          this.detecting = true;
        }
        if (fullFaceDescriptions.length > 1) {
          this.showError("Error! More than one face detected");
        }
      }
    },
    async findMatch(user, faceMatcher) {
      console.log(this.$apiUrl + user.picture);
      const img = await faceapi.fetchImage(this.$apiUrl + user.picture);
      const singleResult = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (singleResult) {
        const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
        if (
          bestMatch._label != "unknown" &&
          this.detectedUserEmail != user.email
        ) {
          this.emitDetectedUser(user);
        }
      }
    },
    emitDetectedUser(user) {
      let image = this.$refs.webcam.capture();
      user.image = this.dataURLtoFile(image);
      user = this.$emit("bestMatch", user);
    },
  },
};
</script>
<style>
video {
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 10px !important;
  object-fit: cover;
}
canvas {
  height: 100%;
  width: 100%;
  position: sticky;
  border-radius: 10px;
}

#navi,
#infoi {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
#infoi {
  z-index: 10;
}
</style>
