<template>
	<view class="container">
		<view class="setting-list">
			<navigator url="/modules/settingModule/pages/profile/profile" hover-class="none" class="setting-item">
				修改个人资料
			</navigator>
		</view>

		<!-- 操作列表 -->
		<view class="setting-list">
			<navigator url="/modules/settingModule/pages/address/list/index" hover-class="none" class="setting-item">
				我的收货地址
			</navigator>
		</view>

		<view class="setting-list concat">
			<button hover-class="none" class="setting-item" open-type="feedback">
				问题反馈
			</button>
			<button hover-class="none" class="setting-item" open-type="contact">
				联系我们
			</button>
			<button hover-class="none" class="setting-item" open-type="openSetting">
				授权信息
			</button>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
	button {
		text-align: left;
		border-radius: 0;
		background-color: #fff;
	}

	button::after {
		border: none;
	}

	.setting-list {
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		background-color: #fff;

		.setting-item {
			font-size: 30rpx;
			color: #333;
			height: 90rpx;
			line-height: 90rpx;
			padding-left: 10rpx;
			border-top: 1rpx solid #ddd;
			position: relative;

			&:first-child {
				border-top: none;
			}

			&::after {
				content: '\e65f';
				font-family: 'iconfont';
				position: absolute;
				top: 50%;
				right: 18rpx;
				font-size: 24rpx;
				transform: translateY(-50%);
				color: #999;
			}
		}
	}

	button::after {
		width: auto;
		height: auto;
		left: auto;
		border: none;
	}
</style>