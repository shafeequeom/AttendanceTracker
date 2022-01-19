export default {
  state: {
    text: "",
    type: "",
    timeout: "",
  },
  mutations: {
    SHOW_NOTIFICATION(state, payload) {
      state.text = payload.text;
      state.type = payload.type;
      state.timeout = payload.timeout;
    },
  },
  actions: {
    showSnack({ commit }, payload) {
      commit("SHOW_NOTIFICATION", payload);
    },
  },
};
