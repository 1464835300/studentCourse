<template>
    <div class="main mx-20 mt-10">
        <!-- 按钮组 -->
        <div class="buttonBox mb-5">
            <button
                class=" border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
                type="button" @click="showAdd = true">新增</button>
            <button
                class=" border-[#409eff] rounded-sm bg-[#409eff] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
                type="button" @click="getStudentInfoList">查询</button>
        </div>
        <!-- 查询 -->
        <el-form :inline="true" :model="query" label-width="80px">
            <el-collapse class="border border-[#ebeef5] ">
                <el-collapse-item name="1">
                    <template #title>
                        <span class="ml-[30px] font-bold text-[#409eff]">查询条件</span>
                    </template>
                    <el-form-item label="学号">
                        <el-input placeholder="请输入" v-model="query.sno" />
                    </el-form-item>
                    <el-form-item label="教室名称">
                        <el-select v-model="query.classno" placeholder="请选择" clearable filterable>
                            <el-option v-for="item in classList" :key="item.classno" :label="item.cname"
                                :value="item.classno">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学生名称">
                        <el-input placeholder="请输入" v-model="query.name" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>

        </el-form>
        <!-- 表格 -->
        <div class="tableList">
            <div class="mb-5 mt-10 flex flex-row-reverse ">
                <el-pagination @size-change="getStudentInfoList()" @current-change="pageChange"
                    layout="total, sizes, prev, pager, next, jumper" :total="resultList.totalCount"
                    v-model:page-size="query.pageSize" :page-sizes="[5, 10, 15, 20]">
                </el-pagination>
                <div class="flex-1">
                    <h2 class=" text-xl text-primaryColor ">管理员列表</h2>
                </div>
            </div>
            <div class="table w-full relative">
                <div class=" absolute w-full">
                    <el-table ref="tableInfo" :data="resultList.listData" border max-height="400" stripe
                        style="width: 100%">
                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                        <el-table-column width="60" type="index" label="行号" />
                        <el-table-column prop="sno" label="学号" />
                        <el-table-column prop="name" label="姓名" />
                        <el-table-column prop="cname" label="班级" />
                        <el-table-column prop="birth" :formatter="(row) => row.birth.slice(0, 10)" label="生日" />
                        <el-table-column prop="gender" :formatter="(row) => row.gender === 0 ? '男' : '女'" label="性别" />
                        <el-table-column prop="email" label="邮箱" />
                        <el-table-column prop="phone" label="电话" />
                        <!-- <el-table-column prop="isFreeze" label="状态">
                            <template #default="scope">
                                <span v-if="scope.row.isFreeze === 0" style="color:#16bc6a">激活</span>
                                <span v-else style="color:#c80000">冻结</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="操作" width="150px">
                            <template #default="scope">
                                <el-button size="small" type="success" @click="showAdd = true">编辑</el-button>
                                <el-button size="small" type="danger" @click="isDelete(scope.row, 1)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog v-model="showAdd" title="管理员新增">
            <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="80px">
                <!-- <el-form-item required label="登录名" prop="loginname">
                    <el-input placeholder="请输入" v-model="addForm.loginname" autocomplete="off" />
                </el-form-item> -->
                <el-form-item required label="密码" prop="pwd">
                    <el-input placeholder="请输入密码" type="password" v-model="addForm.pwd" autocomplete="off" />
                </el-form-item>
                <el-form-item required label="邮箱" prop="email">
                    <el-input placeholder="请输入" v-model="addForm.email" autocomplete="off" />
                </el-form-item>
                <el-form-item required label="电话" prop="phone">
                    <el-input placeholder="请输入" type="tel" v-model="addForm.phone" autocomplete="off" />
                </el-form-item>

                <el-form-item required label="生日" prop="birth">
                    <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="addForm.birth"
                        style="width: 100%;" type="date" label="Pick a date" placeholder="请选择" />
                </el-form-item>
                <el-form-item required label="性别" prop="gender">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio :label="0">男</el-radio>
                        <el-radio :label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="姓名" required>
                    <el-input placeholder="请输入" v-model="addForm.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="个性签名">
                    <el-input type="textarea" placeholder="请输入" v-model="addForm.remark" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="showAdd = false">取消</el-button>
                    <el-button type="primary" @click="confirm()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
    
<script setup>
import { reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import API from '@/utils/API';


const classList = ref([]);
const tableInfo = ref();        //表格ref
const addForm = reactive({
    email: "",      //邮箱
    pwd: "",        //密码
    phone: "",      //电话
    gender: "",     //性别
    birth: "",      //生日
    remark: "",     //个性签名
    name: ""        //姓名
});
const addFormRef = ref();
// 邮箱
const validate = async (rule, value, callback) => {
    console.log(rule);
    if (value === '') {
        return callback(new Error('请输入'))
    } else {
        if (rule.field == 'email') {
            if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
                callback()
            } else {
                return callback(new Error('邮箱格式不正确'))
            }
        }
        else {
            if (/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
                callback()
            } else {
                return callback(new Error('手机格式不正确'))
            }
        }
    }
}
// 表单规则
const rules = reactive({
    email: [{ validator: validate, trigger: ['change', 'blur'] },],
    pwd: [{
        required: true,
        message: '请输入密码',
        trigger: 'change',
    },],
    phone: [{ validator: validate, trigger: ['change', 'blur'], }],
    gender: [{
        required: true,
        message: '请选择性别',
        trigger: 'change',
    },],
    birth: [{
        type: 'date',
        required: true,
        message: '请选择出生年月',
        trigger: 'change',
    },],
})
const showAdd = ref(false);     //弹框显示
const resultList = reactive({   //表格数据
    pageCount: 0,
    pageIndex: 1,
    totalCount: 0,
    listData: []
});
// 查询条件
const query = reactive({
    sno: "",    //学号
    classno: "",    //教室名称
    name: "",   //学生姓名
    pageIndex: 1,
    pageSize: 5
});

onMounted(async () => {
    getStudentInfoList();
    const res = await API.studentInfo.getClassList()
    classList.value = res.data;
    console.log(classList);
})
// 获取列表信息
const getStudentInfoList = async () => {
    console.log(query);
    const res = await API.studentInfo.getStudentList(query);
    console.log(res);
    resultList.pageCount = res.data.pageCount;
    resultList.totalCount = res.data.totalCount;
    resultList.listData = res.data.listData;
}
// 分页器改动
const pageChange = (val) => {
    query.pageIndex = val;
    getStudentInfoList();
}


// 状态改变
const isDelete = (data, type) => {
    ElMessageBox.confirm(
        `是否删除?`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await API.adminInfo.onFreeze({
            loginname: data.loginname,
            type: type
        });
        res.data && ElMessage({
            message: `删除成功`,
            type: 'success',
            duration: 1000,
        })
        getStudentInfoList();
    })

}

// 新增确认
const confirm = () => {
    addFormRef.value.validate((res) => {
        res && ElMessageBox.confirm(
            `是否提交?`,
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'success',
            }
        ).then(async () => {
            const res = await API.adminInfo.register(addForm);
            addFormRef.value.resetFields();
            showAdd.value = false;
            res.data && ElMessage({
                message: `注册成功`,
                type: 'success',
                duration: 1000,
            }).then(() => {
                getStudentInfoList();
            })
        })
    })

}
</script>
    
<style lang="scss" scoped></style>