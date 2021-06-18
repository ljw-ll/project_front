import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },

  {
    name: "main", //主页
    path: "/main",
    component: () => import("@/views/Main.vue"),
  },
  {
    name: "login_user",
    path: "/login",
    component: () => import("@/views/login/Login.vue"),
  },
  {
    name: "ListTeacher", //主页
    path: "/teacher",
    component: () => import("@/views/admins/teacher.vue"),
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
