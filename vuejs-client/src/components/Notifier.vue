<template>
  <div name="snackbars">
    <v-snackbar
      v-model="show"
      :color="type"
      :timeout="timeout"
      bottom
      right
      style="z-index: 10000000;"
    >
      <v-icon v-if="type == 'success'">mdi-thumb-up</v-icon>
      <v-icon v-else-if="type == 'error'">mdi-thumb-down</v-icon>
      <v-icon v-else-if="type == 'info'">mdi-information</v-icon>

      <span class="pl-2 subtitle-2">{{ text }}</span>

      <template v-slot:action="{ attrs }">
        <v-btn dark icon v-bind="attrs" @click="show = false">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "SHOW_NOTIFICATION") {
        this.text = state.notifier.text;
        this.type =
          state.notifier.type != null ? state.notifier.type : "success";
        this.timeout =
          state.notifier.type != null ? state.notifier.timeout : 10000;
        this.show = true;
      }
    });
  },
  data() {
    return {
      show: false,
      type: "",
      text: "",
      timeout: 10000,
    };
  },
};
</script>
