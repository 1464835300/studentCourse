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
    }
}

export default studentInfo