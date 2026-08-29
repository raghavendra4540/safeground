import api from './api.js';
export const runSimulation = (data) => api.post('/simulation/run', data);
