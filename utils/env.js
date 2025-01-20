// 获取请求地址信息
let env = {
	// #ifndef H5
	baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
	// #endif
	// #ifdef H5
	baseURL: '/h5',
	// #endif
}

// switch (envVersion) {
// 	case 'develop':
// 		env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
// 		break

// 	case 'trial':
// 		env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
// 		break

// 	case 'release':
// 		env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
// 		break

// 	default:
// 		env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
// }

export {
	env
}