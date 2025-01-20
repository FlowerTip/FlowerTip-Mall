<template>
	<uv-empty mode="permission" icon="account-fill" text="请点击下方的按钮，授权登陆您的账户～">
		<view style="padding-top: 20rpx;">
			<uv-button type="error" @click="login" color="#f3514f">
				点击授权登陆
			</uv-button>
		</view>
	</uv-empty>
</template>

<script setup>
	import useUserStore from '@/store/modules/userStore.js';
	import {
		reqLogin,
		reqUserInfo
	} from '@/api/login'
	import {
		setStorage
	} from '@/utils/storage';

	const userStore = useUserStore();
	// 登录
	const login = async () => {
		// #ifdef MP-WEIXIN
		const data = await uni.login();
		if (data.errMsg === "login:ok") {
			const res = await reqLogin(data.code)
			setStorage('token', res.data.token)
			// 存储token到状态仓库
			userStore.setToken(res.data.token)
			uni.flowerTipToast({
				title: '登录成功',
				icon: "success"
			})
			getUserinfo()
		}
		// #endif
		// #ifndef MP-WEIXIN
		const code = new Date().getTime();
		const res = await reqLogin(code)
		setStorage('token', res.data.token)
		// 存储token到状态仓库
		userStore.setToken(res.data.token)
		uni.flowerTipToast({
			title: '登录成功',
			icon: "success"
		})
		getUserinfo()
		// #endif
	}
	// 获取用户信息
	const getUserinfo = async () => {
		const res = await reqUserInfo()
		if (res.code === 200) {
			setStorage('userInfo', res.data)
			// 存储用户信息到状态仓库
			userStore.setUserInfo(res.data)
			uni.navigateBack({
				delta: 1
			})
		}
	}
</script>

<style lang="scss" scoped>
</style>