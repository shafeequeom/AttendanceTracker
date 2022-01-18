import Vue from "vue";
import Vuex from "vuex";
import activeEntries from "./modules/activeEntries";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    activeEntries,
  },
});
