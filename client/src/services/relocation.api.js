import api from './api.js';
export const analyzeRelocation = (data) => api.post('/relocation/analyze', data);
export const createRelocationPlan = (data) => api.post('/relocation/create', data);
export const getRelocationPlans = () => api.get('/relocation');
