export default {
  name: "老师菜单",
  items: [
    {
      text: "课程管理",
      icon: "Menu",
      items: [
        {
          text: "教授课程列表",
          url: "/courseManagement/courseList",
        },
      ],
    },
    {
      text: "学生管理",
      icon: "Tools",
      items: [
        {
          text: "学生列表",
          url: "/studentManagement/studentList",
        },
      ],
    },
  ],
};
