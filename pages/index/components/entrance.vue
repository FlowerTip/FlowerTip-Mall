<template>
	<view class="nav-list">
		<!-- 一级分类导航容器 -->
		<view v-for="(item, index) in cateList" :key="item._id" class="nav-item" :class="[index >= 5 ? 'small' : '']">
			<!-- 导航链接 -->
			<view class="navigator-nav" @click="handlerNavPage(item)">
				<image class="nav-img" :src="item.imageUrl" mode="aspectFill" />
				<text class="nav-text">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	// 接收外部传入的分类列表数据
	defineProps({
		cateList: {
			type: Array,
			value: []
		}
	})
	
	const handlerNavPage = (item) => {
		uni.navigateTo({
			url: `/modules/goodModule/pages/goods/list/list?category1Id=${item.id}`
		})
	}
</script>

<style lang="scss" scoped>
	/* 导航分类样式 */
	.nav-list {
	  display: flex;
	  align-items: center;
	  flex-wrap: wrap;
	  margin: 20rpx 0rpx;
	  border-radius: 18rpx;
	  padding: 10px 0;
	  background-color: #fff;
	
	  .nav-item {
	    flex: 1;
	    min-width: 20%;
	    max-width: 20%;
	
	    &.small {
	      margin-top: 36rpx;
	    }
	
	    .navigator-nav {
	      display: flex;
	      flex-direction: column;
	      align-items: center;
	      justify-content: center;
	      width: 100%;
	      height: 100%;
	
	      .nav-text {
	        margin-top: 4px;
	        font-size: 12px;
	      }
	
	      .nav-img {
	        width: 66rpx;
	        height: 66rpx;
	      }
	    }
	  }
	}
</style>