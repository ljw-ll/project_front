import { ActionTree, createStore, MutationTree } from "vuex";
import router from "@/router";
import * as vxt from "./VuexTypes";
import axios from "@/axios";
import { ResultVO } from "./Response";
import { User, Course, laboratory } from "@/datasource/Types";
import { resolveDynamicComponent } from "@vue/runtime-core";
import _Result from "element-plus/lib/el-result";
import { routeLocationKey } from "vue-router";

export interface State {
  user: User;
  exception: string;
  courses: Course[];
  userCourses: Course[];
  teachers: User[];
  laboratorys: laboratory[];
}

const myState: State = {
  user: {
    name: "",
    phone: "1111111",
    role: 0,
    id: "",
  },
  exception: "",
  courses: [],
  userCourses: [],
  teachers: [],
  laboratorys: [],
};

const myMutations: MutationTree<State> = {
  [vxt.UPDATE_EXCEPTION]: (state, date: string) => (state.exception = date),
  [vxt.UPDATE_USER]: (state, data: User) => (state.user = data),
  [vxt.LIST_TEACHERS]: (state, data: any) => (state.teachers = data),
  [vxt.LIST_LABORATORY]: (state, data: any) => (state.laboratorys = data),
  [vxt.LIST_COURSE]: (state, data: Course[]) => (state.courses = data),
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

  // 前后端联调 登录
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
    const id1 = resp.data.data.id;
    sessionStorage.setItem("userid", id1);
    //  console.log(phone1);
    commit(vxt.UPDATE_USER, {
      phone: phone1,
      name: name1,
      role: role1,
      id: id1,
    } as User);
    const role: string = resp.headers.role;
    if (role != null) {
      sessionStorage.setItem("role", role);
    }
    //location.href = "/main";
    router.push("/teacher");
  },

  /*
     教师管理
  */
  [vxt.LIST_TEACHERS]: async ({ commit }) => {
    const resp = await axios.get("/user/findAll");
    //console.log(resp);
    commit(vxt.LIST_TEACHERS, resp.data.data.list_user);

    //router.push("/main");
  },
  [vxt.DEL_USERID]: async ({ commit }, phone: string) => {
    try {
      const resp = await axios.get("/user/del/" + phone);
      console.log(resp);
      commit(vxt.LIST_TEACHERS, resp.data.data.list_user);
    } catch (error) {
      // eslint默认禁止空执行体。加一段注释或关闭该检测
    }
    //location.href = "/main";
    //router.push("/main");
  },
  [vxt.SAVE_USER]: async ({ commit }, user: any) => {
    console.log("zhixing");
    const resp = await axios.post("/user/add", user);
    console.log(resp);
    commit(vxt.LIST_TEACHERS, resp.data.data.list_user);
  },
  [vxt.UPDATE]: async ({ commit }, user: any) => {
    const resp = await axios.post("/user/update", user);
    //console.log(resp);
    commit(vxt.LIST_TEACHERS, resp.data.data.list_user);
  },

  /*
    实验室管理
  */
  [vxt.LIST_LABORATORY]: async ({ commit }) => {
    const resp = await axios.get("/laboratory/findAll");
    //console.log(resp);
    commit(vxt.LIST_LABORATORY, resp.data.data.list_laboratory);
    //router.push("/main");
  },

  [vxt.DEL_LABORATORYID]: async ({ commit }, id: string) => {
    try {
      const resp = await axios.get("/laboratory/del/" + id);
      console.log(resp);
      commit(vxt.LIST_LABORATORY, resp.data.data.list_laboratory);
    } catch (error) {
      // eslint默认禁止空执行体。加一段注释或关闭该检测
    }
    //location.href = "/main";
    //router.push("/main");
  },
  /* [vxt.SAVE_LABORATORY]: async ({ commit }, laboratory: laboratory) => {
    console.log("hhhhhhhh");

    const resp = await axios.post("/laboratory/add", laboratory);
    console.log(resp);
    commit(vxt.LIST_LABORATORY, resp.data.data.list_laboratory);
  },*/
  [vxt.UPDATE_LABORATORY]: async ({ commit }, user: any) => {
    const resp = await axios.post("/laboratory/update", user);
    //console.log(resp);
    commit(vxt.LIST_LABORATORY, resp.data.data.list_laboratory);
  },
  /*
    课程管理
  */
  [vxt.LIST_COURSE]: async ({ commit }, id: string) => {
    const resp = await axios.get("/user/findDTO/" + id);
    console.log(resp);
    console.log(resp.data.data.list_UserDTO.courses);

    commit(vxt.LIST_COURSE, resp.data.data.list_UserDTO.courses);

    //router.push("/main");
  },
  [vxt.DEL_COURSEID]: async ({ commit }, id: string) => {
    try {
      const resp = await axios.get("/course/del/" + id);
      console.log(resp);
      commit(vxt.LIST_COURSE, resp.data.data.list_UserDTO.courses);
    } catch (error) {
      // eslint默认禁止空执行体。加一段注释或关闭该检测
    }
    //location.href = "/main";
    //router.push("/main");
  },
  [vxt.SAVE_COURSE]: async ({ commit }: any, course: any) => {
    const userid = sessionStorage.getItem("userid");
    course.userid = userid;

    console.log(course);

    const resp = await axios.post("/course/add", course);
    console.log(resp);
    commit(vxt.LIST_COURSE, resp.data.data.list_UserDTO.courses);
  },
  // [vxt.UPDATE]: async ({ commit }, course: any) => {
  //   const resp = await axios.post("/course/update", course);
  //   //console.log(resp);
  //   commit(vxt.LIST_COURSE, resp.data.data.list_UserDTO.courses);
  // },
};

export default createStore({
  state: myState,
  mutations: myMutations,
  actions: myActions,
  // getters: myGetters,
  modules: {},
});
