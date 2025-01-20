<template>
	<view class="container">
		<!-- 商品列表功能 -->
		<view class="goods-list" v-if="goodsList.length > 0">
			<template v-for="(item, index) in goodsList" :key="index">
				<goods-card :goodItem="item"></goods-card>
			</template>

			<!-- 数据是否加载完毕 -->
			<view class="finish" :hidden="!isFinish">暂无更多商品</view>
		</view>

		<!-- 商品为空的时候展示的结构 -->
		<uv-empty v-else text="该分类下暂无商品，去看看其他商品吧～">
			<uv-button type="error" class="bottom-button" color="#f3514f" style="padding-top: 20rpx;" @click="gotoBack">
				查看其他商品
			</uv-button>
		</uv-empty>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app';
	import GoodsCard from '@/components/goods-card/index.vue';
	import {
		reqGoodsPageData
	} from '../../../api/goods';

	// 商品列表数据
	const goodsList = ref([]);
	// 判断数据是否加载完毕
	const isFinish = ref(false);
	const page = ref(1);
	const limit = ref(10);
	const total = ref(0);
	const routeParam = ref({});
	const loading = ref(true);
	const isLoading = ref(false);


	onLoad((options) => {
		console.log(options, 'options')
		routeParam.value = Object.assign({}, options)
		initData(options)
	})

	const initData = async (options) => {
		isLoading.value = true;
		const reqParams = {
			...options,
			page: page.value,
			limit: limit.value
		}
		console.log(reqParams, 'reqParams');
		const res = await reqGoodsPageData(reqParams)
		if (res.code === 200) {
			goodsList.value = [...goodsList.value, ...res.data.records];
			total.value = res.data.total;
			loading.value = false;
			isLoading.value = false
		}
	}

	const gotoBack = () => {
		uni.navigateBack({
			delta: 1,
		})
	};

	// 上拉加载更多
	onReachBottom(() => {
		if (total.value === goodsList.value.length) {
			isFinish.value = true;
			return
		}
		// 判断是否加载完毕，如果 isLoading 等于 true
		// 说明数据还没有加载完毕，不加载下一页数据
		if (isLoading.value) return
		page.value = page.value + 1
		initData(routeParam.value)
	})

	// 下拉刷新
	onPullDownRefresh(() => {
		// 重置数据
		goodsList.value = [];
		isFinish.value = false;
		page.value = 1;
		limit.value = 10;
		total.value = 0;
		loading.value = true;
		// 重新发送请求
		initData(routeParam.value)
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
	.container {
		padding-top: 0rpx !important;
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	.finish {
		height: 80rpx;
		line-height: 80rpx;
		display: block !important;
		overflow: hidden;
		width: 100%;
		text-align: center;
		color: #46100f;
		border-top: 1rpx solid #ccc;
		font-size: 28rpx;
	}
</style>