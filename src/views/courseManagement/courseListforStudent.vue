<template>
  <div class="main mx-20 mt-10">
    <!-- 按钮组 -->
    <div class="buttonBox mb-5">
      <button
        class="border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        @click="dropCourse"
      >
        退课
      </button>
      <button
        class="border-[#409eff] rounded-sm bg-[#409eff] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        @click="getInfoList"
      >
        查询
      </button>
    </div>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" label-width="80px">
      <el-collapse class="border border-[#ebeef5]">
        <el-collapse-item name="1">
          <template #title>
            <span class="ml-[30px] font-bold text-[#409eff]">查询条件</span>
          </template>
          <el-form-item label="学生姓名">
            <el-input placeholder="请输入" v-model="query.sname" />
          </el-form-item>
          <el-form-item label="学生学号">
            <el-input placeholder="请输入" v-model="query.sno" />
          </el-form-item>
          <el-form-item label="老师姓名">
            <el-input placeholder="请输入" v-model="query.tname" />
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input placeholder="请输入" v-model="query.cname" />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <!-- 表格 -->
    <div class="tableList">
      <div class="mb-5 mt-10 flex flex-row-reverse">
        <el-pagination
          @size-change="getInfoList()"
          @current-change="pageChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultList.totalCount"
          v-model:page-size="query.pageSize"
          :page-sizes="[5, 10, 15, 20]"
        >
        </el-pagination>
        <div class="flex-1">
          <h2 class="text-xl text-primaryColor">已选课程列表</h2>
        </div>
      </div>
      <div class="table w-full relative">
        <div class="absolute w-full">
          <el-table
            ref="tableInfo"
            @selection-change="selectionChange"
            @row-click="handleRowClick"
            :data="resultList.listData"
            border
            max-height="400"
            stripe
            style="width: 100%"
          >
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
            <el-table-column type="selection" width="55" />
            <el-table-column width="60" type="index" label="行号" />
            <el-table-column prop="cname" label="课程名称" />
            <el-table-column prop="credit" label="学分" />
            <el-table-column prop="startDate" label="开课时间" />
            <el-table-column prop="endDate" label="结课时间" />
            <el-table-column prop="teacherName" label="授课老师" />
            <el-table-column prop="studentName" label="选课学生" />
            <el-table-column prop="sno" label="选课学生学号" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import API from "@/utils/API";

onMounted(() => {
  getInfoList();
});
const tableInfo = ref(); //表格ref
const rowDate = ref(); //选中数据
const resultList = reactive({
  //表格数据
  pageCount: 0,
  pageIndex: 1,
  totalCount: 0,
  listData: [],
});
// 查询条件
const query = reactive({
  cname: "", //课程名称
  tname: "", //老师名称
  sname: "", //学生名称
  sno: "", //学生学号
  pageIndex: 1,
  pageSize: 5,
});
// 获取列表信息
const getInfoList = async () => {
  const res = await API.customInfo.getSeletedByCourse(query);
  console.log(res);
  resultList.pageCount = 1;
  resultList.totalCount = 2;
  resultList.listData = res.data.listData;
};

// 分页器改动
const pageChange = (val) => {
  query.pageIndex = val;
  getInfoList();
};

// 点击行选择数据
const handleRowClick = (row) => {
  tableInfo.value.toggleRowSelection(row);
};

// 切换选择数据
const selectionChange = (val) => {
  rowDate.value = val;
  console.log(rowDate);
};

// 退课
const dropCourse = () => {
  console.log(rowDate.value);
  if (!rowDate.value || rowDate.value.length === 0) {
    ElMessage({
      message: "至少选中一条数据",
      type: "warning",
    });
    return;
  }
  ElMessageBox.confirm(`是否退课?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let data = rowDate.value.map((item) => item.id).join();
    const res = await API.customInfo.dropCourse({ id: data });
    console.log(res);
    if (res.status === "success") {
      ElMessage({
        message: `退课成功`,
        type: "success",
        duration: 1000,
      });
      getInfoList();
    }
  });
};
</script>

<style lang="scss" scoped></style>
