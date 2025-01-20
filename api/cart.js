import http from '../utils/http'

// 加入购物车
export const reqAddToCart = ({
	goodsId,
	count
}) => http.get(`/cart/addToCart/${goodsId}/${count}`)

// 购物车列表
export const reqGetCartList = () => http.get(`/cart/getCartList`)

// 更新商品状态
export const reqCheckCart = ({
	goodsId,
	isChecked
}) => http.get(`/cart/checkCart/${goodsId}/${isChecked}`)

// 全选与全不选
export const reqCheckAllCart = (isChecked) => http.get(`/cart/checkAllCart/${isChecked}`)

// 删除购物车商品
export const reqDeleteCart = (goodsId) => http.get(`/cart/delete/${goodsId}`)