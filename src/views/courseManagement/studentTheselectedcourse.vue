<template>
    <div class="main mx-20 mt-10">
        <!-- 按钮组 -->
        <div class="buttonBox mb-5">
            <button
                class=" border-[#67c23a] rounded-sm bg-[#67c23a] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
                type="button" @click="showAdd = true">退课</button>
            <button
                class=" border-[#409eff] rounded-sm bg-[#409eff] borde border text-sm text-white whitespace-nowrap px-14 py-4 mx-2"
                type="button" @click="getAdminInfoList">查询</button>
        </div>
        <!-- 查询 -->
        <el-form :inline="true" :model="query" label-width="80px">
            <el-collapse class="border border-[#ebeef5] ">
                <el-collapse-item name="1">
                    <template #title>
                        <span class="ml-[30px] font-bold text-[#409eff]">查询条件</span>
                    </template>
                    <el-form-item label="登录名">
                        <el-input placeholder="请输入" v-model="query.loginname" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input placeholder="请输入" v-model="query.email" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>

        </el-form>
        <!-- 表格 -->
        <div class="tableList">
            <div class="mb-5 mt-10 flex flex-row-reverse ">
                <el-pagination @size-change="getAdminInfoList()" @current-change="pageChange"
                    layout="total, sizes, prev, pager, next, jumper" :total="resultList.totalCount"
                    v-model:page-size="query.pageSize" :page-sizes="[5, 10, 15, 20]">
                </el-pagination>
                <div class="flex-1">
                    <h2 class=" text-xl text-primaryColor ">课程列表</h2>
                </div>
            </div>
            <div class="table w-full relative">
                <div class=" absolute w-full">
                    <el-table ref="tableInfo" :data="resultList.listData" border max-height="400" stripe
                        style="width: 100%">
                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                        <el-table-column type="selection" width="55" />
                        <el-table-column width="60" type="index" label="行号" />
                        <el-table-column prop="con" label="课程编号" />
                        <el-table-column prop="cname"  label="课程名称" />
                        <el-table-column prop="code"  label="学分" />
                        <el-table-column prop="bdata" label="开课时间" />
                        <el-table-column prop="edata" label="结课时间" />
                        <el-table-column prop="teacher" label="授课老师" />
                        <el-table-column prop="tel" label="联系电话" />

                    </el-table>
                </div>
            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog v-model="showAdd" title="管理员新增">
            <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="80px">
                <el-form-item required label="登录名" prop="loginname">
                    <el-input placeholder="请输入" v-model="addForm.loginname" autocomplete="off" />
                </el-form-item>
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
                <el-form-item label="姓名">
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

onMounted(() => {
    getAdminInfoList();
})
const tableInfo = ref();        //表格ref
const addForm = reactive({
    loginname: "",  //登录名
    email: "",      //邮箱
    pwd: "",        //密码
    phone: "",      //电话
    gender: "",     //性别
    birth: "",      //生日
    remark: "",     //个性签名
    name: ""        //姓名
});
const addFormRef = ref();
// 验证登录名能否使用
const validateLoginname = async (rule, value, callback) => {
    if (value === '') {
        return callback(new Error('请输入登录名'))
    } else {
        if (value.length < 5) {
            return callback(new Error('登录名必须大于5位数'))
        }
        const res = await API.adminInfo.checkLoginName({ loginname: value });
        console.log(res);
        if (res.status === 'success') {
            return callback()
        }
        else {
            console.log(res);
            return callback(new Error('登录名被使用'))
        }
    }
}
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
    loginname: [{ validator: validateLoginname, trigger: 'blur' },],
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
    loginname: "",
    email: "",
    pageIndex: 1,
    pageSize: 5
});
// 获取列表信息
const getAdminInfoList = async () => {
    const res = await API.adminInfo.getAdminList(query);
    console.log(res);
    resultList.pageCount = 1;
    resultList.totalCount = 2;
    resultList.listData = [{
        con: "127",
        cname: "Spring开发技术",
        code: 10,
        bdata: "2022-10-1",
        edata: "2023-1-2",
        teacher: "刘大大",
        tel: "15972078836"
    }, {
        con: "24",
        cname: "Node开发技术",
        code: 15,
        bdata: "2022-9-1",
        edata: "2022-11-2",
        teacher: "张大大",
        tel: "15972079836"
    }];
}
// 分页器改动
const pageChange = (val) => {
    query.pageIndex = val;
    getAdminInfoList();
}


// 状态改变
const isActive = (data, type) => {
    ElMessageBox.confirm(
        `是否${type === 0 ? "激活" : "冻结"}?`,
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
            message: `${type === 0 ? "激活" : "冻结"}成功`,
            type: 'success',
            duration: 1000,
        })
        getAdminInfoList();
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
                getAdminInfoList();
            })
        })
    })

}
</script>
    
<style lang="scss" scoped></style>