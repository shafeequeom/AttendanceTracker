import { mapActions } from "vuex";
const common = {
  methods: {
    // Store Actions
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
    //Global function to show success snackbar message
    showSuccess(message) {
      this.showSnack({
        text: message,
        type: "success",
        timeout: 5000,
      });
    },
    //Global function to show error snackbar message
    showError(message) {
      this.showSnack({
        text: message,
        type: "error",
        timeout: 5000,
      });
    },
    //Global function to show info snackbar message
    showInfo(message, timeout) {
      this.showSnack({
        text: message,
        type: "info",
        timeout: timeout == null ? 5000 : timeout,
      });
    },
    //Global function to show loader
    showLoader(message) {
      this.showOverlayLoader({
        text: message,
        show: true,
      });
    },
    //Global function to hide loader
    hideLoader() {
      this.showOverlayLoader({
        text: "",
        show: false,
      });
    },
  },
};

export default common;
