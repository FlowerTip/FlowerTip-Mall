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

		<!-- 下载APP提示 -->
		<!-- #ifdef H5 -->
		<uv-modal ref="modalRef" title="下载提示">
			<view style="color: #666; text-align: center;">
				<view><text>目前只提供安卓版本的 apk 安装包</text></view>
				<view><text>安卓手机可点击下载软件安装软件 </text></view>
			</view>
			<template v-slot:confirmButton>
				<uv-button type="primary" color="#f3514f" @click="handlerConfirm"
					style="width: 80%; margin: 0rpx auto 40rpx;">下载软件</uv-button>
			</template>
		</uv-modal>
		<!-- #endif -->
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app';
	// import IndexSkt from './components/skt.vue';
	import BannerList from './components/banner.vue';
	import EntranceList from './components/entrance.vue';
	import GoodsList from '../../components/goods-list/index.vue';
	import {
		reqIndexPageData
	} from '../../api/index'

	// #ifdef H5
	const modalRef = ref(null);
	const handlerConfirm = () => {
		//创建a标签
		const a = document.createElement('a');
		const href = "https://flowertip.site/mall/static/mall.apk";
		// 下载链接
		a.href = href;
		a.target = '_blank';
		// 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
		a.download = "花坊间.apk";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	// #endif
	
	const bannerList = ref([]);
	const cateList = ref([]);
	const activeList = ref([]);
	const guessList = ref([]);
	const hotList = ref([]);
	const loading = ref(false);

	onLoad(() => {
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

	onReady(() => {
		// 下载APP提示
		modalRef.value?.open();
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