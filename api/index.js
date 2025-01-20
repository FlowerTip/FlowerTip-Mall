import http from '../utils/http'

// 获取轮播图数据
export const reqIndexPageData = () => http.all(
	http.get('/index/findBanner'),
	http.get('/index/findCategory1'),
	http.get('/index/advertisement'),
	http.get('/index/findListGoods'),
	http.get('/index/findRecommendGoods'),
)