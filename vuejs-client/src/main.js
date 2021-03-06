import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import VueParticles from "vue-particles";
import { VueSpinners } from "@saeris/vue-spinners";
import common from "./mixins/common";
import "./utils/filter";

Vue.use(VueSpinners);
Vue.use(VueParticles);

Vue.mixin(common);

Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_URL;
Vue.prototype.$apiUrl = process.env.VUE_APP_API_URL;

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
