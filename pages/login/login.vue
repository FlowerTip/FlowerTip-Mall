<template>
	<!-- #ifdef MP-WEIXIN -->
	<uv-empty mode="permission" icon="account-fill" text="请点击下方的按钮，授权登陆您的账户～">
		<view style="padding-top: 20rpx;">
			<uv-button type="error" @click="login" color="#f3514f">
				点击授权登陆
			</uv-button>
		</view>
	</uv-empty>
	<!-- #endif -->
	<!-- #ifdef H5 -->
	<view class="login-container">
		<uv-text text="如果没有注册账号, 登录默认注册信息" color="#f3514f" align="center"></uv-text>
		<view class="title">花工坊</view>
		<uv-form labelPosition="top" :labelWidth="80" :model="loginForm" :rules="rules" ref="loginFormRef">
			<uv-form-item label="用户名" prop="username" borderBottom>
				<uv-input v-model="loginForm.username" border="none" placeholder="用户名">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="密码" prop="password" borderBottom>
				<uv-input type="password" v-model="loginForm.password" border="none" placeholder="密码格式为6位">
				</uv-input>
			</uv-form-item>
			<uv-button type="primary" color="#f3514f" text="登录" customStyle="margin-top: 10px"
				@click="handlerLogin"></uv-button>
		</uv-form>
	</view>
	<!-- #endif -->
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
	import {
		reactive,
		ref
	} from 'vue';

	const mall = uniCloud.importObject('mall') //第一步导入云对象


	const loginForm = reactive({
		username: '',
		password: ''
	})

	const rules = ref({
		username: {
			type: 'string',
			required: true,
			message: '请输入用户名',
			trigger: ['blur', 'change']
		},
		password: {
			type: 'string',
			required: true,
			len: 6,
			message: '请输入6位密码',
			trigger: ['blur', 'change']
		},
	})

	const loginFormRef = ref();

	const handlerLogin = () => {
		loginFormRef.value.validate().then(async valid => {
			if (valid) {
				const data = await mall.login({
					username: loginForm.username,
					password: loginForm.password
				})
				if (data.code == 0) {
					setStorage('token', data.id)
					// 存储token到状态仓库
					userStore.setToken(data.id)
					uni.flowerTipToast({
						title: '登录成功',
						icon: "success"
					})
					dbUserInfo(data.id);
				}
			}
		}).catch(errors => {
			console.log(errors, 'err')
			uni.showToast({
				icon: 'error',
				title: '表单校验失败'
			})
		})
	}

	const userStore = useUserStore();
	// 登录
	const login = async () => {
		uni.login({
			provider: 'weixin', //使用微信登录
			success: function(loginRes) {
				uniCloud.callFunction({
						name: 'wechat',
						data: {
							code: loginRes.code
						}
					})
					.then(res => {
						console.log(res.result.data, '###datatatat');
						setStorage('token', res.result.data.openid)
						// 存储token到状态仓库
						userStore.setToken(res.result.data.openid)
						uni.flowerTipToast({
							title: '登录成功',
							icon: "success"
						})
					})
			}
		})


		return;
		// #ifdef MP-WEIXIN
		const data = await uni.login();
		if (data.errMsg === "login:ok") {
			const db = uniCloud.databaseForJQL();
			db.collection('uni-id-users')
				.add(data.code)
				.then(res => {
					console.log(res, 'daodododoo')
				})



			// const res = await reqLogin(data.code)
			// setStorage('token', res.data.token)
			// // 存储token到状态仓库
			// userStore.setToken(res.data.token)
			// uni.flowerTipToast({
			// 	title: '登录成功',
			// 	icon: "success"
			// })
			// getUserinfo()
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


	const dbUserInfo = async (id) => {
		const data = await mall.getUserInfo({
			id
		})
		setStorage('userInfo', data[0])
		// 存储用户信息到状态仓库
		userStore.setUserInfo(data[0])
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style lang="scss" scoped>
	.login-container {
		padding: 16px 20px;
		background-color: #fff;
	}

	.title {
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
	}
</style>