<template>
	<view class="container goods-detail">
		<!-- 商品大图 -->
		<view class="banner-img">
			<image class="img" :src="goodsInfo.imageUrl" mode="aspectFill" />
		</view>

		<!-- 商品的基本信息 -->
		<view class="content">
			<view class="price">
				<view class="price-num">¥{{goodsInfo.Price}}</view>
				<view class="price-origin-num">¥{{goodsInfo.LinePrice}}</view>
			</view>
			<view class="title">{{goodsInfo.Cpmc}}</view>
			<view class="desc">{{goodsInfo.Instro}}</view>
		</view>

		<!-- 商品的详细信息 -->
		<view class="detail">
			<block v-for="(item, index) in goodsInfo.detailList" wx:key="index">
				<image class="img" mode="widthFix" :src="item" />
			</block>
		</view>

		<!-- 商品的底部商品导航 -->
		<view class="footer_bar">
			<view class="left_icon_group">
				<view class="item" @click="handlerNavPage('/pages/index/index')">
					<uv-icon name="home" size="24"></uv-icon>
					<text class="label">首页</text>
				</view>
				<view class="item" @click="handlerNavPage('/pages/cart/cart')">
					<uv-badge type="error" max="99" :value="allCount" :offset="allCount > 9 ? [-4, -10] : [-4, 2]"
						:absolute="true">
					</uv-badge>
					<uv-icon name="shopping-cart" size="24"></uv-icon>
					<text class="label">购物车</text>
				</view>
				<view class="item" @click="handlerNavPage('/pages/my/my')">
					<uv-icon name="chat" size="24"></uv-icon>
					<text class="label">客服</text>
				</view>
			</view>
			<view class="rigth_btn_group">
				<view class="car_btn diy_btn" @click="handleAddcart">加入购物车</view>
				<view class="buy_btn diy_btn" @click="handeGotoBuy">立即购买</view>
			</view>
		</view>

		<!-- 弹窗层 -->
		<view>
			<uv-action-sheet ref="actionSheetRef" :closeOnClickOverlay="true" :closeOnClickAction="false" :round="15">
				<view class="sheet-wrapper">
					<view class="goods-item">
						<!-- 需要购买的商品图片 -->
						<view class="mid">
							<image class="img" :src="goodsInfo.imageUrl" :data-src="goodsInfo.imageUrl"
								:data-images="[goodsInfo.imageUrl].concat(goodsInfo.detailList)" @click="handlePreview" />
						</view>

						<!-- 商品基本信息 -->
						<view class="right">
							<!-- 商品名字 -->
							<view class="title"> {{goodsInfo.Cpmc}} {{goodsInfo.Instro}}</view>
							<!-- 商品价格 -->
							<view class="buy">
								<view class="price">
									<view class="symbol">¥</view>
									<view class="num">{{goodsInfo.Price}}</view>
								</view>

								<!-- 步进器组件控制购买数量 -->
								<view wx:if="{{buyType === 0}}" class="buy-btn">
									<!-- Stepper 步进器，由增加按钮、减少按钮和输入框组成，控制购买数量 -->
									<uv-number-box v-model="count" @change="onChangeGoodsCount" min="1" max="200" integer></uv-number-box>
								</view>
							</view>
						</view>
					</view>

					<!-- 祝福语输入框 -->
					<view class="time-wraper">
						<view class="title">祝福语</view>
						<textarea v-model="blessing" @input="onTextAreaChange" class="form-textarea"
							placeholder="必填，写上您的祝福语，给心爱的他（她）送上你的祝福（请勿填写特殊符号或表情符号）" name="textarea" />
					</view>

					<!-- 确定按钮 -->
					<view class="sheet-footer-btn">
						<uv-button type="primary" @click="handlerSubmit" color="#f3514f"> 确定 </uv-button>
					</view>
				</view>
			</uv-action-sheet>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
	} from '@dcloudio/uni-app';
	import useUserStore from '@/store/modules/userStore.js'
	import {
		reqGoodDetailData
	} from '../../../api/goods'
	import {
		reqGetCartList,
		reqAddToCart
	} from '../../../../../api/cart'
	const mall = uniCloud.importObject('mall') //第一步导入云对象
	const currGoodId = ref('');
	const loading = ref(true);
	const goodsInfo = ref({}); // 商品详情
	const show = ref(false); // 控制加入购物车和立即购买弹框的显示
	const count = ref(1); // 商品购买数量，默认是 1
	const blessing = ref(''); // 祝福语
	const allCount = ref(0); // 购物车商品总数量
	const buyType = ref(0); // 购买方式 0 加入购物车 1 立即购买

	const actionSheetRef = ref(null);

	const userStore = useUserStore();

	onLoad((options) => {
		const {
			goodsId
		} = options;
		currGoodId.value = goodsId;
		console.log(goodsId, 'goodsId')
		initData(goodsId)
		getCarCount();
	})

	const initData = async (id) => {
		const db = uniCloud.databaseForJQL();
		db.collection('goods')
			.where({
				_id: id
			})
			.get()
			.then(res => {
				console.log(res, '@@@@Res');
				goodsInfo.value = Object.assign({}, res.data[0]);
				loading.value = false;
			})
	}

	// 获取购物车数量
	const getCarCount = async () => {
		const data = await mall.getCartList({});
		allCount.value = data.reduce((prev, next) => (prev + next.count), 0)
	}


	// 加入购物车
	const handleAddcart = () => {
		show.value = true;
		buyType.value = 0;
		blessing.value = '';
		actionSheetRef.value.open();
	}

	// 立即购买
	const handeGotoBuy = () => {
		show.value = true;
		buyType.value = 1;
		blessing.value = '';
		actionSheetRef.value.open();
	}

	// 点击关闭弹框时触发的回调
	const onClose = () => {
		show.value = false;
	}

	// 监听是否更改了购买数量
	const onChangeGoodsCount = (event) => {
		count.value = Number(event.detail)
	}

	// 确定
	const handlerSubmit = async () => {
		const goodsId = currGoodId.value;
		if (!userStore.token) {
			uni.navigateTo({
				url: '/pages/login/login',
			})
			return
		}

		if (!blessing.value) {
			uni.flowerTipToast({
				title: '请填写祝福语',
				icon: 'error'
			})
			return
		}
		// 加入购物车
		if (buyType.value === 0) {

			const {
				code,
				message
			} = await mall.addCartList({
				goodsId,
				count: count.value,
				blessing: blessing.value
			})
			if (code == 0) {
				uni.flowerTipToast({
					title: message,
					icon: 'success'
				})
				getCarCount();
				actionSheetRef.value.close();;
			}
		} else {
			// 立即购买
			uni.navigateTo({
				url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing.value}`,
			})
		}
	}


	// 详情图片预览
	const handlePreview = (event) => {
		const {
			images,
			src
		} = event.currentTarget.dataset;
		uni.previewImage({
			urls: images,
			current: src
		});
	}

	const handlerNavPage = (url) => {
		uni.switchTab({
			url
		})
	}
</script>

<style lang="scss" scoped>
	.footer_bar {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1;
		background-color: #fff;
		padding: 6rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left_icon_group {
			display: flex;

			.item {
				position: relative;
				width: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.label {
					font-size: 28rpx;
				}
			}
		}

		.rigth_btn_group {
			display: flex;
			align-items: center;
			height: 84rpx;

			.diy_btn {
				width: 210rpx;
				height: 100%;
				color: #fff;
				font-size: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
			}

			.car_btn {
				border-radius: 41rpx 0 0 41rpx;
				background: linear-gradient(#ff976a 0%, #FF7B35 100%);
			}

			.buy_btn {
				border-radius: 0 41rpx 41rpx 0;
				background: linear-gradient(#FF5F4E 0%, #ee0a24 100%);
			}
		}
	}


	.goods-detail {
		width: 100%;
		padding-bottom: 20rpx;
	}

	// 商品大图
	.banner-img {
		width: 100%;
		height: 900rpx;
		background-color: #fff;

		image {
			height: 100%;
		}
	}

	// 商品的基本信息
	.content {
		box-sizing: border-box;
		margin: 0 16rpx;
		background: white;
		padding: 40rpx;
		position: relative;
		border-radius: 18rpx;
		top: -160rpx;
		height: 220rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;

		.price {
			display: flex;

			.price-num {
				font-size: 36rpx;
				color: #fa4126;
				font-weight: bold;
			}

			.price-origin-num {
				font-size: 24rpx;
				color: #b4babf;
				margin-left: 8rpx;
				text-decoration: line-through;
				margin-top: 12rpx;
			}
		}

		.title {
			font-size: 32rpx;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.desc {
			font-size: 24rpx;
			color: #999999;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	// 详细图片
	.detail {
		margin: -130rpx 16rpx 100rpx;
		background: white;
		padding: 20rpx 16rpx;
		border-radius: 16rpx;
	}

	// 加入购物车、立即购买弹框
	.sheet-wrapper {
		padding: 16rpx;

		.sheet-footer-btn {
			padding: 16rpx;
		}
	}

	// 商品详情
	.goods-item {
		display: flex;
		align-items: center;
		padding: 0 32rpx 40rpx 0;

		.left {
			width: 56rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.mid {
			width: 228rpx;
			height: 250rpx;

			image {
				height: 100%;
			}
		}

		.right {
			height: 250rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 40rpx;

			.title {
				flex: 1;
				flex-shrink: 0;
				font-size: 28rpx;
				color: #333;
				line-height: 40rpx;
				font-weight: 400;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				overflow: hidden;
				word-break: break-word;
				text-align: left;
			}

			.buy {
				display: flex;
				justify-content: space-between;

				.price {
					display: flex;
					align-items: center;
					color: #fa4126;
					font-size: 36rpx;

					.symbol {
						font-size: 40rpx;
						margin-right: 4rpx;
					}
				}
			}
		}
	}

	// 祝福语
	.time-wraper {
		margin-bottom: 24rpx;

		.title,
		.time {
			justify-content: space-between;
			font-size: 28rpx;
			color: #333333;
		}

		.form-textarea {
			border-radius: 24rpx;
			background-color: #f7f8fa;
			padding: 32rpx 24rpx;
			font-size: 26rpx;
			margin-top: 24rpx;
			width: 94%;
			height: 164rpx;
			text-align: left;
		}
	}
</style>