<template>
  <div>
    <v-img v-show="image" :src="image" />
    <h3 class="text-center" v-if="!started">
      Camera Stopped. Click start to open camera again
    </h3>

    <div>
      <vue-web-cam
        v-show="image == null"
        ref="webcam"
        :device-id="deviceId"
        width="100%"
        :height="height"
        @started="onStarted"
        @stopped="onStopped"
        @error="onError"
        @cameras="onCameras"
        @camera-change="onCameraChange"
      />

      <div
        class="d-flex justify-center"
        style="z-index: 100; margin-top: -130px"
      >
        <v-btn
          v-if="image == null && started"
          fab
          dark
          color="teal"
          class="mr-2"
          @click="onCapture"
        >
          <v-icon>mdi-camera-iris</v-icon>
        </v-btn>
        <v-btn
          v-else-if="started"
          fab
          dark
          color="teal"
          class="mr-2"
          @click="reCapture"
        >
          <v-icon>mdi-camera-retake</v-icon>
        </v-btn>
        <v-btn v-if="started && image == null" color="error" fab @click="onStop"
          ><v-icon dark>mdi-camera-off</v-icon></v-btn
        >
        <v-btn v-if="!started" fab color="success" @click="onStart"
          ><v-icon dark>mdi-camera</v-icon></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
export default {
  components: {
    "vue-web-cam": WebCam,
  },
  data() {
    return {
      image: null,
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      capture_image_dialoge: false,
      started: false,
      height: "400px",
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
        this.deviceId = id;
        this.height = `${window.innerHeight - 50}px`;
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
      this.image = this.$refs.webcam.capture();
      fetch(this.image)
        .then((res) => res.blob())
        .then((img) => (this.img = img));
    },
    onStarted(stream) {
      this.started = stream.active;
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
    close() {
      this.capture_image_dialoge = false;
      this.$emit("close");
      this.onStop();
    },
    confirm() {
      if (this.img == null) {
        this.showError("No image capture");
        return;
      }
      this.$emit("confirm", this.img);
      this.onStop();
    },
  },
};
</script>
