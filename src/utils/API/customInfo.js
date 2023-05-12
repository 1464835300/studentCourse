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
   * 新增课程
   * @param {*} param0
   */
  addCourse({ cname, credit, startDate, endDate, tno, selectMax }) {
    return axiosInstance.post("/couerInfo/addCourse", {
      cname,
      credit,
      startDate,
      endDate,
      tno,
      selectMax,
    });
  },
  /**
   * 修改课程信息
   * @param {*} param0
   * @returns
   */
  update({ cno, cname, credit, startDate, endDate, tno, selectMax }) {
    return axiosInstance.post("/couerInfo/update", {
      cno,
      cname,
      credit,
      startDate,
      endDate,
      tno,
      selectMax,
    });
  },
  // 删除课程
  delete({ cno }) {
    return axiosInstance.post("/couerInfo/delete", { cno });
  },
  /**
   * 查询选择课程学生
   * @param {*} param0
   * @returns
   */
  getSeletedByCourse({ cname, tname, sname, pageIndex, pageSize, sno }) {
    return axiosInstance.post("/couerInfo/getSeletedByCourse", {
      cname,
      tname,
      sname,
      pageIndex,
      pageSize,
      sno,
    });
  },
  /**
   * 退课
   * @param {*} param0
   */
  dropCourse({ id }) {
    return axiosInstance.post("/couerInfo/dropCourse", { id });
  },

  /**
   *
   * @param {Array} arr
   */
  chooseCourse(arr) {
    return axiosInstance.post("/couerInfo/chooseCourse", {
      ChooseList: JSON.stringify(arr),
    });
  },
};

export default customInfo;
