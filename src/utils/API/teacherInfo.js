import axiosInstance from "../axiosInstance";

const teacherInfo = {
  // 获取所有老师信息
  getTeacherList() {
    return axiosInstance.post("/teacherInfo/teacherList");
  },
  /**
   * 分页获取老师信息
   * @param {*} param0
   * @returns
   */
  getListByPage({ loginname, name, remark, pageIndex = 1, pageSize }) {
    return axiosInstance.post("/teacherInfo/getListByPage", {
      loginname,
      name,
      remark,
      pageIndex,
      pageSize,
    });
  },
  /**
   * 验证登录名是否可用
   * @param {loginname} 登录名
   * @returns
   */
  checkLoginName({ loginname }) {
    return axiosInstance.post("/teacherInfo/checkLoginname", {
      loginname,
    });
  },
  /**
   * 新增老师
   * @param {*} param0
   * @returns
   */
  addTeacher({ loginname, email, pwd, phone, gender, birth, remark, name }) {
    return axiosInstance.post("/teacherInfo/register", {
      loginname,
      email,
      pwd,
      phone,
      gender,
      birth,
      remark,
      name,
    });
  },
  /**
   * 更改老师
   * @param {*} param0
   * @returns
   */
  update({ loginname, email, phone, gender, birth, remark, name }) {
    return axiosInstance.post("/teacherInfo/update", {
      loginname,
      email,
      phone,
      gender,
      birth,
      remark,
      name,
    });
  },
  // 删除
  delete({ loginname }) {
    return axiosInstance.post("/teacherInfo/delete", { loginname });
  },
};

export default teacherInfo;
