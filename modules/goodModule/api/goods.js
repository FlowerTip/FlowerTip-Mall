import http from '@/utils/http.js'

// 获取商品管理-商品列表数据
export const reqGoodsPageData = ({
	page = 1,
	limit = 10,
	category1Id,
	category2Id
}) => {
	let query = ``
	if (category1Id) {
		query = `category1Id=${category1Id}`
	}
	if (category2Id) {
		query = `category2Id=${category2Id}`
	}
	if (category1Id && category2Id) {
		query = `category1Id=${category1Id}&category2Id=${category2Id}`
	}
	return http.get(`/goods/list/${page}/${limit}?${query}`)
}

// 获取商品详情接口
export const reqGoodDetailData = (goodsId) => http.get(`/goods/${goodsId}`)