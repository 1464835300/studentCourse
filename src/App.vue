<template>
  <router-view v-if="isLogin"></router-view>
  <homeView v-else>
    <router-view></router-view>
  </homeView>
</template>

<script setup>
import router from './router';
import { useStore } from "./stores";
import homeView from './components/homeView.vue';
import { ref } from 'vue';
const store = useStore();
const isLogin = ref(false);
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/Login') {
    isLogin.value = true;
    return next();
  }
  const Token = store.token;
  if (!Token) {
    isLogin.value = true;
    return next('/Login')
  } else {
    isLogin.value = false;
  }
  next()
})
</script>

<style scoped></style>
