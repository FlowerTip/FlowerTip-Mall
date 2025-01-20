/**
 * @description 自定义flowerTipToast消息提示方法
 * @param {*} title 提示的内容
 * @param {*} icon 显示的图标 success | error | loading | none
 * @param {*} mask 是否显示遮罩，避免触摸穿透
 * @param {*} duration 提示信息显示时长
 */
export const flowerTipToast = ({
	title = '数据加载中...',
	icon = 'none',
	mask = true,
	duration = 2000
} = {}) => {
	uni.showToast({
		title,
		icon,
		mask,
		duration
	})
}

/**
 * @description 自定义flowerTipModal模态框方法
 * @param {*}  option 同wx.showModal(options) 传入的配置一样
 */
export const flowerTipModal = (option = {}) => {
	return new Promise(resolve => {
		// 默认配置参数
		const defaultOption = {
			title: '提示',
			content: '您确定执行该操作吗?',
			confirmColor: '#f3514f',
		}
		// 将传入的配置参数和默认配置参数合并
		const options = Object.assign({}, defaultOption, option)
		// 传递给wx.showModal方法
		uni.showModal({
			...options,
			complete({
				confirm,
				cancel
			}) {
				// 如果用户点击了确定，通过 resolve 抛出 true
				confirm && resolve(true)
				// 如果用户点击了取消，通过 resolve 抛出 false
				cancel && resolve(false)
			}
		})
	})
}

// 将封装的自定义方法挂载到wx的实例上
uni.flowerTipToast = flowerTipToast;
uni.flowerTipModal = flowerTipModal;