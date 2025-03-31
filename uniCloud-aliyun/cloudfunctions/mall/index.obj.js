// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function() {
		/**
		 * 通用处理器
		 * 获取当前方法的名称
		 */
		// const methodName = this.getMethodName();
		// const params = this.getParams();
		// const fnList = ['login', 'wechat'];
		// if (!fnList.includes(methodName) && !params.token) {
		// 	throw new Error('token为空');
		// }
	},
	/** H5平台登录
	 * @param {string} username 用户名
	 * @param {string} password 密码
	 */
	async login({
		username,
		password
	}) {
		const db = uniCloud.databaseForJQL();
		const findUser = await db.collection('users')
			.where({
				username: username,
				password: password
			})
			.get();
		console.log(findUser, 'findUser@@@');
		if (findUser.data && findUser.data.length > 0) {
			return {
				code: 0,
				...findUser.data[0],
				id: findUser.data[0]._id
			};
		} else {
			const res = await db.collection('users')
				.add({
					username: username,
					password: password,
					nickname: username,
					headimgurl: 'https://mp-ab666efd-69a6-4fa6-9915-b0a6e7ee1bdf.cdn.bspapp.com/avatar.jpg'
				});
			console.log(res, 'ashhsahh')
			return res;
		}
	},
	/**
	 * 微信登录获取openid
	 * @param {string}  code 前端传的微信获取到的code
	 */
	async wechat({
		code
	}) {
		const appid = 'wxee039a570854a352';
		const appsercet = '7afb314dbb365f2d5ba25bae33cc1357';
		const url =
			`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsercet}&js_code=${code}&grant_type=authorization_code`
		const res = await uniCloud.httpclient.request(url, {
			method: "GET",
			data: {},
			dataType: 'json',
			header: {
				'content-type': 'application/json'
			}
		})
		console.log(res, 'dayin')
		return res.data;
	},
	/**
	 * 获取用户信息
	 * @param {number}  id 账号id
	 */
	async getUserInfo({
		id
	}) {
		const db = uniCloud.databaseForJQL();
		const res = await db.collection('users')
			.where({
				_id: id
			})
			.get();
		return res.data;
	},
	/**
	 * @param {Object} param
	 */
	async getCartList(param) {
		console.log(param, '@@@param')
		const db = uniCloud.databaseForJQL();
		const res = await db.collection('carts')
			.get();
		return res.data;
	},
	/**
	 * 加入购物车功能
	 * @param {Object} param
	 */
	async addCartList(param) {
		const {
			goodsId,
			count,
			blessing
		} = param;

		const db = uniCloud.databaseForJQL();
		const res = await db.collection('goods')
			.where({
				_id: goodsId
			})
			.get();
		console.log(res, 'yuuinhan');
		const item = res.data[0];
		const result = await db.collection('carts')
			.add({
				goodsId: item._id,
				count,
				price: item.Price,
				name: item.Cpmc + item.Instro,
				imageUrl: item.imageUrl,
				blessing,
				isChecked: false
			});
		return {
			code: 0,
			message: '添加成功'
		};
	},
	/**
	 * 更新购物车商品选中状态
	 * @param {Object} param
	 */
	async checkedCart(param) {
		const {
			goodsId,
			isChecked,
		} = param;

		const db = uniCloud.databaseForJQL();
		const res = await db.collection('carts')
			.where({
				goodsId
			})
			.update({
				isChecked: !isChecked
			});
		return {
			code: 0,
			message: '更新成功'
		};
	},
	/**
	 * 全选 | 全不选 购物车商品
	 * @param {Object} param
	 */
	async allCheckedCart(param) {
		const {
			isChecked,
		} = param;

		const db = uniCloud.databaseForJQL();
		const res = await db.collection('carts')
			.update({
				isChecked: !isChecked
			});
		return {
			code: 0,
			message: '更新成功'
		};
	},
	/**
	 * 删除购物车商品
	 * @param {Object} param
	 */
	async delCart(param) {
		const {
			id
		} = param;
		const db = uniCloud.databaseForJQL();
		await db.collection('carts')
			.where({
				_id: id
			})
			.remove();
		return {
			code: 0,
			message: '删除成功'
		};
	},
	/**
	 * 查询收货地址列表
	 */
	async getAddressList() {
		const db = uniCloud.databaseForJQL();
		const res = await db.collection('addresses')
			.get();
		return res.data;
	},
	/**
	 * 添加收货地址
	 * @param {Object} param
	 */
	async addAddress(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('addresses')
			.add({
				name: param.name,
				phone: param.phone,
				provinceName: param.provinceName,
				provinceCode: param.provinceCode,
				cityName: param.cityName,
				cityCode: param.cityCode,
				districtName: param.districtName,
				districtCode: param.districtCode,
				address: param.address,
				fullAddress: param.fullAddress,
				isDefault: param.isDefault
			});
		return {
			code: 0,
			message: '添加成功'
		};
	},
	/**
	 * 删除收货地址
	 * @param {Object} param
	 */
	async delAddress(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('addresses')
			.where({
				_id: param.id
			})
			.remove();
		return {
			code: 0,
			message: '删除成功'
		};
	},
	/**
	 * 更新收货地址
	 * @param {Object} param
	 */
	async updateAddress(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('addresses')
			.where({
				_id: param.id
			})
			.update({
				name: param.name,
				phone: param.phone,
				provinceName: param.provinceName,
				provinceCode: param.provinceCode,
				cityName: param.cityName,
				cityCode: param.cityCode,
				districtName: param.districtName,
				districtCode: param.districtCode,
				address: param.address,
				fullAddress: param.fullAddress,
				isDefault: param.isDefault,
			});
		return {
			code: 0,
			message: '更新成功'
		};
	},
	/**
	 * 查询地址详情
	 * @param {Object} param
	 */
	async getAddressDetail(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('addresses')
			.where({
				_id: param.id
			})
			.get();
		console.log(result, 'TTTre');
		return result.data[0];
	},
	/**
	 * 获取订单详情
	 */
	async getOrderTrade() {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('carts')
			.where({
				isChecked: true
			})
			.get();
		const totalMoney = result.data.reduce((prev, next) => prev + next.price * next.count, 0);
		const totalCount = result.data.reduce((prev, next) => prev + next.count, 0);
		const cartList = result.data.map(item => {
			return {
				goodsId: item.goodsId,
				name: item.name,
				imageUrl: item.imageUrl,
				price: item.price,
				count: item.count,
				blessing: item.blessing,
				isChecked: item.isChecked,
				createTime: item.createTime,
				updateTime: item.updateTime,
			}
		})
		console.log(result, totalCount, totalMoney, cartList, '视觉很好')
		return {
			code: 0,
			message: '获取订单详情成功',
			data: {
				totalAmount: totalMoney,
				totalCount: totalCount,
				cartVoList: cartList
			}
		}
	},
	/**
	 * 获取订单地址
	 */
	async getOrderAddress() {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('addresses')
			.where({
				isDefault: true
			})
			.get();
		console.log(result.data, 'asjdjasj')
		return {
			code: 0,
			message: '获取订单地址成功',
			data: result.data[0]
		}
	},
	/**
	 * 生成订单
	 */
	async createOrder(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('orders')
			.add({
				...param
			});
		return {
			code: 0,
			message: '提交成功',
			data: 'xxx1231231231'
		}
	},
	/**
	 * 获取订单列表
	 * @param {Object} param
	 */
	async getOrderList(param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('orders')
			.get();
		console.log(result, 'pppp')
		const orderList = result.data.map((item, index) => {
			return {
				id: item._id,
				orderNo: 'ddbx000000000000000' + (index + 1),
				orderStatus: 0,
				orderDetailList: item.cartList.map(obj => {
					return {
						...obj,
					}
				}),
				totalAmount: item.cartList.reduce((prev, next) => prev + next.price * next.count, 0)
			}
		})
		return {
			code: 0,
			message: '查询成功',
			data: orderList
		}
	},
	/**
	 * 获取订单订购详情信息
	 * @param {Object} param
	 */
	async getOrderDetail (param) {
		const db = uniCloud.databaseForJQL();
		const result = await db.collection('orders')
			.where({
				_id: param.id
			})
			.get();
		return {
			code: 0,
			message: '查询成功',
			data: result.data[0]
		}
	}
}