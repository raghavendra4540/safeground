import api from './api.js';
export const getSettlements = (params) => api.get('/settlements', { params });
export const getSettlementById = (id) => api.get(`/settlements/${id}`);
export const getSettlementRisk = (id) => api.get(`/settlements/${id}/risk`);
export const getSettlementVulnerability = (id) => api.get(`/settlements/${id}/vulnerability`);
