import http from '../../../utils/http'

// 新增 || 更新收货地址
export const reqSaveUserAddress = (data) => {
	if (data.id) {
		return http.post(`/userAddress/update`, data)
	} else {
		return http.post(`/userAddress/save`, data)
	}
}

// 收货地址列表
export const reqGetAddressList = () => http.get(`/userAddress/findUserAddress`)

// 收货地址详情
export const reqGetAddressDetail = (id) => http.get(`/userAddress/${id}`)

// 删除收货地址
export const reqDelAddress = (id) => http.get(`/userAddress/delete/${id}`)