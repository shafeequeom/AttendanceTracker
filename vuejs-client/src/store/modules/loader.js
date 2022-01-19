export default {
  state: {
    text: "",
  },
  mutations: {
    OVERLAY_LOADER(state, payload) {
      state.text = payload.text;
      state.show = payload.show;
    },
  },
  actions: {
    showOverlayLoader({ commit }, payload) {
      commit("OVERLAY_LOADER", payload);
    },
  },
};
