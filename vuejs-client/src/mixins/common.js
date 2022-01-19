import { mapActions } from "vuex";
const common = {
  methods: {
    ...mapActions(["showSnack", "showOverlayLoader"]),
    errorParser(error) {
      if (error.response) {
        error = error.response;
      }
      let message =
        typeof error.data != "undefined" &&
        typeof error.data.message != "undefined"
          ? error.data.message
          : "Unknown error occurred.";
      return message;
    },
    showSuccess(message) {
      this.showSnack({
        text: message,
        type: "success",
        timeout: 5000,
      });
    },
    showError(message) {
      this.showSnack({
        text: message,
        type: "error",
        timeout: 5000,
      });
    },
    showInfo(message, timeout) {
      this.showSnack({
        text: message,
        type: "info",
        timeout: timeout == null ? 5000 : timeout,
      });
    },
    showLoader(message) {
      this.showOverlayLoader({
        text: message,
        show: true,
      });
    },
    hideLoader() {
      this.showOverlayLoader({
        text: "",
        show: false,
      });
    },
  },
};

export default common;
