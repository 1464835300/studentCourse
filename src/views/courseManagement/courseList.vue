<template>
  <div class="main mx-20 mt-10">
    <!-- 按钮组 -->
    <div class="buttonBox mb-5">
      <button
        class="border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        v-if="!isStudent"
        @click="showAdd = true"
      >
        新增
      </button>
      <button
        class="border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        v-if="isStudent"
        @click="chooseCourse()"
      >
        选课
      </button>

      <button
        class="border-[#409eff] rounded-sm bg-[#409eff] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        @click="isStudent.value ? getChooseList() : getCourseList()"
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
          <el-form-item label="课程名称">
            <el-input placeholder="请输入" v-model="query.cname" />
          </el-form-item>
          <el-form-item v-if="!isTeacher" label="教师姓名">
            <el-input placeholder="请输入" v-model="query.tname" />
          </el-form-item>
          <el-form-item label="教师职称">
            <el-input placeholder="请输入" v-model="query.remark" />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <!-- 表格 -->
    <div class="tableList">
      <div class="mb-5 mt-10 flex flex-row-reverse">
        <el-pagination
          @size-change="getCourseList()"
          @current-change="pageChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultList.totalCount"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 15, 20]"
        >
        </el-pagination>
        <div class="flex-1">
          <h2 class="text-xl text-primaryColor">课程列表</h2>
        </div>
      </div>
      <div class="table w-full relative">
        <div class="absolute w-full">
          <el-table
            ref="tableInfo"
            :data="resultList.listData"
            border
            max-height="400"
            @row-click="handleRowClick"
            @selection-change="selectionChange"
            stripe
            style="width: 100%"
          >
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
            <el-table-column type="selection" width="55" />
            <el-table-column width="60" type="index" label="行号" />
            <el-table-column prop="cno" label="课程编号" />
            <el-table-column prop="cname" label="课程名称" />
            <el-table-column prop="credit" label="学分" />
            <el-table-column
              prop="selectMax"
              :formatter="(row) => `${row.selectPerson}/${row.selectMax}`"
              label="已选课程人数"
            />
            <el-table-column prop="startDate" label="开课时间" />
            <el-table-column prop="endDate" label="结课时间" />
            <el-table-column prop="name" label="授课老师" />
            <el-table-column prop="remark" label="教师职称" />
            <el-table-column prop="phone" label="联系电话" />
            <el-table-column v-if="!isStudent" label="操作" width="150px">
              <template #default="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="isUpdate(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="isDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-model="showAdd" title="课程新增" @close="clearForm()">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item required label="课程名称" prop="cname">
          <el-input
            placeholder="请输入"
            v-model="addForm.cname"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="课程学分" prop="credit">
          <el-input
            placeholder="请输入"
            type="number"
            v-model="addForm.credit"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="授课老师" prop="tno">
          <el-select
            style="width: 100%"
            v-model="addForm.tno"
            placeholder="请选择"
            filterable
            :disabled="isTeacher"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.tno"
              :label="item.name"
              :value="item.tno"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="最大选课人数" prop="selectMax">
          <el-input
            placeholder="请输入"
            type="number"
            v-model="addForm.selectMax"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="开课时间" prop="startDate">
          <el-date-picker
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="addForm.startDate"
            style="width: 100%"
            type="date"
            label="Pick a date"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item required label="结课时间" prop="endDate">
          <el-date-picker
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="addForm.endDate"
            style="width: 100%"
            type="date"
            label="Pick a date"
            placeholder="请选择"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="showAdd = false">取消</el-button>
          <el-button type="primary" @click="confirm()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useStore } from "../../stores";
