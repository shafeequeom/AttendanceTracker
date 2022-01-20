import Vue from "vue";
import Vuex from "vuex";
// Active entries store
import activeEntries from "./modules/activeEntries";
// Snack bar notification
import notifier from "./modules/notifier";
//Loader Store
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
