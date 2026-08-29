import api from './api.js';
export const getSafeSites = (params) => api.get('/safe-sites', { params });
export const getSafeSiteById = (id) => api.get(`/safe-sites/${id}`);
export const getRecommendedSites = (settlementId) => api.get(`/safe-sites/recommended/${settlementId}`);
