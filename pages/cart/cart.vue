<template>
	<view>
		<!-- 购物车列表结构 -->
		<view v-if="cartList.length" class="container goods-wrap" @click="onSwipeCellPageTap">
			<view class="goods-item" v-for="(item, index) in cartList" :key="index">
				<uv-swipe-action class="goods-swipe">
					<uv-swipe-action-item :options="options" @click="delCartChange(item)">
						<view class="swipe-action uv-border-top uv-border-bottom">
							<view class="swipe-action__content">
								<view class="goods-info">
									<view class="left">
										<uv-checkbox-group>
											<uv-checkbox shape="circle" activeColor="#FA4126" :checked="item.isChecked == 1 ? true : false"
												@change="checkedChange(item, index)"></uv-checkbox>
										</uv-checkbox-group>
									</view>
									<view class="mid">
										<image class="img" :src="item.imageUrl" mode="aspectFill" />
									</view>
									<view class="right">
										<view class="title">
											{{item.name}}
										</view>
										<view class="buy">
											<view class="price">
												<view class="symbol">¥</view>
												<view class="num">{{item.price}}.00</view>
											</view>
											<view class="buy-btn">
												<uv-number-box v-model="item.count"></uv-number-box>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</uv-swipe-action-item>
				</uv-swipe-action>
			</view>
		</view>

		<!-- 购物车列表为空展示的结构 -->
		<uv-empty v-else :text="emptyDes" mode="car">
			<navigator v-if="!userStore.token" url="/pages/login/login" style="padding-top: 20rpx;">
				<uv-button type="error" class="bottom-button" color="#f3514f">去登录</uv-button>
			</navigator>
			<navigator v-else url="/pages/index/index" style="padding-top: 20rpx;">
				<uv-button type="error" class="bottom-button" color="#f3514f">去购物</uv-button>
			</navigator>
		</uv-empty>

		<!-- 底部工具栏 -->
		<view v-if="cartList.length" class="submit-bar">
			<view class="checkbar">
				<uv-checkbox-group>
					<uv-checkbox shape="circle" activeColor="#FA4126" :checked="selectedAll"
						@change="selectedAllChange">全选</uv-checkbox>
				</uv-checkbox-group>
			</view>
			<view class="pricebar">
				<text>合计：</text>
				<text class="price-num">{{(totalMoney / 100).toFixed(2)}}</text>
			</view>
			<view class="buybar">
				<uv-button type="error" shape="circle" color="#FA4126" :customStyle="{width: '200rpx'}" @click="goOrderPage">去结算</uv-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';

	import useUserStore from '../../store/modules/userStore.js';
	import {
		reqGetCartList,
		reqCheckAllCart,
		reqCheckCart,
		reqAddToCart,
		reqDeleteCart
	} from '../../api/cart';

	const userStore = useUserStore();

	const emptyDes = ref('还没有添加商品，快去添加吧～')
	const cartList = ref([]);
	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: '#f56c6c'
		}
	}])

	// 全选按钮的状态根据购物车列表中每个商品的选中状态来计算
	const selectedAll = computed(() => {
		return cartList.value.length > 0 && cartList.value.every(item => item.isChecked === 1)
	});

	// 计算全部选中商品的总价格
	const totalMoney = computed(() => {
		return cartList.value.reduce((total, item) => {
			if (item.isChecked === 1) {
				return (total + (item.price * item.count) * 100)
			} else {
				return total
			}
		}, 0)
	})

	onShow(() => {
		if (!userStore.token) {
			emptyDes.value = '您尚未登录，点击登录获取更多权益';
			cartList.value = []
			return
		}
		getCartList()
	})

	// 获取购物车列表
	const getCartList = async () => {
		const {
			code,
			data
		} = await reqGetCartList()
		if (code === 200) {
			if (data.length === 0) {
				emptyDes.value = '还没有添加商品，快去添加吧～'
				return
			}
			cartList.value = data;
		}
	}

	// 选中 || 取消选中商品
	const checkedChange = async (item, index) => {
		console.log(item, index, 'asdjsahj')
		const {
			goodsId,
			isChecked,
		} = item;
		// 同步后台选中了某个商品，需要购买
		const {
			code
		} = await reqCheckCart({
			goodsId,
			isChecked: isChecked == 0 ? 1 : 0
		})
		// 同步成功后，本地数据也要同步修改
		if (code === 200) {
			cartList.value[index].isChecked = isChecked == 0 ? 1 : 0;
		}
	}
	// 全部选中 || 取消全部选中商品
	const selectedAllChange = async (value) => {
		// 同步后台接口
		const isChecked = value ? 1 : 0
		const {
			code
		} = await reqCheckAllCart(isChecked)
		if (code === 200) {
			cartList.value = cartList.value.map(item => {
				item.isChecked = isChecked
				return item
			})
		}
	}
	// 删除购物车列表商品
	const delCartChange = async (item) => {
		const result = await uni.flowerTipModal({
			content: '您确定删除该商品吗？'
		})
		if (result) {
			const {
				code,
				message
			} = await reqDeleteCart(item.goodsId)
			if (code === 200) {
				uni.flowerTipToast({
					title: message,
					icon: 'success'
				})
				getCartList()
			}
		}
	}

	// 去结算按钮，跳转到结算订单页面
	const goOrderPage = () => {
		if (totalMoney.value === 0) {
			uni.flowerTipToast({
				title: '请选择要购买的商品'
			})
			return
		}
		uni.navigateTo({
			url: '/modules/orderPayModule/pages/order/detail/detail',
		})
	}
</script>

<style lang="scss" scoped>
	.submit-bar {
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: white;
		padding: 12rpx 8rpx;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		// #ifdef H5
		bottom: 100rpx;
		// #endif
		.buybar {
			padding-right: 40rpx;
		}

		.price-num {
			color: #FA4126;
		}
	}


	.goods-wrap {
		padding: 16rpx 16rpx 100rpx 16rpx;
		.goods-item {
			margin-bottom: 10rpx;
		}
	}

	.goods-info {
		display: flex;
		align-items: center;
		padding: 24rpx 16rpx;
		border-radius: 16rpx;
		margin-bottom: 16rpx;
		background-color: white;
		box-sizing: border-box;
		transition: transform 1s cubic-bezier(0.18, 0.89, 0.32, 1) !important;

		.left {
			width: 56rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.mid {
			width: 228rpx;
			height: 250rpx;

			.img {
				height: 100%;
			}
		}

		.right {
			height: 250rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;

			.title {
				flex: 1;
				flex-shrink: 0;
				font-size: 26rpx;
				color: #333;
				line-height: 44rpx;
				font-weight: 400;
				overflow: hidden;
				word-break: break-word;
			}

			.buy {
				display: flex;
				justify-content: space-between;

				.price {
					display: flex;
					color: #fa4126;
					font-size: 36rpx;
					margin-right: 10rpx;

					.symbol {
						font-size: 40rpx;
						margin-right: 8rpx;
					}
				}
			}
		}
	}
</style>