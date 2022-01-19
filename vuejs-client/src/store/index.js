import Vue from "vue";
import Vuex from "vuex";
import activeEntries from "./modules/activeEntries";
import notifier from "./modules/notifier";
import loader from "./modules/loader";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    activeEntries,
    notifier,
    loader,
  },
});
