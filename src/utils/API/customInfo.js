import axiosInstance from "../axiosInstance";

const customInfo = {
  /**
   * 获取课程列表
   * @param {*} param0
   * @returns
   */
  getCourseList({
    cname,
    tname,
    remark,
    startDate,
    endDate,
    pageIndex = 1,
    pageSize,
  }) {
    return axiosInstance.post("/couerInfo/getListByPage", {
      cname,
      tname,
      remark,
      startDate,
      endDate,
      pageIndex,
      pageSize,
    });
  },
  /**
   * 查询选择课程学生
   * @param {*} param0
   * @returns
   */
  getSeletedByCourse({ cname, tname, sname, pageIndex, pageSize }) {
    return axiosInstance.post("/couerInfo/getSeletedByCourse", {
      cname,
      tname,
      sname,
      pageIndex,
      pageSize,
    });
  },
  /**
   * 退课
   * @param {*} param0
   */
  dropCourse({ id }) {
    return axiosInstance.post("/couerInfo/dropCourse", { id });
  },
};

export default customInfo;
