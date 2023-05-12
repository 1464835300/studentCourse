<template>
  <div class="main mx-20 mt-10">
    <!-- 按钮组 -->
    <div class="buttonBox mb-5">
      <button
        class="border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        @click="showAdd = true"
      >
        新增
      </button>
      <button
        class="border-[#409eff] rounded-sm bg-[#409eff] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
        type="button"
        @click="getTeacherList"
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
          <el-form-item label="登录名">
            <el-input placeholder="请输入" v-model="query.loginname" />
          </el-form-item>
          <el-form-item label="教师姓名">
            <el-input placeholder="请输入" v-model="query.name" />
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
          <h2 class="text-xl text-primaryColor">教师列表</h2>
        </div>
      </div>
      <div class="table w-full relative">
        <div class="absolute w-full">
          <el-table
            ref="tableInfo"
            :data="resultList.listData"
            border
            max-height="400"
            stripe
            @row-click="handleRowClick"
            style="width: 100%"
          >
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
            <el-table-column width="60" type="index" label="行号" />
            <el-table-column prop="name" label="老师姓名" />
            <el-table-column prop="remark" label="教师职称" />
            <el-table-column prop="phone" label="联系电话" />
            <el-table-column prop="loginname" label="登录名" />
            <el-table-column
              prop="birth"
              :formatter="(row) => row.birth.slice(0, 10)"
              label="生日"
            />
            <el-table-column
              prop="gender"
              :formatter="(row) => (row.gender === 0 ? '男' : '女')"
              label="性别"
            />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phone" label="联系电话" />
            <el-table-column label="操作" width="150px">
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
                  @click="isDeleteBylogin(scope.row)"
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
        label-width="80px"
      >
        <el-form-item required label="登录名" prop="loginname">
          <el-input
            placeholder="请输入"
            v-model="addForm.loginname"
            autocomplete="off"
            :disabled="isDelete"
          />
        </el-form-item>
        <el-form-item v-if="!isDelete" required label="密码" prop="pwd">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="addForm.pwd"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="邮箱" prop="email">
          <el-input
            placeholder="请输入"
            v-model="addForm.email"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="电话" prop="phone">
          <el-input
            placeholder="请输入"
            type="tel"
            v-model="addForm.phone"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item required label="生日" prop="birth">
          <el-date-picker
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="addForm.birth"
            style="width: 100%"
            type="date"
            label="Pick a date"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item required label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required label="姓名" prop="name">
          <el-input
            placeholder="请输入"
            v-model="addForm.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item required label="职称" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="addForm.remark"
            autocomplete="off"
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
import API from "@/utils/API";
// 验证登录名能否使用
const validateLoginname = async (rule, value, callback) => {
  if (isDelete.value) {
    return callback();
  }
  if (value === "") {
    return callback(new Error("请输入登录名"));
  } else {
    if (value.length < 5) {
      return callback(new Error("登录名必须大于5位数"));
    }
    const res = await API.teacherInfo.checkLoginName({ loginname: value });
    console.log(res);
    if (res.status === "success") {
      return callback();
    } else {
      console.log(res);
      return callback(new Error("登录名被使用"));
    }
  }
};
// 邮箱
const validate = async (rule, value, callback) => {
  console.log(rule);
  if (value === "") {
    return callback(new Error("请输入"));
  } else {
    if (rule.field == "email") {
      if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
        callback();
      } else {
        return callback(new Error("邮箱格式不正确"));
      }
    } else {
      if (
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value + ""
        )
      ) {
        callback();
      } else {
        return callback(new Error("手机格式不正确"));
      }
    }
  }
};
const isDelete = ref(false);
const teacherList = ref(); //教师信息
onMounted(async () => {
  getTeacherList();
  const res = await API.teacherInfo.getTeacherList();
  teacherList.value = res.data;
});

const tableInfo = ref(); //表格ref
const addForm = reactive({
  loginname: "",
  email: "",
  phone: "",
  gender: "",
  birth: "",
  remark: "",
  name: "",
  pwd: "",
});
const addFormRef = ref();
// 表单规则
const rules = reactive({
  loginname: [{ validator: validateLoginname, trigger: "blur" }],
  email: [{ validator: validate, trigger: ["change", "blur"] }],
  pwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
  phone: [{ validator: validate, trigger: ["change", "blur"] }],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  birth: [
    {
      type: "date",
      required: true,
      message: "请选择出生年月",
      trigger: "change",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "change",
    },
  ],
  remark: [
    {
      required: true,
      message: "请输入职称",
      trigger: "change",
    },
  ],
});
const showAdd = ref(false); //弹框显示
const resultList = reactive({
  //表格数据
  pageCount: 0,
  pageIndex: 1,
  totalCount: 0,
  listData: [],
});
// 查询条件
const query = reactive({
  loginname: "", //登录名
  name: "", //教师姓名
  remark: "", //教师职称
  pageIndex: 1,
  pageSize: 10,
});
// 获取列表信息
const getTeacherList = async () => {
  const res = await API.teacherInfo.getListByPage(query);
  console.log(res);
  resultList.pageCount = res.data.pageCount;
  resultList.totalCount = res.data.totalCount;
  resultList.listData = res.data.listData;
};
// 分页器改动
const pageChange = (val) => {
  query.pageIndex = val;
  getTeacherList();
};
// 教师修改
const isUpdate = (data) => {
  isDelete.value = true;
  Object.assign(addForm, data);
  showAdd.value = true;
  console.log(addForm);
};
// 新增确认
const confirm = () => {
  addFormRef.value.validate((res) => {
    console.log(res);
    res &&
      ElMessageBox.confirm(`是否提交?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "success",
      }).then(async () => {
        console.log(isDelete);
        let res;
        if (isDelete.value) {
          res = await API.teacherInfo.update(addForm);
        } else {
          res = await API.teacherInfo.addTeacher(addForm);
        }
        clearForm();
        showAdd.value = false;
        if (res.status === "success") {
          ElMessage({
            message: `操作成功`,
            type: "success",
            duration: 1000,
          });
          getTeacherList();
        }
      });
  });
};
// 删除教师
const isDeleteBylogin = (data) => {
  ElMessageBox.confirm(`是否删除?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "success",
  }).then(async () => {
    console.log(isDelete);
    let res = await API.teacherInfo.delete({ loginname: data.loginname });
    if (res.status === "success") {
      ElMessage({
        message: `操作成功`,
        type: "success",
        duration: 1000,
      });
      getTeacherList();
    }
  });
};
// 点击行选择数据
const handleRowClick = (row) => {
  tableInfo.value.toggleRowSelection(row);
};
// 重置表单
const clearForm = () => {
  isDelete.value = false;
  Object.assign(addForm, {
    loginname: "",
    email: "",
    phone: "",
    gender: "",
    birth: "",
    remark: "",
    name: "",
    pwd: "",
  });
};
</script>

<style lang="scss" scoped></style>
