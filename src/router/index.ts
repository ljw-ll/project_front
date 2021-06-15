import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/Login.vue"),
  },
  {
    name: "main", //主页
    path: "/main",
    component: () => import("@/views/Main.vue"),
  },
  {
    name: "nomatch",
    path: "/ :pathMatch( .*)*",
    redirect: { name: "login" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
