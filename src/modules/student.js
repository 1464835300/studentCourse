export default {
    name: "学生菜单",
    items: [{
        text: '学生信息维护',
        icon: 'Tools',
        items: [{
            text: '已选课程列表',
            url: '/courseManagement/studentTheselectedcourse',
        }, {
            text: '选课',
            url: '/courseManagement/courseList',
        }]
    }]
}