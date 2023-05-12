<template>
    <page-view class="relative flex justify-center items-center">
        <img src="../assets/img/LOGIN.png" @load="state.loading = false;"
            class="login-bg absolute w-full h-full -z-10 right-[100px]" />
        <div class="absolute w-[300px] px-[60px] box-border h-full bg-white right-0 shadow-xl">
            <h1 class="mt-[160px] mb-[20px] text-center text-green-600 font-bold">
                学生选课系统
            </h1>
            <el-form :model="form" ref="formRef" :rules="customInfoRules" :inline="false">
                <el-form-item prop="loginname">
                    <el-input v-model="form.loginname" :prefix-icon="User" placeholder="登录名" clearable></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="form.pwd" :prefix-icon="Lock" placeholder="密码" clearable></el-input>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select v-model="form.type" placeholder="请选择登录人" clearable>
                        <el-option label="管理员" :value="0" />
                        <el-option label="学生" :value="1" />
                        <el-option label="老师" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="w-full mt-[30px]" color="#00b259" @click="loginCheck">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <loading :show="state.loading"></loading>
    </page-view>
</template>
  
<script setup>
import { Lock } from "@element-plus/icons-vue";
import { User } from "@element-plus/icons-vue";
import loading from "../components/loading.vue";
import { ElMessage, ElLoading } from 'element-plus'
import API from '../utils/API'
import { ref, reactive, onMounted } from "vue";
import { useStore } from "../stores";
import { useRouter } from "vue-router";


// setTimeout(() => {
//   state.loading = false;
// }, 1000);
// onMounted(()=>{
//     location.reload();
// })
const store = useStore();
const router = useRouter();

const state = reactive({ loading: true, });
const form = reactive({
    loginname: "",
    pwd: "",
    type: 0
});
// 验证规则
const customInfoRules = {
    loginname: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择登录人', trigger: 'blur' }
    ]

};

const formRef = ref(null);

// 登录提交
const loginCheck = () => {
    formRef.value.validate(async valid => {
        if (!valid) {
            return
        }
        const loading = ElLoading.service({
            lock: true,
            text: '正在登录请稍后',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        loading.close();
        let result = await API.adminInfo.checkLogin(form);

        loading.close();
        console.log(result);
        if (result.status === 'success') {
            ElMessage({ message: result.msg, type: "success" });
            store.setToken(result.token);
            store.setLoginInfo(result.data);
            router.replace({ path: "/Home" });

            // 获取菜单列表
            const menuData = getMenuList()
            store.setMenuList(menuData);
            console.log(store);
        } else {

        }


    })
}
// 获取菜单
const getMenuList = () => {
    let menuData = [];
    const files = import.meta.globEager('../modules/*.js');
    let modules = {}
    for (const [key, value] of Object.entries(files)) {
        //名称  因为这里拿到的是  ./modules/app.js ，所以需要两层处理
        let moduleName = key.replace(/^\.\.\/(.*)\.\w+$/, '$1');
        const name = moduleName.split('/')[1]

        //具体的内容，都是每个js中返回值  value.default
        modules[name] = value.default
    }
    console.log(modules);
    // 判断登陆人
    switch (store.loginClientInfo.type) {
        case 0:
            menuData.push(...modules.admin.items)
            break;
        case 1:
            menuData.push(...modules.student.items)
            break;
        case 2:
            menuData.push(...modules.teacher.items)
            break;
    }
    return menuData
}

</script>
  
<style lang="scss" scoped>
.login-bg {
    // background: url(../assets/img/LOGIN.png) no-repeat;
    object-fit: contain;
    max-height: 100%;

}
</style>
  