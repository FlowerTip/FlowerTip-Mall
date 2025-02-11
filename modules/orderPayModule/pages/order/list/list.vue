<template>
	<view class="order-container container">
		<view class="order-list" v-if="orderList.length > 0 ">
			<view class="order-item" v-for="(item, index) in orderList" :key="index" @click="goOrderDetail(item)">
				<view class="order-item-header list-flex">
					<view class="orderno">订单号<text class="no">{{item.orderNo}}</text></view>
					<view class="order-status" :class="[item.orderStatus === 1 ? 'order-active' : '']">
						{{item.orderStatus === 1 ? '已支付' : '未支付'}}
					</view>
				</view>
				<view class="goods-item list-flex" v-for="(item, index) in item.orderDetailList" :key="index">
					<view class="left">
						<image :src="item.imageUrl" mode="widthFix" class="img" />
					</view>
					<view class="mid">
						<view class="goods-name">{{item.name}}</view>
						<view class="goods-blessing">{{item.blessing || '无备注内容'}}</view>
					</view>
					<view class="right">
						<view class="goods-price">¥{{item.price}}</view>
						<view class="goods-count">x{{item.count}}</view>
					</view>
				</view>
				<view class="order-item-footer">
					<view class="total-amount list-flex">
						<text class="text">实付</text>
						<text class="price"><text>¥</text> {{item.totalAmount}}</text>
					</view>
				</view>
			</view>
			<!-- 数据是否加载完毕 -->
			<view class="finish" :hidden="!isFinish">{{isLoading ? '正在加载数据' : '暂无更多订单'}}</view>
		</view>
		<uv-empty v-if="isFinish && !orderList.length" text="还没有购买商品，快去购买吧～">
			<uv-button type="error" class="bottom-button" color="#f3514f" style="padding-top: 20rpx;" @click="goGoodsList">
				去购买
			</uv-button>
		</uv-empty>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app';

	import {
		reqGetOrderList
	} from '../../../api/order'

	const orderList = ref([]);
	const total = ref(0);
	const loading = ref(true);
	const isFinish = ref(false);
	const isLoading = ref(false);
	const page = ref(1);
	const limit = ref(10);

	onLoad(() => {
		getOrderList()
	})

	// 获取订单列表
	const getOrderList = async () => {
		isLoading.value = true
		const {
			code,
			data
		} = await reqGetOrderList({
			page: page.value,
			limit: limit.value
		})
		if (code === 200) {
			orderList.value = [...orderList.value, ...data.records];
			total.value = data.total;
			loading.value = false;
			isLoading.value = false
			if (total.value === 0) {
				isFinish.value = true;
			}
		}
	}
	
	// 去商品列表页面
	const goGoodsList = () => {
		uni.navigateTo({
			url: `/modules/goodModule/pages/goods/list/list`,
		})
	}

	// 订单详情
	const goOrderDetail = (item) => {
		uni.navigateTo({
			url: `/modules/orderPayModule/pages/order/detail/detail?orderno=${item.orderNo}`,
		})
	}
	// 上拉加载更多
	onReachBottom(() => {
		if (total.value === orderList.value.length) {
			isFinish.value = true;
			return
		}
		// 判断是否加载完毕，如果 isLoading 等于 true
		// 说明数据还没有加载完毕，不加载下一页数据
		if (isLoading.value) return
		page.value = page.value + 1
		getOrderList();
	})

	// 下拉刷新
	onPullDownRefresh(() => {
		// 重置数据
		orderList.value = []; // 商品列表数据
		isFinish.value = false; // 判断数据是否加载完毕
		page.value = 1;
		limit.value = 10;
		total.value = 0;
		loading.value = true;
		// 重新发送请求
		getOrderList()
		// 停止下拉刷新
		uni.stopPullDownRefresh()
		// 提示信息
		uni.flowerTipToast({
			title: '刷新成功',
			icon: 'success'
		})
	})
</script>

<style lang="scss" scoped>
	.list-flex {
		display: flex;
	}
	.finish {
		font-size: 28rpx;
		text-align: center;
		padding: 10rpx;
	}
	.order-item {
		margin-top: 16rpx;
		padding: 24rpx 32rpx 24rpx;
		background-color: white;
		border-radius: 14rpx;

		&:first-child {
			margin: 0rpx;
		}

		.order-item-header {
			align-items: center;
			justify-content: space-between;
			margin-bottom: 24rpx;
		}
	}

	.orderno {
		font-size: 28rpx;
		font-weight: normal;
		color: #333333;
		display: flex;
		align-items: center;
		line-height: 40rpx;

		.no {
			margin-left: 6px;
		}
	}

	.order-status {
		font-size: 26rpx;
		line-height: 40rpx;
	}

	.order-active {
		color: #fa4126;
	}

	.goods-item {
		padding: 16rpx 0;

		.left {
			width: 176rpx;
			height: 176rpx;
			background: #333333;
		}

		.mid {
			flex: 1;
			margin: 0 12px;

			.goods-name {
				font-size: 28rpx;
				color: #333;
				line-height: 40rpx;
				font-weight: 400;
			}

			.goods-blessing {
				font-size: 24rpx;
				height: 32rpx;
				line-height: 32rpx;
				color: #999999;
				margin: 8rpx 0;
			}
		}

		.right {
			.goods-price {
				white-space: nowrap;
				color: #fa4126;
				font-size: 24rpx;
				line-height: 48rpx;
			}

			.goods-count {
				white-space: nowrap;
				order: 4;
				text-align: right;
				font-size: 24rpx;
				color: #999;
				margin: 20rpx 0 0 auto;
			}
		}
	}

	.order-item-footer {
		.total-amount {
			justify-content: flex-end;
			align-items: center;
		}

		.text {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
			margin-right: 4px;
		}

		.price {
			font-size: 32rpx;
			color: #fa4126;
			font-weight: bold;

			text {
				font-weight: normal;
			}
		}
	}
</style>