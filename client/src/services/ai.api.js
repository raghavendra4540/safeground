import api from './api.js';
export const analyzeRisk = (data) => api.post('/ai/analyze-risk', data);
export const recommendSite = (data) => api.post('/ai/recommend-site', data);
export const getEmergencyPlan = (data) => api.post('/ai/emergency-plan', data);
export const generateReport = (data) => api.post('/ai/report', data);
export const getAIStatus = () => api.get('/ai/status');
