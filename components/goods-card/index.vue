<template>
	<!-- 列表分类卡片 -->
	<view class="goods_cart_container">
	  <view class="navigator_nav" @click="handlerNavPage(goodItem)">
	    <!-- 商品图片 -->
	    <image class="good_img" :src="goodItem.imageUrl" mode="aspectFill" :lazy-load="true" />
	
	    <!-- 商品详细信息 -->
	    <view class="goods_item_info">
	      <!-- 商品名称 -->
	      <text class="goods_item_info_name">{{goodItem.name}}</text>
	      <!-- 商品描述 -->
	      <text class="goods_item_info_promo">{{goodItem.packing}}</text>
	      <!-- 商品价格 -->
	      <view class="goods_item_info_bottom">
	        <view class="goods_item_info_price">
	          <text class="text">¥</text>{{goodItem.price}}
	        </view>
	        <view class="goods_item_info_origin_price">
	          <text class="text">¥</text> 1{{goodItem.marketPrice}}
	        </view>
	        <!-- 加入购物车图片 -->
	        <view class="goods_item_info_btn">
	          <image class="goods_image" src="https://gitee.com/flowerTip/person-file/raw/master/buybtn.png" mode="aspectFill" :lazy-load="true" />
	        </view>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script setup>
	defineProps({
		// 每一项商品的数据
		goodItem: {
		  type: Object,
		  value: {}
		}
	})
	
	const handlerNavPage = (item) => {
		uni.navigateTo({
			url: `/modules/goodModule/pages/goods/detail/detail?goodsId=${item.id}`
		})
	}
</script>

<style lang="scss" scoped>
	.goods_cart_container {
	  width: 350rpx;
	  margin-top: 18rpx;
	  background: #fff;
	  border-radius: 18rpx;
	}
	
	.good_img {
	  width: 100%;
	  max-height: 360rpx;
	  border-top-left-radius: 16rpx;
	  border-top-right-radius: 16rpx;
	}
	
	.goods_item_info {
	  display: flex;
	  flex-direction: column;
	  padding: 10rpx 20rpx;
	}
	
	.goods_item_info .goods_item_info_name {
	  font-weight: 600;
	  font-size: 30rpx;
	  line-height: 20px;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.goods_item_info .goods_item_info_promo {
	  padding-top: 20rpx;
	  padding-bottom: 3px;
	  font-size: 12px;
	  color: #71797f;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.goods_item_info_bottom {
	  display: flex;
	  line-height: 50rpx;
	  margin-top: 20rpx;
	}
	
	.goods_item_info_bottom .goods_image {
	  width: 48rpx;
	  height: 48rpx;
	}
	
	.goods_item_info_price {
	  font-size: 30rpx;
	  font-weight: bold;
	  color: #f3514f;
	}
	
	.goods_item_info_price .text {
	  font-size: 24rpx;
	  padding-right: 4rpx;
	  font-weight: normal;
	}
	
	.goods_item_info_origin_price {
	  flex: 1;
	  font-size: 20rpx;
	  color: #71797f;
	  text-decoration-line: line-through;
	  margin-left: 6%;
	  margin-top: 4rpx;
	}
	
	.goods_item_info_origin_price .text {
	  font-size: 20rpx;
	}
	
</style>