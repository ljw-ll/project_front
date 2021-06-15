import { ActionTree, createStore, MutationTree } from "vuex";
import router from "@/router";
import * as vxt from "./VuexTypes";
import axios from "@/axios";
import { ResultVO } from "./Response";
import { User, Course } from "@/datasource/Types";
import { resolveDynamicComponent } from "@vue/runtime-core";
import _Result from "element-plus/lib/el-result";
import { routeLocationKey } from "vue-router";

export interface State {
  user: User;
  exception: string;
  courses: Course[];
  userCourses: Course[];
}

const myState: State = {
  user: {
    name: "ljw",
    phone: "13835210372",
    role: 0,
  },
  exception: "",
  courses: [],
  userCourses: [],
};

const myMutations: MutationTree<State> = {
  [vxt.UPDATE_EXCEPTION]: (state, date: string) => (state.exception = date),
  [vxt.UPDATE_USER]: (state, date: User) => (state.user = date),
  [vxt.LIST_COURSES]: (state, data: Course[]) => (state.courses = data),
};

const myActions: ActionTree<State, State> = {
  [vxt.UPDATE_USER]: ({ commit }, data: User) => {
    setTimeout(() => {
      commit(vxt.UPDATE_USER, data);
    }, 1000);
  },
  [vxt.LOGIN]: async ({ commit }, data: any) => {
    const resp = await axios.post<ResultVO>("/login", data);
    if (resp.data.code == 200) {
      const role = resp.data.data.role;
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("token", resp.headers.token);

      // console.log(resp.headers.token);
      // console.log(resp);
      commit(vxt.UPDATE_USER, resp.data.data.user);
      router.push("/main");
    }
  },
  [vxt.GET_HOME]: async ({ commit }) => {
    // 未捕获异常，请求失败在控制台输出信息
    const resp = await axios.get<ResultVO>("home");
    commit(vxt.LIST_COURSES, resp.data.data?.courses);
  },

  // 前后端联调
  [vxt.BACKEND_LOGIN]: async ({ commit }, user: any) => {
    const resp = await axios.post("/login", user);
    console.log(resp);

    const token: string = resp.headers.token;
    if (token && token.length > 96) {
      sessionStorage.setItem("token", token);
      console.log(token);
      // state.isLogin = true;
    }
    commit(vxt.UPDATE_USER, resp.data.data.user);
    const role: string = resp.headers.role;
    if (role != null) {
      sessionStorage.setItem("role", role);
    }
    router.push("/main");
  },
};

export default createStore({
  state: myState,
  mutations: myMutations,
  actions: myActions,
  // getters: myGetters,
  modules: {},
});
