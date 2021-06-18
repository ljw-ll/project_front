<template>
  <div id="app">
    <sidebar id="sidebar" />
    <router-view id="router" :key="$route.path" />
    <alertdialog v-if="exception.length > 0" />
    <!-- v-if="exception.length > 0" -->
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import sidebar from "@/views/Sidebar.vue";

import { mapState } from "vuex";
const alertdialog = defineAsyncComponent(
  () => import("@/components/AlertDialog.vue")
);
export default defineComponent({
  components: { sidebar, alertdialog },
  computed: {
    ...mapState(["exception"]),
  },
});
</script>
<style>
#app {
  margin-top: 10px;
  display: flex;
}

#sidebar {
  width: 300px;
  border: 1px solid red;
  padding: 15px;
}
#router {
  border: 1px solid red;
  width: 70%;
  height: 100%;
  /* flex: 1; */
  padding: 15px;
}
</style>
