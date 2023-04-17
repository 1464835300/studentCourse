import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

// 持久化工具pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import "./assets/css/index.css"
// 导入Element plus
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/assets/scss/index.scss";
// aiox封装

import PageView from './components/pageView.vue'
import homeView from './components/homeView.vue'
const pinia = createPinia();
pinia.use(piniaPluginPersistedState)
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component("page-view", PageView);
app.component("homeView", homeView);

app.use(ElementPlus, { locale: zhCn, });
app.use(pinia)
app.use(router);
app.mount('#app');

