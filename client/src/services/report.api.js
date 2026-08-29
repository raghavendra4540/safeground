import api from './api.js';
export const getReports = () => api.get('/reports');
export const getReportById = (id) => api.get(`/reports/${id}`);
