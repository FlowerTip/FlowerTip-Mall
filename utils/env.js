// 获取请求地址信息
let env = {
	// #ifndef H5
	baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
	// #endif
	// #ifdef H5
	baseURL: process.env.NODE_ENV === 'development' ? '/h5' : '/prod-h5',
	// #endif
}

export {
	env
}