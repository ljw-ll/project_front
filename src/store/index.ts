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
  teachers: User[];
}

const myState: State = {
  user: {
    name: "wob",
    phone: "1111111",
    role: 0,
  },
  exception: "",
  courses: [],
  userCourses: [],
  teachers: [],
};

const myMutations: MutationTree<State> = {
  [vxt.UPDATE_EXCEPTION]: (state, date: string) => (state.exception = date),
  [vxt.UPDATE_USER]: (state, data: User) => (state.user = data),
  [vxt.LIST_COURSES]: (state, data: Course[]) => (state.courses = data),
  [vxt.LIST_TEACHERS]: (state, data: any) => (state.teachers = data),
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
    const phone1 = resp.data.data.phone;
    const name1 = resp.data.data.name;
    const role1 = resp.data.data.role;
    //  console.log(phone1);
    commit(vxt.UPDATE_USER, {
      phone: phone1,
      name: name1,
      role: role1,
    } as User);
    const role: string = resp.headers.role;
    if (role != null) {
      sessionStorage.setItem("role", role);
    }
    //location.href = "/main";
    router.push("/teacher");
  },

  // 教师管理
  [vxt.LIST_TEACHERS]: async ({ commit }) => {
    const resp = await axios.get("/user/findAll");
    //console.log(resp);
    // const { list_user } = JSON.parse(resp.data.data.list_user);
    // console.log(resp.data.data.list_user);

    commit(vxt.LIST_TEACHERS, resp.data.data.list_user);
    //location.href = "/main";
    //router.push("/main");
  },
  [vxt.DEL_USERID]: async ({ commit }, phone: string) => {
    const resp = await axios.get("/user/del/" + phone);
    console.log(resp);
    const resp1 = await axios.get("/user/findAll");
    commit(vxt.LIST_TEACHERS, resp1.data.data.list_user);
    //location.href = "/main";
    //router.push("/main");
  },
  [vxt.SAVE_USER]: async ({ commit }, user: any) => {
    const resp = await axios.post("/user/add", user);
    console.log(resp);
  },
  [vxt.UPDATE]: async ({ commit }, user: any) => {
    const resp = await axios.post("/user/update", user);
    console.log(resp);
  },
};

export default createStore({
  state: myState,
  mutations: myMutations,
  actions: myActions,
  // getters: myGetters,
  modules: {},
});