import API from "@/utils/API";
const store = useStore();
const teacherList = ref(); //教师信息
const isTeacher = ref(false); //是否为教师
const isStudent = ref(false); //是否为学生
onMounted(async () => {
  const res = await API.teacherInfo.getTeacherList();
  teacherList.value = res.data;
  if (store.loginClientInfo.type === 2) {
    isTeacher.value = true;
    query.tname = store.loginClientInfo.name;
    addForm.tno = store.loginClientInfo.tno;
  }
  if (store.loginClientInfo.type === 1) {
    isStudent.value = true;
  }
  if (isStudent.value) {
    getChooseList();
    return;
  }
  getCourseList();
});

const tableInfo = ref(); //表格ref
const addForm = reactive({
  cname: "", //课程名称
  credit: "", //课程学分
  startDate: "", //开课时间
  endDate: "", //结课时间
  tno: "", //授课老师
  selectMax: "", //最大选课人数
});
const addFormRef = ref();
// 表单规则
const rules = reactive({
  cname: [{ required: true, message: "请输入", trigger: "change" }],
  credit: [{ required: true, message: "请输入", trigger: "change" }],
  startDate: [{ required: true, message: "请选择", trigger: "change" }],
  endDate: [{ required: true, message: "请选择", trigger: "change" }],
  tno: [{ required: true, message: "请选择", trigger: "change" }],
  selectMax: [{ required: true, message: "请输入", trigger: "change" }],
});
const showAdd = ref(false); //弹框显示
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
  cname: "",
  tname: "",
  remark: "",
  pageIndex: 1,
  pageSize: 10,
});
// 获取列表信息
const getCourseList = async () => {
  const res = await API.customInfo.getCourseList(query);
  console.log(res);
  resultList.pageCount = res.data.pageCount;
  resultList.totalCount = res.data.totalCount;
  resultList.listData = res.data.listData;
};
// 获取选课列表
const getChooseList = async () => {
  query.sno = store.loginClientInfo.sno;
  const res = await API.studentInfo.chooseCourseList(query);
  resultList.pageCount = res.data.pageCount;
  resultList.totalCount = res.data.totalCount;
  resultList.listData = res.data.listData;
  console.log(res);
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
// 分页器改动
const pageChange = (val) => {
  query.pageIndex = val;
  getCourseList();
};
// 课程修改
const isUpdate = (data) => {
  Object.assign(addForm, data);
  showAdd.value = true;
  console.log(addForm);
};
// 新增确认
const confirm = () => {
  addFormRef.value.validate((res) => {
    res &&
      ElMessageBox.confirm(`是否提交?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "success",
      }).then(async () => {
        console.log(addForm);
        let res;
        if (addForm.cno) {
          res = await API.customInfo.update(addForm);
        } else {
          res = await API.customInfo.addCourse(addForm);
        }
        clearForm();
        showAdd.value = false;
        if (res.status === "success") {
          ElMessage({
            message: `操作成功`,
            type: "success",
            duration: 1000,
          });
          getCourseList();
        }
      });
  });
};
// 删除课程
const isDelete = (data) => {
  ElMessageBox.confirm(`是否删除?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "success",
  }).then(async () => {
    console.log(isDelete);
    let res = await API.customInfo.delete({ cno: data.cno });
    if (res.status === "success") {
      ElMessage({
        message: `操作成功`,
        type: "success",
        duration: 1000,
      });
      getCourseList();
    }
  });
};
// 重置表单
const clearForm = () => {
  Object.assign(addForm, {
    cname: "", //课程名称
    credit: "", //课程学分
    startDate: "", //开课时间
    endDate: "", //结课时间
    tno: isTeacher ? store.loginClientInfo.tno : "", //授课老师
    selectMax: "", //最大选课人数
    cno: "",
  });
};
// 选课功能
const chooseCourse = async () => {
  rowDate.value.forEach((item) => {
    item.sno = store.loginClientInfo.sno;
  });
  let res = await API.customInfo.chooseCourse(rowDate.value);
  console.log(res);
  if (res.status === "success") {
    ElMessage({
      message: `操作成功`,
      type: "success",
      duration: 1000,
    });
    getChooseList();
  }
};
</script>

<style lang="scss" scoped></style>
