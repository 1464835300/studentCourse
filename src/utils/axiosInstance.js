import axios from 'axios';
import { useStore } from '../stores';
import router from "../router";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import _ from 'lodash';
import customIcon from "@/components/customIcon.vue"

let reqList = [];
let loading = [];

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = (reqList, url, cancel, errorMessage) => {
    const errorMsg = errorMessage || '';

    for (let i = 0; i < reqList.length; i++) {
        if (reqList[i] === url) {
            cancel(errorMsg)
            return
        }
    }
    reqList.push(url)
}
/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = (reqList, url) => {
    for (let i = 0; i < reqList.length; i++) {
        if (reqList[i] === url) {
            reqList.splice(i, 1)
            break
        }
    }
}

/**
 * 加载动画增加
 * @param {*} loading 
 * @param {*} url 
 */
const loadingList = (loading, url) => {
    if (loading.length == 0) {
        let index = loading.findIndex(item => item.url === url);
        console.log(url);
        if (index == -1 && url != '/adminInfo/checkLogin') {
            let load = ElMessage({
                icon: customIcon,
                message: '加载中...',
                type: 'success',
                duration: 0,
            });
            loading.push({ url: url, vonde: load })
        }
    }
}

/**
 * 加载动画删除
 * @param {*} loading 
 * @param {*} url 
 */
const loadingClose = (loading, url) => {
    let index = loading.findIndex(item => item.url === url);
    if (index != -1) {
        loading[index].vonde.close();
        loading.splice(index, 1)
    }

}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
});
// setInterval(() => {
//     loading.forEach(item => item.vonde.close());
//     loading = [];
// }, 5000)

axiosInstance.interceptors.request.use(
    (config) => {
        // 设置cancelToken对象
        let cancel
        config.cancelToken = new axios.CancelToken(c => cancel = c)
        // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
        stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`);
        loadingList(loading, config.url)
        config.headers['authorization'] = useStore().token || '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(resp => {
    loading.forEach(item => item.vonde.close());
    loading = [];
    // if (resp.config.url != '/adminInfo/checkLogin') {
    //     loadingClose(loading, resp.config.url)
    // }
    // loading.close();
    // 增加延迟，相同请求不得在短时间内重复发送
    // if(resp.config.url == )
    allowRequest(reqList, resp.config.url)
    if (resp.data.status === "success") {
        return Promise.resolve(resp.data);
    }
    else {
        ElMessage.error(resp.data.msg)
        return Promise.resolve(resp.data);
    }
}, error => {
    loading.forEach(item => item.vonde.close());
    loading = [];
    if (error.response) {
        if (error.response.status === 403) {
            useStore().logOut();
            loading.forEach(item => item.vonde.close());
            ElMessageBox({
                title: "提示",
                message: "登录过期，请重新登录",
                type: "warning",
            }).then(() => {
                router.replace({ path: "/Login" })
            })
        } else {
            // 其他错误处理
            ElNotification.error({
                title: '错误',
                message: '服务器出错或是网络错误'
            });

        }
    }
    // return Promise.reject(error.response)
}
);


export default axiosInstance;