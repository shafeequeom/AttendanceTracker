const common = {
  methods: {
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
  },
};


export default common