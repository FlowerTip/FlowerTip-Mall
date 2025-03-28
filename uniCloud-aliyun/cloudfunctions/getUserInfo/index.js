'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.databaseForJQL();
	const res = await db.collection('users')
		.where({
			_id: event.id
		})
		.get();
	return res;
};
