<template>
	<view class="index-container">
		<!--首页背景图-->
		<view class="window-bgc"></view>
		<!-- 轮播图区域 -->
		<BannerList :bannerList="bannerList" />
		<!-- 导航分类 -->
		<EntranceList :cateList="cateList" />
		<!-- 广告区域 -->
		<view class="adver">
			<view class="adver-left">
				<navigator :url="`/modules/goodModule/pages/goods/list/list?category2Id=${activeList[0]?.id}`">
					<image :src="activeList[0]?.imageUrl" mode="widthFix" />
				</navigator>
			</view>

			<view class="adver-right">
				<view>
					<navigator :url="`/modules/goodModule/pages/goods/list/list?category2Id=${activeList[1]?.id}`">
						<image :src="activeList[1]?.imageUrl" mode="widthFix" />
					</navigator>
				</view>
				<view>
					<navigator :url="`/modules/goodModule/pages/goods/list/list?category2Id=${activeList[2]?.id}`">
						<image :src="activeList[2]?.imageUrl" mode="widthFix" />
					</navigator>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<goods-list title="猜你喜欢" :list="guessList"></goods-list>
		<goods-list title="人气推荐" :list="hotList"></goods-list>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	// import IndexSkt from './components/skt.vue';
	import BannerList from './components/banner.vue';
	import EntranceList from './components/entrance.vue';
	import GoodsList from '../../components/goods-list/index.vue';
	import {
		reqIndexPageData
	} from '../../api/index'
	const bannerList = ref([]);
	const cateList = ref([]);
	const activeList = ref([]);
	const guessList = ref([]);
	const hotList = ref([]);
	const loading = ref(false);

	const initData = async () => {
		const res = await reqIndexPageData();
		bannerList.value = res[0].data;
		cateList.value = res[1].data;
		activeList.value = res[2].data;
		guessList.value = res[3].data;
		hotList.value = res[4].data;
		loading.value = false;
	}
	onLoad(() => {
		// initData();

		const db = uniCloud.databaseForJQL();
		db.collection('categories')
			.get()
			.then(res => {
				console.log(res, 'shjju dai')
				cateList.value = res.data;
			})
		db.collection('actives')
			.get()
			.then(res => {
				console.log(res, 'shjju dai')
				activeList.value = res.data;
			})
		db.collection('goods')
			.get()
			.then(res => {
				console.log(res, 'shjju dai')
				guessList.value = res.data;
				hotList.value = res.data.reverse();
			})
	})

	const gotoBack = () => {
		uni.navigateBack({
			delta: 1,
		})
	}
</script>

<style lang="scss">
	.index-container {
		position: relative;

		// 首页背景图
		.window-bgc {
			height: 200rpx;
			position: absolute;
			width: 100%;
			background-color: #f3514f;
			border-radius: 0 0 20rpx 20rpx;
		}

		.adver {
			display: flex;
			width: 100%;
			padding: 10rpx 8rpx;
			background-color: #fff;
			box-sizing: border-box;
			border-radius: 18rpx;
			overflow: hidden;

			.adver-left {
				width: 50%;
				padding: 8rpx 8rpx 0rpx 8rpx;
			}

			.adver-right {
				width: 50%;
				display: flex;
				flex-direction: column;
				padding: 8rpx 8rpx 0rpx 8rpx;

				view:last-child {
					padding-top: 8rpx;
				}
			}

			image {
				width: 100%;
			}
		}
	}
</style>