import http from '../utils/http'

// 用户登录
export const reqLogin = (code) => http.get(`/weixin/wxLogin/${code}`)
// 获取用户信息
export const reqUserInfo = () => http.get(`/weixin/getuserInfo`)
// 更新用户信息
export const reqUpdateUser = (data) => http.post(`/weixin/updateUser`, data)
// 更新头像
export const reqUploadFile = (filePath, file) => http.upload(`/fileUpload`, filePath, file)