import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueParticles from "vue-particles";
import axios from "axios";
import { VueSpinners } from "@saeris/vue-spinners";
import Toast from "vue-toastification";

Vue.use(VueSpinners);
Vue.use(VueParticles);
Vue.use(Toast);

const api = axios.create({
  baseURL:
    process.env.VUE_APP_API_URL !== undefined
      ? process.env.VUE_APP_API_URL
      : "http://localhost:5000/",
});

Vue.prototype.$http = api;

Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_URL;

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
