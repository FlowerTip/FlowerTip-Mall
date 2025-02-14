<template>
	<view class="container order">
		<view class="address-card">
			<view v-if="addressData.fullAddress" class="order-address detail-flex">
				<view class="address-content">
					<view class="title">{{addressData.fullAddress}}</view>
					<view class="info detail-flex">
						<text>{{addressData.name}}</text>
						<text>{{addressData.phone}}</text>
					</view>
				</view>

				<view class="select-address">
					<navigator class="navigator" url="/modules/settingModule/pages/address/list/index?isFormOrderPage=1">
						<uv-icon color="#bbb" name="arrow-right" size="22px" />
					</navigator>
				</view>
			</view>
			<!-- 添加收货地址 -->
			<view class="add-address" @click="toAddress">
				<uv-icon size="22px" name="edit-pen-fill" />
				<view>添加收货地址</view>
			</view>
			<view class="top-line"></view>
		</view>

		<view class="order-info">
			<uv-form :labelWidth="120" labelPosition="top" :model="buyOrderForm" :rules="buyOrderFormRules"
				ref="buyOrderFormRef" class="group">
				<uv-form-item label="订购人姓名" prop="buyName" borderBottom>
					<uv-input v-model="buyOrderForm.buyName" border="none" placeholder="订购人的姓名">
					</uv-input>
				</uv-form-item>
				<uv-form-item label="订购人的手机号" prop="buyPhone" borderBottom>
					<uv-input v-model="buyOrderForm.buyPhone" border="none" placeholder="订购人的手机号">
					</uv-input>
				</uv-form-item>
				<uv-form-item label="期望送达日期" prop="deliveryDate" borderBottom>
					<text v-if="!buyOrderForm.deliveryDate" class="placeholder-color" @click="openSelect">期望送达日期</text>
					<text v-else  @click="openSelect">{{buyOrderForm.deliveryDate}}</text>
				</uv-form-item>
				<uv-form-item label="订单备注" prop="blessing" borderBottom>
					<uv-textarea v-model="buyOrderForm.blessing"
						placeholder="写上您的祝福语，给心爱的他（她）送上你的祝福（请勿填写特殊符号或表情符号）"></uv-textarea>
				</uv-form-item>
			</uv-form>
		</view>
		<uv-datetime-picker ref="dateSelectRef" v-model="buyOrderForm.deliveryDate" mode="datetime">
		</uv-datetime-picker>
		<view class="goods-wraper">
			<!-- 商品清单 -->
			<view class="goods-list" v-for="(item, index) in orderDetail.cartVoList" :key="index">
				<view class="goods-item detail-flex">
					<view class="img">
						<image :src="item.imageUrl" />
					</view>
					<view class="content">
						<view class="goods-title">{{item.name}}</view>
						<view class="goods-price">
							<view class="price"> ¥ {{item.price}} </view>
							<view>x{{item.count}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 支付区域 -->
		<view class="footer detail-flex">
			<view class="left"> ¥{{orderDetail.totalAmount}} </view>
			<view class="right" @click="submitOrder">提交订单</view>
		</view>
		
		<!-- 期望送达日期选择器 -->
		<uv-datetime-picker ref="datetimePickerRef" mode="date" @confirm="datetimePickerConfirm">
		</uv-datetime-picker>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		formatTime
	} from '../../../utils/formatTime';
	import {
		reqOrderTrade,
		reqGetOrderAddress,
		reqOrderBuy,
		reqSubmitOrder,
		reqWechatPrevPay,
		reqQueryPayStatus
	} from '../../../api/order'

	const orderDetail = ref({});
	const addressData = ref({});
	const routeParam = ref({});
	const orderNo = ref('');
	const show = ref(false);
	const buyOrderForm = reactive({
		buyName: '',
		buyPhone: '',
		deliveryDate: '',
		blessing: ''
	})

	const buyOrderFormRules = {
		buyName: {
			type: 'string',
			required: true,
			message: '请填写订购人的姓名',
			trigger: ['blur', 'change']
		},
		buyPhone: {
			type: 'string',
			required: true,
			message: '请填写订购人的手机号',
			trigger: ['blur', 'change']
		},
		deliveryDate: {
			type: 'string',
			required: true,
			message: '请选择期望送达的日期',
			trigger: ['blur', 'change']
		},
		blessing: {
			type: 'string',
			required: true,
			message: '请填写备注信息',
			trigger: ['blur', 'change']
		}
	}

	const buyOrderFormRef = ref(null);
	const datetimePickerRef = ref(null);
	const dateSelectRef = ref(null);


	const datetimePickerConfirm = (e) => {
		console.log('confirm', e);
		buyOrderForm.deliveryDate = formatTime(new Date(e.value))
		buyOrderFormRef.value.clearValidate('deliveryDate')
	}

	onLoad((option) => {
		routeParam.value = {
			...option
		}
		getOrderTrade();
		getOrderAddress();
	})

	const openSelect = () => {
		// dateSelectRef.value.open();
		datetimePickerRef.value.open();
	}

	// 获取订单详情数据
	const getOrderTrade = async () => {
		const {
			goodsId,
			blessing
		} = routeParam.value
		// 从商品详情页面立即购买入口进来，查询立即购买的商品数据
		if (goodsId) {
			const {
				code,
				data
			} = await reqOrderBuy(goodsId, {
				blessing
			})
			if (code === 200) {
				orderDetail.value = data;
				buyOrderForm.blessing = blessing;
			}
		} else {
			const {
				code,
				data
			} = await reqOrderTrade()
			if (code === 200) {
				orderDetail.value = data;
			}
		}
	}
	// 获取订单默认地址
	const getOrderAddress = async () => {
		// 全局有，从全局取地址
		// const globalData = getApp().globalData
		// const {
		//   address
		// } = globalData
		// if (Object.keys(address).length !== 0) {
		//   this.setData({
		//     addressData: address
		//   })
		//   return
		// }
		// 没有走接口查询
		const {
			code,
			data
		} = await reqGetOrderAddress()
		if (code === 200) {
			addressData.value = data;
		}
	}

	// 跳转到收货地址
	const toAddress = () => {
		uni.navigateTo({
			url: '/modules/settingModule/pages/address/list/index'
		})
	}

	// 提交订单
	const submitOrder = () => {
		// 验证表单数据的合法性
		buyOrderFormRef.value.validate().then(async res => {
			const {
				buyName,
				buyPhone,
				deliveryDate,
				blessing,
			} = buyOrderForm
			const req = {
				cartList: orderDetail.value.cartVoList,
				buyName,
				buyPhone,
				deliveryDate,
				remarks: blessing,
				userAddressId: addressData.value.id
			}
			const {
				code,
				data
			} = await reqSubmitOrder(req)

			if (code === 200) {
				// 存储支付需要的预付单订单编号
				orderNo.value = data;
				// 获取预付单信息，支付参数
				getWechatPrevPay()
			}
		}).catch(errors => {
			if (errors.length > 0) {
				uni.showToast({
					icon: 'error',
					title: '表单校验失败'
				})
			}
		})
	}

	// 获取预支付订单信息，支付参数
	const getWechatPrevPay = async () => {
		try {
			const {
				code,
				data
			} = await reqWechatPrevPay(orderNo.value)
			if (code === 200) {
				console.log(data, 'data123123');
				const payInfo = await wx.requestPayment({
					timeStamp: data.timeStamp, // 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间
					nonceStr: data.nonceStr, // 随机字符串，长度为32个字符以下
					package: data.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
					paySign: data.paySign, // 签名
					signType: data.signType // 签名算法，应与后台下单时的值一致
				})
				console.log(payInfo, 'payInfo');
				const {
					errMsg
				} = payInfo
				if (errMsg === 'requestPayment:ok') {
					// 查询订单的支付状态
					const {
						code,
						message
					} = await reqQueryPayStatus(this.orderNo)
					if (code === 200) {
						uni.redirectTo({
							url: '/pages/order/list/index',
							success: () => {
								uni.flowerTipToast({
									title: message,
									icon: 'success'
								})
							}
						})
					}
				}
			}
		} catch (error) {
			uni.flowerTipToast({
				title: '支付失败请重试',
				icon: 'error'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.placeholder-color {
		color: #ccc;
	}
	.detail-flex {
		display: flex;
	}

	.group {
		padding: 15rpx;
	}

	.order {
		padding-bottom: 130rpx;
		margin: 10rpx;
	}

	// 收货地址卡片
	.address-card {
		background-color: #fff;
		border-radius: 14rpx;
		overflow: hidden;

		// 添加收货地址
		.add-address {
			display: flex;
			height: 140rpx;
			line-height: 140rpx;
			justify-content: center;

			view {
				padding-left: 14rpx;
			}
		}

		// 收货地址样式
		.order-address {
			justify-content: space-between;
			padding: 24rpx 32rpx;

			.title {
				display: flex;
				align-items: center;
				// height: 60rpx;
				font-size: 28rpx;
				font-weight: normal;
				color: #333333;
				line-height: 40rpx;
			}

			.info {
				height: 60rpx;
				font-size: 28rpx;
				font-weight: normal;
				color: #333333;
				line-height: 40rpx;
				margin-top: 20rpx;

				text {
					&:first-child {
						margin-right: 16rpx;
					}
				}
			}

			.select-address .navigator {
				width: 100%;
				height: 100%;
				width: 80rpx;
				display: flex;
				justify-content: center;
				align-content: center;
			}
		}
	}

	.order-info,
	.goods-wraper {
		background-color: white;
		padding: 24rpx 0rpx;
		margin-top: 20rpx;
		border-radius: 14rpx;
	}

	.goods-wraper {
		padding: 10rpx 24rpx;

		.goods-list {
			padding: 12px 0;

			.goods-item {
				display: flex;
				margin-bottom: 14px;

				.img {
					width: 64px;
					height: 69px;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.content {
					flex: 1;
					margin: 0 8px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goods-title {
						font-size: 14px;
						color: #333;
					}
				}

				.goods-price {
					display: flex;
					justify-content: space-between;
					font-size: 30rpx;
				}
			}
		}
	}

	.form-textarea {
		border-radius: 12px;
		background-color: #f7f8fa;
		padding: 16px 12px;
		font-size: 13px;
		margin-top: 12px;
		width: 94%;
		height: 84px;
		color: #333;
	}

	// 提交订单面板
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		height: 112rpx;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #ddd;

		.left {
			color: #fa4126;
			font-weight: bold;
			font-size: 50rpx;
			line-height: 88rpx;
			margin-left: 16px;
		}

		.right {
			height: 80rpx;
			width: 240rpx;
			border-radius: 40rpx;
			background-color: #fa4126;
			color: #ffffff;
			line-height: 80rpx;
			font-weight: bold;
			font-size: 28rpx;
			text-align: center;
			margin-right: 16px;
		}
	}

	// 覆盖 Vant 组件的样式
	.van-field__control {
		text-align: right !important;
		color: #333333 !important;
		padding-right: 8rpx !important;
	}

	// 外部样式类
	.filed-label {
		color: #333333 !important;
		width: 400rpx !important;
	}

	.input-class {
		color: #333333 !important;
	}

	.van-cell__value {
		color: #969799 !important;
	}

	.van-hairline--top-bottom:after {
		border: none !important;
	}

	.van-cell__title {
		max-width: none !important;
	}
</style>