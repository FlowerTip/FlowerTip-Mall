/**
 * @description 同步获取本地缓存数据
 * @param {*} key 
 */
export const getStorage = (key) => {
	try {
		return uni.getStorageSync(key)
	} catch (error) {
		console.log(`获取本地${key}缓存数据错误：${error}`)
	}
}

/**
 * @description 异步获取本地缓存数据
 * @param {*} key 
 */
export const asyncGetStorage = (key) => {
	return new Promise(resolve => {
		uni.getStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 同步存储本地缓存数据
 * @param {*} key 
 * @param {*} data 
 */
export const setStorage = (key, data) => {
	try {
		uni.setStorageSync(key, data)
	} catch (error) {
		console.log(`存储本地${key}缓存数据错误：${error}`);
	}
}

/**
 * @description 异步存储本地缓存数据
 * @param {*} key 
 * @param {*} data 
 */
export const asyncSetStorage = (key, data) => {
	return new Promise(resolve => {
		uni.setStorage({
			key,
			data,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 同步删除本地缓存数据
 * @param {*} key 
 */
export const removeStorage = (key) => {
	try {
		uni.removeStorageSync(key)
	} catch (error) {
		console.log(`删除本地${key}缓存数据错误：${error}`);
	}
}

/**
 * @description 异步删除本地缓存数据
 * @param {*} key 
 */
export const asyncRemoveStorage = (key) => {
	return new Promise(resolve => {
		uni.removeStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 同步清空本地所有缓存数据
 */
export const clearStorage = () => {
	try {
		uni.clearStorageSync()
	} catch (error) {
		console.log(`清空本地所有缓存数据错误：${error}`);
	}
}

/**
 * @description 异步清空本地缓存数据
 */
export const asyncClearStorage = () => {
	return new Promise(resolve => {
		uni.clearStorage({
			complete(res) {
				resolve(res)
			}
		})
	})
}