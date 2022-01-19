<template>
  <v-overlay :value="overlay" z-index="100000">
    <v-progress-circular indeterminate size="100"
      ><h4 class="text-center">{{ text }}</h4></v-progress-circular
    >
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      overlay: false,
      text: "Loading..",
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "OVERLAY_LOADER") {
        this.text = state.loader.text != null ? state.loader.text : "Loading";
        this.overlay = state.loader.show != null ? state.loader.show : false;
      }
    });
  },
};
</script>

<style></style>
