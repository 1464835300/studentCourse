import axiosInstance from "../axiosInstance";

const adminInfo = {
    /**
     * 登录验证
     * @param {loginname, pwd, type} param0 
     * @returns 
     */
    checkLogin({ loginname, pwd, type }) {
        return axiosInstance.post('/adminInfo/checkLogin', {
            loginname,
            pwd,
            type
        })
    },
    /**
     * 分页查询
     * @param {loginname, email, pageIndex = 1,pageSize} param0 
     * @returns 
     */
    getAdminList({ loginname, email, pageIndex = 1, pageSize }) {
        return axiosInstance.post('/adminInfo/getListByPage', {
            loginname, email, pageIndex, pageSize
        })
    },
    /**
     * 激活冻结
     * @param {loginname, type} param0 
     * @returns 
     */
    onFreeze({ loginname, type }) {
        return axiosInstance.post('/adminInfo/freeze', {
            loginname, type
        })
    },
    /**
     * 验证登录名是否可用
     * @param {loginname} 登录名
     * @returns 
     */
    checkLoginName({ loginname }) {
        return axiosInstance.post('/adminInfo/checkLoginname', {
            loginname
        })
    },

    register({ loginname, email, pwd, phone, gender, birth, remark, name }) {
        return axiosInstance.post('/adminInfo/register', {
            loginname, email, pwd, phone, gender, birth, remark, name
        })
    }
}

export default adminInfo