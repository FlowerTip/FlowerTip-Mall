<template>
	<view class="container address">
		<uv-form :model="addressForm" :rules="addressFormRules" label-width="120" ref="addressFormRef">
			<uv-form-item label="收货人" prop="name" borderBottom>
				<uv-input v-model="addressForm.name" border="none" placeholder="请输入收货人姓名">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="手机号码" prop="phone" borderBottom>
				<uv-input v-model="addressForm.phone" border="none" placeholder="请输入收货人手机号">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="所在地区" prop="regionList" borderBottom>
				<text v-if="!addressForm.regionList" class="placeholder-color" @click="openAddressPicker">请选择收货人所在地区</text>
				<text v-else @click="openAddressPicker">{{addressForm.regionList}}</text>
			</uv-form-item>
			<uv-form-item label="详细地址" prop="address" borderBottom>
				<uv-input v-model="addressForm.address" border="none" placeholder="门牌号(例：5号楼1单元203室)">
				</uv-input>
			</uv-form-item>
		</uv-form>
		<view class="row">
			<text class="title">设置默认地址</text>
			<uv-switch v-model="addressForm.isDefault" active-color="#f3514f" size="20"></uv-switch>
		</view>
		<!-- 提交按钮 -->
		<button class="button" @click="saveAddrssForm">保存</button>

		<!-- 所在地区选择器 -->
		<uv-picker ref="pickerRef" :columns="regionOriginList" keyName="name" @change="pickChange" @confirm="confirm">
		</uv-picker>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		computed
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		reqGetAddressDetail,
		reqSaveUserAddress,
	} from '../../../api/address'
	import regionJson from './region.js';

	const addressFormRef = ref(null);
	const addressFormRules = {
		name: {
			type: 'string',
			required: true,
			message: '请填写收货人的姓名',
			trigger: ['blur', 'change']
		},
		phone: {
			type: 'string',
			required: true,
			message: '请填写收货人的手机号',
			trigger: ['blur', 'change']
		},
		address: {
			type: 'string',
			required: true,
			message: '请填写门牌号详细地址',
			trigger: ['blur', 'change']
		},
		regionList: {
			type: 'string',
			required: true,
			message: '请选择收货人所在地区',
			trigger: ['blur', 'change']
		}
	}

	const pickerRef = ref(null);
	const addressForm = reactive({
		id: '',
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
		isDefault: false,
		id: '',
		regionList: ''
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
	const confirm = (e) => {
		addressForm.provinceCode = e.value[0].code;
		addressForm.provinceName = e.value[0].name;
		addressForm.cityCode = e.value[1].code;
		addressForm.cityName = e.value[1].name;
		addressForm.districtCode = e.value[2].code;
		addressForm.districtName = e.value[2].name;
		addressForm.regionList = `${e.value[0].name}/${e.value[1].name}/${e.value[2].name}`;
		addressFormRef.value.clearValidate('regionList');
	}

	const regionOriginList = computed(() => {
		return [provinces.value, citys.value, areas.value];
	})
	let regionOriginData = [];
	onLoad((option) => {
		option.id && getAddressDetail(option.id);
		getData();
	})
	const getData = () => {
		regionOriginData = regionJson;
		provinces.value = regionOriginData.sort((left, right) => (Number(left.code) > Number(right.code) ? 1 : -1));
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
		pickerValue.value[0] = regionOriginData.findIndex(item => Number(item.id) === defaultValue.value[0]);
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
			addressForm.id = data.id;
			addressForm.isDefault = data.isDefault == 1 ? true : false;
			addressForm.name = data.name;
			addressForm.address = data.address;
			addressForm.phone = data.phone;
			const pName = data.provinceName ? data.provinceName : '北京';
			addressForm.regionList = pName + '/' + data.cityName + '/' + data.districtName;
			const currentProvince = regionOriginData.find(item => data.provinceCode == item.code);
			if (currentProvince) {
				const currentCity = currentProvince.children.find(item => data.cityCode == item.code);
				if (currentCity) {
					const currentDistrict = currentCity.children.find(item => data.districtCode == item.code);
					defaultValue.value = [currentProvince.id * 1, currentCity.id * 1, currentDistrict.id * 1];
				}
			}
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
	const saveAddrssForm = () => {
		addressFormRef.value.validate().then(async res => {
			const reqParams = {
				...addressForm,
				fullAddress: addressForm.fullAddress + addressForm.address,
				isDefault: addressForm.isDefault ? 1 : 0
			}
			delete reqParams.regionList
			console.log(reqParams, 'reqParams');
			saveUserAddress(reqParams)
		}).catch(errors => {
			if (errors.length > 0) {
				uni.showToast({
					icon: 'error',
					title: '表单校验失败'
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	.placeholder-color {
		color: #ccc;
	}

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