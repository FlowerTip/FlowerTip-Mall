<template>
	<!-- 轮播图 -->
	<view class="swiper-box">
		<swiper autoplay class="swiper" indicator-active-color="#FF734C" interval="2000" duration="1000"
			indicator-color="rgba(0, 0, 0, .3)" @change="swiperChangeHandler">
			<template v-for="(item, index) in bannerList" :key="index">
				<swiper-item class="swiper-item">
					<navigator class="navigator" :url="`/modules/goodModule/pages/goods/detail/detail?goodsId=${item.id}`">
						<image class="img" :src="item.imageUrl" mode="aspectFill"></image>
					</navigator>
				</swiper-item>
			</template>
		</swiper>

		<!-- 轮播图的面板指示点，因为面板指示点不支持，所以我们只能通过自定义结构的方式 -->
		<view class="indicator">
			<!-- active 类名：当前被激活的面板指示点颜色 -->
			<!-- rectangle 类名：默认的面板指示点颜色 -->
			<text v-for="i in bannerList.length" :key="i"
				:class="[(i - 1) === activeIndex ? 'active rectangle' : 'rectangle']"></text>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	
	// 接收外部传入的轮播图数据
	defineProps({
		bannerList: {
			type: Array,
			value: []
		}
	})
	
	const activeIndex = ref(0);
	
	const swiperChangeHandler = (event) => {
		activeIndex.value = event.detail.current;
	}
</script>

<style lang="scss" scoped>
	/* 轮播图 */
	.swiper-box {
		position: relative;
		display: flex;
		justify-content: center;
		.swiper {
			width: 96%;
			height: 320rpx;
			border-radius: 18rpx;
			overflow: hidden;
		}

		.swiper-item {
			height: 320rpx;
			overflow: hidden;

			.img,
			.navigator {
				height: 100%;
				width: 100%;
				border-radius: 16rpx;
			}
		}

		.indicator {
			display: flex;
			justify-content: center;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 16rpx;

			// 面板指示器
			.rectangle {
				width: 30rpx;
				height: 6rpx;
				margin: 0 8rpx;
				border-radius: 6rpx;
				background-color: rgba(233, 228, 228, 0.9);
			}

			// 轮播图被激活时的样式
			.active {
				background-color: #f3514f;
				width: 40rpx;
			}
		}
	}
</style>