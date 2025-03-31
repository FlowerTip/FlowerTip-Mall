<template>
	<view class="container">
		<view class="setting-list avatar-container">
			<text>头像</text>

			<view class="avatar">
				<!-- #ifdef MP-WEIXIN -->
				<button hover-class="none" open-type="chooseAvatar" bindchooseavatar="chooseAvatar">
					<image
						:src="userStore.userInfo.headimgurl || 'https://gitee.com/flowerTip/person-file/raw/master/avatar.png'" />
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image
					:src="userStore.userInfo.headimgurl || 'https://gitee.com/flowerTip/person-file/raw/master/avatar.png'" />
				<!-- #endif -->
			</view>
		</view>

		<view class="setting-list nickname" @click="onUpdateNickName">
			<text>昵称</text>
			<text>{{ userStore.userInfo.nickname || '狗尾巴花的尖' }}</text>
		</view>

		<view class="footer">
			<view class="btn" @click="saveUpdateInfo">保存</view>
		</view>

		<uv-modal ref="modalRef" title="修改昵称" :showConfirmButton="false" :showCancelButton="false">
			<uv-form labelPosition="left" ref="form">
				<uv-input placeholder="请输入内容" v-model="userName"></uv-input>
			</uv-form>
			<template v-slot:confirmButton>
				<view class="dialog-content">
					<button class="cancel" form-type="reset" @click="cancelForm">取消</button>
					<button class="confirm" type="primary" @click="confirmForm">确定</button>
				</view>
			</template>
		</uv-modal>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		reqUpdateUser,
		reqUploadFile
	} from '../../../../api/login'
	import {
		setStorage
	} from '../../../../utils/storage'
	import useUserStore from '../../../../store/modules/userStore';

	const modalRef = ref(null);
	const userStore = useUserStore();
	const userName = ref(userStore.userInfo.nickname);

	// 显示修改昵称弹框
	const onUpdateNickName = () => {
		modalRef.value.open();
	}

	// 弹框取消按钮
	const cancelForm = () => {
		modalRef.value.close();
	}

	// 弹窗确认按钮
	const confirmForm = () => {
		// 获取用户输入的最新的昵称
		setStorage('userInfo', {
			...userStore.userInfo,
			nickname: userName.value
		})
		userStore.setUserInfo({
			...userStore.userInfo,
			nickname: userName.value
		})
		modalRef.value.close();
	}

	// 更新头像
	const chooseAvatar = async (event) => {
		const {
			avatarUrl
		} = event.detail
		const res = await reqUploadFile(avatarUrl, 'file')
		if (res.code === 200) {
			setStorage('userInfo', {
				...userStore.userInfo,
				headimgurl: res.data
			})
			userStore.setUserInfo({
				...userStore.userInfo,
				headimgurl: res.data
			})
		}
	}

	// 保存个人信息
	const saveUpdateInfo = async () => {
		const res = await reqUpdateUser({
			...userStore.userInfo
		})
		if (res.code === 200) {
			uni.flowerTipToast({
				title: "信息更新成功",
				icon: 'success'
			})
			uni.navigateBack({
				delta: 1
			})
		}
	}
</script>

<style lang="scss" scoped>
	.avatar image {
		width: 90rpx;
		height: 90rpx;
		position: relative;
		top: 18rpx;
		left: 16rpx;
		border-radius: 50%;
	}

	.setting-list {
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
		height: 100rpx;
		line-height: 100rpx;
		position: relative;
		padding-right: 50rpx;

		&::after {
			content: '\e65f';
			font-family: 'iconfont';
			position: absolute;
			top: 50%;
			right: 0px;
			font-size: 24rpx;
			transform: translateY(-50%);
			color: #999;
			padding-right: 12rpx;
		}

		text:first-child {
			// font-weight: 500;
			color: #333;
			font-size: 30rpx;
		}
	}

	// 头像
	.avatar-container {
		height: 120rpx;
		line-height: 120rpx;
	}

	// 昵称
	.nickname {
		padding-right: 60rpx;
		color: #333;
		font-size: 30rpx;
	}

	button {
		background-color: #fff;
	}

	button:after {
		border: none;
	}

	button[type='primary'] {
		background-color: #fff !important;
		color: #fa4126;
		font-size: 34rpx;
	}

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30rpx;

		.btn {
			width: 76%;
			line-height: 80rpx;
			font-weight: bold;
			font-size: 28rpx;
			text-align: center;
			border-radius: 40rpx;
			background-color: #fa4126;
			color: #ffffff;
		}
	}

	/* 更新用户昵称 */
	.van-field__control {
		border: 1px solid #efefef !important;
		min-height: 60rpx !important;
		line-height: 60rpx !important;
		margin: 16rpx !important;
		padding-left: 20rpx !important;
		border-radius: 16rpx;
	}

	// 更新用户名
	.dialog-content {
		display: flex;

		.cancel {
			color: #333;
			font-size: 34rpx;
		}
	}

	.input-name {
		border: 1px solid #ccc;
		margin: 40rpx 40rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 16rpx;
		padding: 6rpx 12rpx;
		padding-left: 20rpx;
	}
</style>