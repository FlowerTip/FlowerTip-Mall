<template>
	<view class="container address-list">
		<view class="list-warpper" v-if="addressList.length">
			<view v-for="(item, index) in addressList" :key="index" class="list-item">
				<uv-swipe-action class="goods-swipe">
					<uv-swipe-action-item :options="options" @click="deleteAddress(item)">
						<view class="list-item-box">
							<view class="info" @click="selectAddress(item)">
								<view class="user-info">
									<text>{{item.name}}</text>
									<text>{{item.phone}}</text>
									<text class="default-tag">{{item.isDefault == 1 ? '默认' : ''}}</text>
								</view>

								<view class="address-info">
									{{item.fullAddress}}
								</view>
							</view>

							<view class="editBtn" @click="toEdit(item.id)">
								<uv-icon name="edit-pen" size="22px" color="#999" />
							</view>
						</view>
					</uv-swipe-action-item>
				</uv-swipe-action>
			</view>
		</view>

		<uv-empty v-else text="还没有收货地址，快去添加吧～" />

		<view class="footer">
			<view class="btn">
				<navigator url="/modules/settingModule/pages/address/add/index">
					新增地址
				</navigator>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import {
		reqGetAddressList,
		reqDelAddress
	} from '../../../api/address'

	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: '#f56c6c'
		}
	}])
	const isOrderPage = ref(0);
	const addressList = ref([]);

	onLoad((option) => {
		// 传递参数，是从订单页面过来的，其他页面不做选择地址处理
		const {
			isFormOrderPage
		} = option
		isOrderPage.value = isFormOrderPage;
	})
	onShow(() => {
		getAddressList()
	})
	// 获取收货地址列表
	const getAddressList = async () => {
		const {
			code,
			data
		} = await reqGetAddressList()
		if (code === 200) {
			addressList.value = data;
		}
	}
	// 去编辑页面
	const toEdit = (id) => {
		uni.navigateTo({
			url: `/modules/settingModule/pages/address/add/index?id=${id}`
		})
	}

	// 删除地址
	const deleteAddress = async (item) => {
		const {
			code,
			message
		} = await reqDelAddress(item.id)
		if (code === 200) {
			uni.flowerTipToast({
				title: message,
				icon: 'success'
			})
			getAddressList()
		}
	}

	// 选择收货地址
	const selectAddress = (item) => {
		if (isOrderPage.value != 1) return
		const {
			address
		} = item
		// 设置全局地址为新的
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.address-list {
		width: 750rpx;
		height: 100%;
		overflow-x: hidden;
	}

	.list-item .list-item-box {
		display: flex;

		.editBtn {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100rpx;
		}
	}

	.fullAddress {
		font-size: 26rpx;
		color: rgb(100, 100, 100);
	}

	.address-info {
		font-size: 26rpx;
		color: #333;
		margin: 26rpx 0rpx 0rpx 0rpx;
	}

	.user-info {
		font-size: 28rpx;
		color: #333;
		line-height: 30rpx;
		font-weight: 500;

		text {
			margin: 0rpx 6rpx;

			&:first-child {
				margin: 0rpx;
			}
		}
	}

	.list-warpper {
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 44rpx;
		padding: 10rpx;
		box-sizing: border-box;

		.list-item {
			align-items: center;
			padding: 40rpx 18rpx;
			justify-content: space-between;

			.tag {
				display: inline-block;
				font-size: 12px;
				padding: 0rpx 8rpx;
				background: #f0f1ff;
				color: #5a66ff;
			}

			.default-tag {
				display: inline-block;
				font-size: 12px;
				padding: 0rpx 8rpx;
				background: #ffece9;
				color: #fa4126;
				margin-left: 4px;
			}

			&:not(:last-child) {
				// border-bottom: red 2rpx solid;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgb(229, 229, 229);
			}

			.info {
				// margin-right: 32rpx;
				width: 86%;
			}
		}
	}

	.footer {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 130rpx;

		.btn {
			width: 76%;
			line-height: 80rpx;
			font-weight: bold;
			font-size: 28rpx;
			text-align: center;
			border-radius: 40rpx;
			background-color: #f3514f;
			color: #ffffff;
		}
	}

	.van-icon-edit,
	.van-icon-delete {
		font-size: 36rpx !important;
	}

	.van-icon-delete {
		margin-left: 14rpx;
	}

	.van-swipe-cell {
		width: 100% !important;
	}

	.van-swipe-cell__right {
		background-color: #fa4126;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 132rpx;
		height: 100%;
		color: #fff;
		font-size: 24rpx;
		padding-left: -2rpx;
	}
</style>