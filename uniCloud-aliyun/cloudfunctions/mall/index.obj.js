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
	}
}