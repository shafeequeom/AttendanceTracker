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
    <loader-overlay />
    <notifier />
  </v-app>
</template>

<script>
import "vue-toastification/dist/index.css";
import Notifier from "./components/Notifier";
import LoaderOverlay from "./components/LoaderOverlay";
export default {
  name: "App",
  components: {
    LoaderOverlay,
    Notifier,
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
