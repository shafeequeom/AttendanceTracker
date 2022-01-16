<template>
  <div :style="`height:${height}px`">
    <v-img v-show="image" width="100%" :height="height" :src="image" />
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
      <div class="videoAdd">
        <vue-web-cam
          v-show="image == null"
          ref="webcam"
          :device-id="deviceId"
          width="100%"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @cameras="onCameras"
          @camera-change="onCameraChange"
        />
      </div>

      <div
        class="d-flex justify-center"
        style="z-index: 100; margin-top: -80px"
      >
        <v-btn
          v-if="image == null && started"
          fab
          dark
          icon
          class="mr-2"
          @click="onCapture"
        >
          <v-icon>mdi-camera-iris</v-icon>
        </v-btn>
        <v-btn
          v-else-if="started"
          fab
          dark
          icon
          class="mr-2"
          @click="reCapture"
        >
          <v-icon>mdi-camera-retake</v-icon>
        </v-btn>
        <v-btn v-if="started && image == null" icon dark fab @click="onStop"
          ><v-icon dark>mdi-camera-off</v-icon></v-btn
        >
        <v-btn v-if="!started" fab dark icon @click="onStart"
          ><v-icon dark>mdi-camera</v-icon></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import { CircleLoader } from "@saeris/vue-spinners";
export default {
  components: {
    "vue-web-cam": WebCam,
    "circle-loader": CircleLoader,
  },
  data() {
    return {
      image: null,
      camera: null,
      deviceId: null,
      devices: [],
      capture_image_dialoge: false,
      started: false,
      height: 400,
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
      this.image = this.$refs.webcam.capture();
      fetch(this.image)
        .then((res) => res.blob())
        .then((img) => this.$emit("capture", img));
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
  },
};
</script>
<style>
video {
  height: 100%;
  width: 100%;
  border-radius: 10px;
}

video.object-fit-fill {
  object-fit: fill;
}

video.object-fit-cover {
  object-fit: cover;
}
</style>
