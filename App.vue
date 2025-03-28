<template>
</template>
<script setup>
	// import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	import {
		onLaunch,
		onShow,
		onHide
	} from '@dcloudio/uni-app';

	onLaunch(() => {
		console.log('应用启动成功')
	})
	onShow(() => {
		console.log('页面显示')
	})
	onHide(() => {
		console.log('应用隐藏')
	})
</script>

<style lang="scss">
	@import './static/fonts.scss';

	page {
		background-color: #f7f4f8;
		min-height: 100%;
	}

	// .container {
	// 	height: 100%;
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;
	// 	justify-content: space-between;
	// 	padding: 200rpx 0;
	// 	box-sizing: border-box;
	// }

	.img {
		width: 100%;
	}
</style>