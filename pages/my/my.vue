<template>
	<view class="container">
		<!-- 顶部展示图 -->
		<view class="top-show">
			<view class="top-show-img">
			</view>
		</view>

		<view class="bottom-show">
			<!-- 未登录面板 -->
			<view v-if="!userStore?.userInfo.nickname" class="user-container section" @click="toLoginPage">
				<view class="avatar-container">
					<!-- #ifdef H5 -->
					<image src="/static/images/avatar.png" mode="aspectFill"></image>
					<!-- #endif -->
					<image src="https://gitee.com/flowerTip/person-file/raw/master/avatar.png" mode="aspectFill"></image>
					<view class="no-login">
						<text class="ellipsis">未登录</text>
						<text>点击授权登录</text>
					</view>
				</view>
			</view>

			<!-- 登录以后得面板 -->
			<view v-else class="user-container section">
				<view class="avatar-container">
					<image :src="userStore?.userInfo.headimgurl" mode="aspectFill"></image>
					<view class="no-login">
						<text class="ellipsis">{{userStore?.userInfo.nickname}}</text>
					</view>
				</view>
				<view class="setting">
					<navigator url="/modules/settingModule/pages/settings/settings"> 设置 </navigator>
				</view>
			</view>

			<!-- 订单面板 -->
			<view class="order section">
				<view class="order-title-wrap">
					<text class="title">我的订单</text>
					<text class="more">查看更多></text>
				</view>

				<view class="order-content-wrap">
					<view class="order-content-item" v-for="(item, index) in initpanel" :key="index">
						<navigator :url="item.url">
							<view class="iconfont" :class="item.iconfont"></view>
							<text>{{ item.title }}</text>
						</navigator>
					</view>
				</view>
			</view>

			<!-- 关于售前售后服务面板 -->
			<view class="after-scale section">
				<view class="order-title-wrap">
					<text class="title">关于售前售后服务</text>
				</view>
				<view class="after-scale-item">
					<view class="iconfont icon-kefufenxiermaikefu"></view>
					<text>可与小程序客服实时聊天或电话咨询</text>
				</view>
				<view class="after-scale-item">
					<view class="iconfont icon-shijian"></view>
					<text>小程序客服工作时间为: 8:30 ~ 20:30</text>
				</view>
				<view class="after-scale-item">
					<view class="iconfont icon-dizhiguanli"></view>
					<text>鲜花制作完毕情况下暂不支持退款</text>
				</view>
				<view class="after-scale-item">
					<view class="iconfont icon-zhangben"></view>
					<text>鲜花可以提前7-15天预订重大节假日不支持定时配送</text>
				</view>
			</view>

			<!-- 底部面板 -->
			<view class="info-footer"> 技术支持 </view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import useUserStore from '../../store/modules/userStore.js';

	const userStore = useUserStore();
	// 初始化第二个面板数据
	const initpanel = ref([{
			url: '/modules/orderPayModule/pages/order/list/list',
			title: '商品订单',
			iconfont: 'icon-dingdan'
		},
		{
			url: '/modules/orderPayModule/pages/order/list/list',
			title: '礼品卡订单',
			iconfont: 'icon-lipinka'
		},
		{
			url: '/modules/orderPayModule/pages/order/list/list',
			title: '退款/售后',
			iconfont: 'icon-tuikuan'
		}
	])

	// 跳转到登录页面
	const toLoginPage = () => {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0rpx !important;
	}

	.top-show {
		width: 100%;
		height: 360rpx;

		.top-show-img {
			width: 100%;
			height: 100%;
			background-image: url('https://gitee.com/flowerTip/person-file/raw/master/banner.jpg');
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
			// #ifdef H5
			background-image: url('~@/static/images/banner.jpg');
			// #endif
		}
	}

	.bottom-show {
		margin: 0 16rpx;

		.section {
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
		}

		.user-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: -86rpx;
			color: #999;

			.avatar-container {
				display: flex;
				align-items: center;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.no-login {
					display: flex;
					flex-direction: column;
					font-size: 24rpx;

					text:first-child {
						font-size: 28rpx;
					}

					.ellipsis {
						width: 400rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
		}

		.order {
			background-color: #fff;
			margin-top: 20rpx;

			.order-title-wrap,
			.order-content-wrap {
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
			}

			.order-title-wrap {
				.title {
					color: #444;
					// font-weight: 700;
				}

				.more {
					color: #ccc;
					font-size: 24rpx;
				}
			}

			.order-content-wrap {
				display: flex;

				.iconfont {
					font-size: 60rpx;
					text-align: center;
				}

				text {
					font-size: 25rpx;
					margin-top: 20rpx;
				}
			}

			.order-content-item {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}

		.after-scale {
			margin-top: 30rpx;

			.order-title-wrap {
				line-height: 50rpx;
			}

			.after-scale-item {
				display: flex;
				margin: 25rpx 15rpx;
				color: #999;
				line-height: 50rpx;

				text {
					font-size: 25rpx;
					margin-left: 20rpx;
				}

				.iconfont {
					color: #a2b364;
				}
			}
		}

		.info-footer {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #aaa;
			font-size: 25rpx;
		}
	}
</style>