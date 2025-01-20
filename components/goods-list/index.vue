<template>
	<!-- 商品列表组件 -->
	<view class="goods_container">
	  <!-- 标题 -->
	  <view class="goods_title">{{title}}</view>
	
	  <!-- 列表区域 -->
	  <view class="goods_card_list">
	    <template v-for="(item, index) in list" :key="index">
	      <goods-card :goodItem="item"></goods-card>
	    </template>
	  </view>
	
	  <!-- 查看更多 -->
	  <view class="goods_more">
	    <navigator class="goods_more_btn" url="/modules/goodModule/pages/goods/list/list" hover-class="navigator-hover" open-type="navigate">
	      查看更多
	    </navigator>
	  </view>
	</view>
</template>

<script setup>
	import GoodsCard from '../goods-card/index.vue';
	defineProps({
		// 列表标题
		title: {
		  type: String,
		  value: ''
		},
		
		// 传递的列表数据
		list: {
		  type: Array,
		  value: [{}, {}, {}]
		}
	})
</script>

<style lang="scss" scoped>
	.goods_container {
		padding: 20rpx;
	}
	.goods_title {
	  text-align: center;
	  font-size: 40rpx;
	  line-height: 52rpx;
	  font-weight: bold;
	  color: #232628;
	  padding: 20rpx 0 0rpx 0rpx;
	}
	
	.goods_card_list {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-between;
	}
	
	.goods_card_list::after {
	  content: '';
	  width: 350rpx;
	}
	
	.goods_more {
	  margin: 20rpx 0;
	}
	
	.goods_more_btn {
	  display: block;
	  margin: 0 auto;
	  background: #ffffff;
	  border-radius: 20px;
	  height: 40px;
	  line-height: 40px;
	  text-align: center;
	  font-size: 14px;
	  color: rgba(35, 38, 40, 0.7);
	}
	
</style>