import api from './api.js';
export const getHazards = (params) => api.get('/hazards', { params });
export const getHazardsByType = (type) => api.get(`/hazards/${type}`);
