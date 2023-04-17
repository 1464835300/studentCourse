<template>
    <div class="w-full h-full home overflow-auto">
        <h2 class=" text-white font-bold text-2xl ml-[40px]  mt-[60px]">欢迎使用学生选课系统</h2>
    </div>
</template>
    
<script setup>
import { reactive, onMounted } from 'vue';
import homeView from '../components/homeView.vue';
import API from '../utils/API';
import { useStore } from "../stores";
import { useRouter } from "vue-router";


const store = useStore();
const router = useRouter();
// 菜单列表


</script>
    
<style>
.home {
    background-image: url("../assets/img/Home.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}
</style>