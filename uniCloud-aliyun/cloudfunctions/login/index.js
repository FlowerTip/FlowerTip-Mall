'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.databaseForJQL();
	const res = await db.collection('users')
		.add({
			username: event.username,
			password: event.password,
			nickname: event.username,
			headimgurl: 'https://mp-ab666efd-69a6-4fa6-9915-b0a6e7ee1bdf.cdn.bspapp.com/avatar.jpg'
		});
	return res;
};