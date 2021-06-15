<template>
  <div>
     <p>
       登录后，会在sessionstorage中添加token。再次发出权限请求时，
       从sessionstorage中取出数据再请求中添加在header一起发出。
       <br>
       教师：1001/1001  
       <br>
       admin：2002/2002
     </p>
    <p>
      <input type="text" v-model="userForm.phone" />
      <br />
      <input type="password" v-model="userForm.password" />
      <br />
      <button type="button" @click="login">Login</button>
      <br />
      <!-- {{ user.title }} -->
    </p>
    <hr />
    <p>
      <button type="button" @click="getHome">home</button>
      <br />
     <ul>
        <li v-for="(c, index) of courses" :key="index">{{c.name}}</li>
      </ul>
    </p>
  </div>
</template>
<script lang="ts">
import { State } from "@/store";
import { GET_HOME, LOGIN, BACKEND_LOGIN } from "@/store/VuexTypes";
import { computed, defineComponent, Ref, ref } from "vue";
import { Store, useStore } from "vuex";
import  { User }from "@/datasource/Types";



function useLogin(userForm: Ref<User>, store: Store<State>) {
  const login = () => {
    const user = {
      phone: userForm.value.phone,
      password: userForm.value.password
    };
    store.dispatch(BACKEND_LOGIN, user);
    userForm.value.phone = "";
    userForm.value.password = "";
  };
  return {
    login
  };
}

export default defineComponent({
  setup() {
    const store: Store<State> = useStore();
    const userForm = ref<User>({});
    const { login } = useLogin(userForm, store);
    const courses = computed(() => store.state.courses);
    const user = computed(() => store.state.user);
    
    const getHome = () => {
      store.dispatch(GET_HOME);
    };
    return {
      user,
      userForm,
      login,
      courses,
      getHome
    };
  }
});
</script>
