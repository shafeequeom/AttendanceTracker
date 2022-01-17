import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Entry";
import Entry from "../views/Entry";
import Exit from "../views/Exit";
import NotFound from "../views/NotFound";

Vue.use(VueRouter);

const routes = [
  //Login
  {
    name: "Home",
    path: "/",
    component: Home,
    meta: {
      item: null,
      module: {
        id: null,
      },
      title: "Home",
    },
  },
  {
    name: "Entry",
    path: "/entry",
    component: Entry,
    meta: {
      item: null,
      module: {
        id: null,
      },
      title: "Entry",
    },
  },
  {
    name: "Exit",
    path: "/exit",
    component: Exit,
    meta: {
      item: null,
      module: {
        id: null,
      },
      title: "Exit",
    },
  },
  //404
  {
    name: "NotFound",
    path: "*",
    component: NotFound,
    meta: {
      item: null,
      module: {
        id: null,
      },
      title: "Not FOund",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
