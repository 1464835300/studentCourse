export default {
  name: "管理员菜单",
  items: [
    {
      text: "教师管理",
      icon: "location",
      items: [
        {
          text: "教师列表",
          url: "/teacherManagement/teacherList",
        },
      ],
    },
    {
      text: "课程管理",
      icon: "Menu",
      items: [
        {
          text: "课程列表",
          url: "/courseManagement/courseList",
        },
        {
          text: "查询学生所选课程",
          url: "/courseManagement/courseListforStudent",
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
    {
      text: "管理员维护",
      icon: "UserFilled",
      items: [
        {
          text: "管理员列表",
          url: "/adminManagement/adminList",
        },
      ],
    },
  ],
};
