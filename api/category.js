import http from '../utils/http';

// 获取轮播图数据
export const reqCategoryPageData = () => http.get(`/index/findCategoryTree`)