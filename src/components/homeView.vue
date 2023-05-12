<template>
  <page-view class="main">
    <div class="navbar h-full">
      <el-menu
        unique-opened
        router
        :default-active="activeIndex"
        ref="menuRef"
        active-text-color="#ffd04b"
        text-color="#fff"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
      >
        <div class="h-[56px] flex items-center justify-center">
          <div v-if="isCollapse">
            <el-icon :size="20" color="#fff" class="ml-[2px] is-loading">
              <Sunny />
            </el-icon>
          </div>
          <div v-else class="flex items-center">
            <el-icon :size="30" color="#fff" class="is-loading">
              <Sunny />
            </el-icon>
            <h1 class="whitespace-nowrap text-white ml-[20px]">学生选课系统</h1>
          </div>
        </div>
        <template v-for="(row, index1) in menuData" :key="index1">
          <el-sub-menu :index="index1 + ''">
            <template #title>
              <el-icon>
                <component :is="row.icon"></component>
              </el-icon>
              <span class="ml-[10px]">{{ row.text }}</span>
            </template>

            <el-menu-item-group :title="row.text">
              <template v-for="(item, index2) in row.items" :key="index2">
                <el-menu-item @click="selectClick(item)" :index="item.url">{{
                  item.text
                }}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    <div class="min-w-[400px] flex-1 overflow-auto flex flex-col">
      <div class="title-tab h-fit relative">
        <div class="title-top shadow">
          <div
            class="mx-10 mt-10"
            v-if="isCollapse"
            @click="isCollapse = false"
          >
            <el-icon :size="28" color=" #73767a">
              <Expand />
            </el-icon>
          </div>
          <div class="m-10" v-else @click="isCollapse = true">
            <el-icon :size="28" color=" #73767a">
              <Fold />
            </el-icon>
          </div>
          <ul class="list-none absolute top-0 right-0 flex flex-row-reverse">
            <li class="mr-[20px] mt-[10px]">
              <el-tooltip effect="dark" content="个人信息" placement="bottom">
                <div @click="drawer = true">
                  <el-icon :size="25" color=" #73767a">
                    <User />
                  </el-icon>
                </div>
              </el-tooltip>
            </li>
            <li class="mr-[20px] mt-[10px]">
              <el-tooltip effect="dark" content="消息提醒" placement="bottom">
                <div>
                  <el-icon :size="25" color=" #73767a">
                    <Message />
                  </el-icon>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="title-bottom box-border pl-20 shadow">
          <ul class="tabs list-none flex relative">
            <template v-for="(row, index) in tabList">
              <li
                class="item w-fit px-20 mx-0 transition-all cursor-pointer"
                :class="{ isActive: tabsSelect === index }"
                @click="tabChange(index, row.url)"
              >
                {{ row.text }}
                <el-icon
                  @click.stop="closeClick(index)"
                  v-if="row.isClose"
                  class="close-icon ml-5"
                  :size="10"
                  color=" #73767a"
                >
                  <CloseBold />
                </el-icon>
              </li>
            </template>
            <li class="absolute top-2 bottom-0 my-auto right-2">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-icon :size="15" class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="closeAll"
                      >关闭所有标签</el-dropdown-item
                    >
                    <el-dropdown-item @click="closeOther"
                      >关闭其他标签</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <slot> </slot>
      </div>
    </div>

    <el-drawer size="350" v-model="drawer" :with-header="false">
      <el-container class="personInfo">
        <el-header class="personInfo-top">{{
          store.loginClientInfo.loginname
        }}</el-header>
        <el-main class="personInfo-med">
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">邮箱：</el-col>
            <el-col :span="16">{{ store.loginClientInfo.email }}</el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">姓名：</el-col>
            <el-col :span="16">{{ store.loginClientInfo.name }}</el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">联系电话：</el-col>
            <el-col :span="16">{{ store.loginClientInfo.phone }}</el-col>
          </el-row>
        </el-main>
        <el-footer class="personInfo-bottom">
          <el-button style="width: 45%" text @click="updateInfo()"
            >设置</el-button
          >
          <el-button style="width: 45%" text @click="loginOut()"
            >退出</el-button
          >
        </el-footer>
      </el-container>
    </el-drawer>
  </page-view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "../stores";
