import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mini-project-production-ee75.up.railway.app/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const analyzeSymptoms = async (symptoms, symptom_text) => {
  const body = symptom_text ? { symptom_text } : { symptoms };
  const { data } = await api.post('/symptoms/analyze', body);
  return data;
};

export const listSymptoms = async () => {
  const { data } = await api.get('/symptoms/list');
  return data;
};

export const getHistory = async (token) => {
  const { data } = await api.get('/history', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const saveHistory = async (payload, token) => {
  const { data } = await api.post('/history', payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getUserProfile = async (token) => {
  const { data } = await api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const updateUserProfile = async (payload, token) => {
  const { data } = await api.put('/auth/profile', payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export default api;
