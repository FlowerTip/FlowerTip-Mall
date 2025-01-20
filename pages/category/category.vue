<template>
	<view class="category-container">
		<!-- 左侧的滚动视图区域 -->
		<scroll-view class="category-left-view" scroll-y>
			<!-- 一级分类 -->
			<template v-for="item in categoryList" :key="item.id">
				<view :class="[activeFirstLevelId === item.id ? 'left-view-item active' : 'left-view-item']"
					@click="handlerBindTap" :data-id="item.id"> {{item.name}} </view>
			</template>
		</scroll-view>

		<!-- 右侧的滚动视图区域 -->
		<scroll-view class="category-right-view" scroll-y>
			<!-- 二级分类 -->
			<view class="test">
				<view v-for="(item, index) in secondLevelList" :key="index" class="right-view-item">
					<view class="navigator" @click="handlerNavPage(item)">
						<image class="goods_item_image" :src="item.imageUrl"></image>
						<text class="goods_item_name">{{item.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		reqCategoryPageData
	} from '../../api/category';

	const activeFirstLevelId = ref('');
	const categoryList = ref([]);
	const secondLevelList = ref([]);
	const loading = ref(true);


	onLoad(() => {
		initData();
	})

	const initData = async () => {
		const res = await reqCategoryPageData()
		const result = res.data;
		activeFirstLevelId.value = result[0].id;
		categoryList.value = result;
		secondLevelList.value = result[0].children;
		loading.value = false;
	}

	const handlerBindTap = (event) => {
		const findItem = categoryList.value.find(item => item.id === event.target.dataset.id)
		activeFirstLevelId.value = event.target.dataset.id;
		secondLevelList.value = findItem ? findItem.children : [];
	}

	const handlerNavPage = (item) => {
		uni.navigateTo({
			url: `/modules/goodModule/pages/goods/list/list?category2Id=${item.id}`
		})
	}
</script>

<style lang="scss" scoped>
	.category-container {
		display: flex;

		// 左侧一级分类
		.category-left-view {
			width: 220rpx;
			height: 100vh;
			background: #fff !important;

			.left-view-item {
				line-height: 99rpx;
				text-align: center;
				font-size: 26rpx;
			}

			.active {
				background-color: #ffffff;
				position: relative;
				color: #f3514f;

				&::before {
					content: ' ';
					display: block;
					width: 6rpx;
					height: 66rpx;
					background-color: #f3514f;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		// 右侧二级分类
		.category-right-view {
			width: 100%;
			height: 100vh;
			flex-wrap: wrap;
			background: #fff !important;
			margin-left: 8rpx;

			.right-view-item {
				width: 33%;
				float: left;
				margin-top: 30rpx;

				.navigator {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				image {
					width: 90rpx;
					height: 90rpx;
				}

				text {
					font-size: 26rpx;
					margin-top: 18rpx;
				}
			}
		}
	}
</style>