import { useRouter } from "vue-router";
import { update } from "lodash";
import { ElMessageBox } from "element-plus";

const store = useStore();
const router = useRouter();
const menuData = store.menuList; //菜单列表
const activeIndex = ref(""); //菜单索引

const menuRef = ref(); //选中菜单
const isCollapse = ref(true); //是否折叠
const drawer = ref(false); //登陆人信息面板
let tabsSelect = ref(0); //导航栏信息默认首页

const tabList = reactive([{ text: "首页", url: "/Home", isClose: false }]); //导航栏列表
/**
 * 点击菜单增加导航栏
 * @param {Object} item 菜单数据
 */
const selectClick = (item) => {
  let index = tabList.findIndex((row) => row.url === item.url);
  if (index === -1 || !index) {
    let obj = {
      text: item.text,
      url: item.url,
      isClose: true,
    };
    tabList.push(obj);
    tabsSelect.value = tabList.length - 1;
    activeIndex.value = item.url;
  } else {
    tabsSelect.value = index;
    activeIndex.value = item.url;
  }
};
/**
 * 点击导航栏跳转
 * @param {*} key 导航栏索引
 * @param {*} keyPath 导航栏路由
 */
const tabChange = (key, keyPath) => {
  tabsSelect.value = key;
  router.push(keyPath);
  console.log(key);
  activeIndex.value = keyPath;
};

const closeClick = (index) => {
  tabList.splice(index, 1);
  tabsSelect.value = tabList.length - 1;
  activeIndex.value = tabList[tabList.length - 1].url;
  router.push(activeIndex.value);
};
// 关闭所有
const closeAll = () => {
  tabList.splice(1, tabList.length - 1);
  tabsSelect.value = 0;
  activeIndex.value = "/Home";
  router.push("/Home");
};
// 关闭其他

const closeOther = () => {
  tabList.splice(tabsSelect.value + 1, 100);
  tabList.splice(1, tabList.length - 2);
  tabsSelect.value = 1;
  activeIndex.value = tabList[1].url;
  router.push(tabList[1].url);
};
// 退出登录
const loginOut = () => {
  ElMessageBox.confirm(`是否退出登录?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "success",
  }).then(async () => {
    router.push("/login");
    // location.reload();
    store.logOut();
  });
};
// 修改密码
const updateInfo = () => {
  console.log(store.loginClientInfo.type);
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;

  .navbar {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      height: 100%;
      border-right: 2px solid #545c64;
    }

    .el-menu--collapse {
      height: 100%;
      border-right: 2px solid #545c64;
    }
  }

  .tabs {
    .item {
      height: 30px;
      font-size: 14px;
      text-align: center;
      line-height: 30px;

      &:not(&:first-child) {
        margin-right: -20px;
      }

      &::before {
        position: absolute;
        display: block;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        content: "";
        width: 0;
        height: 2px;
        background-color: #409eff;
      }
    }

    .close-icon {
      :hover {
        background-color: #9a9a9b;
        color: #fff;
        border-radius: 50%;
      }
    }

    .isActive {
      position: relative;
      color: #409eff;
      margin-right: 0px !important;

      .close-icon {
        // display: none;
        opacity: 1;
      }

      &::before {
        transition: all linear 200ms;
        position: absolute;
        display: block;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        content: "";
        width: 100%;
        height: 2px;
        background-color: #409eff;
      }
    }

    .close-icon {
      // display: none;
      opacity: 0;
      transition: all linear 150ms;
    }

    :hover {
      color: #409eff;
      margin-right: 0px !important;

      .close-icon {
        // display: inline-block;
        opacity: 1;
        transition: all linear 150ms;
      }
    }
  }
  .personInfo {
    height: 100%;
    .personInfo-top {
      height: 200px;
      background-color: #409efc;
      text-align: center;
      line-height: 200px;
    }
    .personInfo-bottom {
      height: fit-content;
      display: flex;
      justify-content: space-around;
      margin-bottom: 10px;
    }
  }
}
</style>
