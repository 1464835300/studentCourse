import axiosInstance from "../axiosInstance";

const studentInfo = {
    /**
     * 分页查询
     * @param {sno, email, pageIndex = 1} param0 
     * @returns 
     */
    getStudentList({ sno, name, classno, pageIndex = 1, pageSize }) {
        console.log(classno);
        return axiosInstance.post('/studentInfo/getListByPage', {
            sno, classno, name, pageIndex, pageSize
        })
    },
    /**
     * 获取教室信息
     * @returns 
     */
    getClassList() {
        return axiosInstance.post("/studentInfo/getClassList");
    },
    /**
     * 新增学生
     * @param {classno, email, pwd, phone, gender, birth, remark, name } param0 
     * @returns 
     */
    register({ classno, email, pwd, phone, gender, birth, remark, name }) {
        return axiosInstance.post('/studentInfo/register', {
            classno, email, pwd, phone, gender, birth, remark, name
        })
    },
    /**
     * 修改学生信息
     * @param {sno, classno, email, phone, gender, birth, remark, name} param0 
     * @returns 
     */
    update({ sno, classno, email, phone, gender, birth, remark, name }) {
        return axiosInstance.post('/studentInfo/update', {
            sno, classno, email, phone, gender, birth, remark, name
        })
    }
}

export default studentInfo