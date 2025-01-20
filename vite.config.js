import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni'; // 引用官方插件

export default defineConfig({
	plugins: [
		uni(),
	],
	server: {
		proxy: {
			'/h5': {
				target: 'https://gmall-prod.atguigu.cn/mall-api', // 目标服务  
				changeOrigin: true,
				rewrite: path => path.replace(/^\/h5/, ''),
			}
		}
	},
	resolve: {
		alias: {
			'@': '/', // 设置别名
		},
	},
})