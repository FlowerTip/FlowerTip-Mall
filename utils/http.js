import MinaRequest from './request';
import {
	flowerTipToast,
	flowerTipModal
} from '../utils/tool'
import {
	getStorage,
	clearStorage
} from '../utils/storage'
import {
	env
} from '../utils/env'
// 初始化请求实例对象
const instance = new MinaRequest({
	baseURL: env.baseURL,
	timeout: 50000,
	isLoading: true
})

// 配置自定义请求拦截器
instance.interceptors.request = (config) => {
	const token = getStorage('token')
	console.log(token, 'token12312');
	if (token) {
		config.header['token'] = token
	}
	console.log(config, '配置')
	return config
}

// 配置自定义响应拦截器
instance.interceptors.response = async (response) => {
	// 从 response 中解构 isSuccess
	const {
		isSuccess,
		data
	} = response
	// 如果 isSuccess 为 false，说明执行了 fail 回调函数
	// 这时候就说明网络异常，需要给用户提示网络异常
	if (!isSuccess) {
		flowerTipToast({
			title: '网络异常',
			icon: 'error'
		})
		return response
	}
	// 判断服务器响应的业务状态码
	switch (data.code) {
		// 如果后端返回的业务状态码等于 200，说请求成功，服务器成功响应了数据
		case 200:
			return data
			// 如果返回的业务状态码等于 208，说明 没有 token，或者 token 失效
			// 就需要让用户登录或者重新登录
		case 208:
			const res = await flowerTipModal({
				content: '鉴权失败，请重新登录',
				showCancel: false // 不显示取消按钮
			})
			if (res) {
				// 清除之前失效的 token ，同时要清除本地存储的全部信息
				clearStorage()
				wx.navigateTo({
					url: '/pages/login/login'
				})
			}
			return Promise.reject(response)
		default:
			flowerTipToast({
				title: '程序出现异常，请联系客服或稍后重试'
			})
			return Promise.reject(response)
	}
}

export default instance