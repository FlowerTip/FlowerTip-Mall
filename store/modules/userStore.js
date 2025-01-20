import {
	defineStore
} from 'pinia';
import {
	getStorage
} from '@/utils/storage.js';

const useUserStore = defineStore('user', {
	// 状态数据
	state: () => {
		return {
			token: getStorage('token') || '',
			userInfo: getStorage('userInfo') || {
				nickname: '',
				headimgurl: ''
			}
		}
	},
	actions: {
		// 更新状态数据的方法
		setToken (token) {
			this.token = token
		},
		setUserInfo (userInfo) {
			this.userInfo = userInfo
		}
	},
});

export default useUserStore;