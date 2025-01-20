import http from '../../../utils/http'

// 结算支付-订单详情
export const reqOrderTrade = () => http.get(`/order/trade`)

// 结算支付-订单地址
export const reqGetOrderAddress = () => http.get(`/userAddress/getOrderAddress`)

// 结算支付-立即购买
export const reqOrderBuy = (goodsId, data) => http.get(`/order/buy/${goodsId}`, data)

// 结算支付-提交订单
export const reqSubmitOrder = (data) => http.post(`/order/submitOrder`, data)

// 结算支付-微信预支付信息
export const reqWechatPrevPay = (orderNo) => http.get(`/webChat/createJsapi/${orderNo}`)

// 结算支付-微信支付状态查询
export const reqQueryPayStatus = (orderNo) => http.get(`/webChat/queryPayStatus/${orderNo}`)

// 订单管理-订单列表
export const reqGetOrderList = ({
	page,
	limit
}) => http.get(`/order/order/${page}/${limit}`)