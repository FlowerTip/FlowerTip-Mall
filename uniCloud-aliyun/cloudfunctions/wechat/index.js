'use strict';
exports.main = async (event, context) => {
	// event为客户端上传的参数
	console.log('event.cod : ', event)
	const code = event.code;
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

	// 返回数据给客户端
	return res;
};