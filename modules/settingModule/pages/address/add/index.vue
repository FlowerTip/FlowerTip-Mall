<template>
	<view class="container address">
		<uv-form :model="addressForm" label-width="120">
			<uv-form-item label="收货人" prop="name" borderBottom>
				<uv-input v-model="addressForm.name" border="none" placeholder="请输入收货人姓名">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="手机号码" prop="phone" borderBottom>
				<uv-input v-model="addressForm.phone" border="none" placeholder="请输入收货人手机号">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="所在地区" prop="regionList" borderBottom>
				<uv-input v-model="addressForm.regionList" border="none" placeholder="请选择收货人所在地区" @click="openAddressPicker">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="详细地址" prop="address" borderBottom>
				<uv-input v-model="addressForm.address" border="none" placeholder="门牌号(例：5号楼1单元203室)">
				</uv-input>
			</uv-form-item>
		</uv-form>
		<view class="row">
			<text class="title">设置默认地址</text>
			<uv-switch v-model="isDefault" active-color="#f3514f" size="20"></uv-switch>
		</view>
		<!-- 提交按钮 -->
		<button class="button" @click="saveAddrssForm">保存</button>
		<uv-picker ref="pickerRef" :columns="regionList" keyName="name" @change="pickChange" @confirm="confirm">
		</uv-picker>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		reqGetAddressDetail,
		reqSaveUserAddress,
	} from '../../../api/address'
	import regionJson from './region.js';


	const isDefault = ref(false);
	const pickerRef = ref(null);
	const addressForm = reactive({
		name: '',
		phone: '',
		provinceName: '',
		provinceCode: '',
		cityName: '',
		cityCode: '',
		districtName: '',
		districtCode: '',
		address: '',
		fullAddress: '',
		isDefault: 0,
		id: '',
		regionList: []
	})

	const addressList = ref([]);
	const provinces = ref([]); //省
	const citys = ref([]); //市
	const areas = ref([]) //区
	const pickerValue = ref([0, 0, 0]);
	const defaultValue = ref([3442, 1, 2]);

	const openAddressPicker = () => {
		pickerRef.value.open();
		handlePickValueDefault();
	}
	const confirm = () => {

	}
	let regionList = [];
	onLoad((option) => {
		option.id && getAddressDetail(option.id);

		console.log(regionJson, 'regionJson')
		getData();
	})
	const getData = () => {
		regionList = regionJson;
		console.log(regionList, 'regionList')
		handlePickValueDefault();
	}
	const pickChange = (e) => {
		console.log(e, 'e')
		// if (this.loading) return;
		const {
			columnIndex,
			index,
			indexs
		} = e
		// 改变了省
		if (columnIndex === 0) {
			citys.value = provinces.value[index]?.children || []
			areas.value = citys.value[0]?.children || []
			pickerRef.value?.setIndexs([index, 0, 0], true)
		} else if (columnIndex === 1) {
			areas.value = citys.value[index]?.children || []
			pickerRef.value?.setIndexs(indexs, true)
		}
	}

	const handlePickValueDefault = () => {
		// 设置省
		pickerValue.value[0] = regionList.findIndex(item => Number(item.id) === defaultValue.value[0]);
		// 设置市
		citys.value = provinces.value[pickerValue.value[0]]?.children || [];
		pickerValue.value[1] = citys.value.findIndex(item => Number(item.id) === defaultValue.value[1]);
		// 设置区
		areas.value = citys.value[pickerValue.value[1]]?.children || [];
		pickerValue.value[2] = areas.value.findIndex(item => Number(item.id) === defaultValue.value[2]);
		// 重置下位置
		pickerRef.value?.setIndexs([pickerValue.value[0], pickerValue.value[1], pickerValue.value[2]], true);
	}

	// 编辑时获取地址详情数据
	const getAddressDetail = async (id) => {
		const {
			code,
			data
		} = await reqGetAddressDetail(id)
		if (code === 200) {
			regionList.value = [data.provinceName, data.cityName, data.districtName];
			addressForm.name = data.name;
			addressForm.address = data.address;
			addressForm.phone = data.phone;
			// this.setData({
			// 	name: data.name,
			// 	phone: data.phone,
			// 	address: data.address,
			// 	provinceName: data.provinceName,
			// 	provinceCode: data.provinceCode,
			// 	cityName: data.cityName,
			// 	cityCode: data.cityCode,
			// 	districtName: data.districtName,
			// 	districtCode: data.districtCode,
			// 	fullAddress: data.fullAddress,
			// 	isDefault: data.isDefault,
			// 	regionList: [data.provinceName, data.cityName, data.districtName],
			// 	id: data.id
			// })
		}
	}

	// 保存地址信息
	const saveUserAddress = async (req) => {
		const {
			code,
			message
		} = await reqSaveUserAddress(req)
		if (code === 200) {
			uni.flowerTipToast({
				title: message,
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				})
			}, 500)

		}
	}
	// 保存收货地址
	const saveAddrssForm = async () => {
		const reqParams = {
			...addressForm,
			fullAddress: addressForm.fullAddress + addressForm.address
		}
		delete reqParams.regionList
		console.log(reqParams, 'reqParams');
		// 验证表单
		// const {
		// 	valid
		// } = await this.onValidate(reqParams)
		// if (!valid) return
		// 验证通过保存表单信息
		saveUserAddress(reqParams)
	}
</script>

<style lang="scss" scoped>
	.address {
		background-color: #fff;
		padding: 20rpx;
	}

	.row {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		line-height: 50rpx;
		padding: 24rpx 0rpx;
		position: relative;
		border-bottom: 1rpx solid #ddd;
		align-items: center;
	}

	.address-info {
		padding: 0 16rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.row {
			display: flex;
			font-size: 28rpx;
			line-height: 50rpx;
			padding: 24rpx 10rpx;
			position: relative;
			border-bottom: 1rpx solid #ddd;
			align-items: center;

			&:last-child {
				border: none;
			}

			switch {
				position: absolute;
				right: -10rpx;
				transform: scale(0.7) translateY(-6px);
			}

			.region {
				color: #333;
			}

			.placeholder {
				color: #969799;
			}

			.title {
				width: 190rpx;
				color: #333;
			}

			input,
			picker,
			textarea {
				flex: 1;
			}
		}
	}

	.button {
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 30rpx 20rpx;
		color: #fff;
		border-radius: 80rpx;
		font-size: 30rpx;
		background-color: #f3514f;
	}

	.item-tag .tag-name {
		display: inline-block;
		height: 40rpx;
		line-height: 40rpx;
		color: #777;
		padding: 0rpx 10rpx;
		border: 1px solid #777;
		margin-left: 16rpx;
		border-radius: 6rpx;

		&.active {
			color: #fff;
			border: 1px solid #f3514f;
			background-color: #f3514f;
		}

		&:first-of-type {
			margin-left: 0rpx;
		}
	}

	.location {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		margin: -24rpx -12rpx -24rpx 0rpx;

		text {
			font-size: 22rpx;
			color: #777;
			margin-left: 6rpx;
		}
	}
</style>