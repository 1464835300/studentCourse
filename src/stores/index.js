import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useStore = defineStore('main', {
    id: "main",
    state: () => ({
        token: '',
        loginClientInfo: null,  //登录信息
        menuList: null,         //菜单列表信息
    }),
    actions: {
        setToken(token) {
            this.token = token;
        },
        setLoginInfo(loginClientInfo) {
            this.loginClientInfo = loginClientInfo;
        },
        setMenuList(menuList) {
            this.menuList = menuList;
        },
        logOut() {
            this.token = '';
            this.loginClientInfo = null;
            this.menuList = null;
        }
    },
    // 持久化存储
    persist: {
        key: "main",
        storage: {
            getItem: (key) => Cookies.get(key),
            setItem: (key, value) => Cookies.set(key, value, { expires: 1 }),
            removeItem: (key) => Cookies.remove(key),
        },
    },
});

