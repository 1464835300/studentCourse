import axiosInstance from "../axiosInstance";

const customInfo = {
    checkLogin({ loginname, pwd, type }) {
        return axiosInstance.post('/adminInfo/checkLogin', {
            loginname,
            pwd,
            type
        })
    },
    // register({

    // })
}

export default customInfo