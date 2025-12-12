import axios from 'axios';

const API_URL = 'http://localhost:5000/api';


const getConfig = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return {};

  const user = JSON.parse(userInfo);
  return {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  };
};

export const eventAPI = {
  getAll: () => axios.get(`${API_URL}/events`, getConfig()),
  getById: (id) => axios.get(`${API_URL}/events/${id}`, getConfig()),
  create: (data) => axios.post(`${API_URL}/events`, data, getConfig()),
  update: (id, data) => axios.put(`${API_URL}/events/${id}`, data, getConfig()),
  delete: (id) => axios.delete(`${API_URL}/events/${id}`, getConfig())
};

export const teamAPI = {
  getAll: () => axios.get(`${API_URL}/teams`, getConfig()),
  getById: (id) => axios.get(`${API_URL}/teams/${id}`, getConfig()),
  search: (keyword) => axios.get(`${API_URL}/teams/search?keyword=${keyword}`, getConfig()),
  create: (data) => axios.post(`${API_URL}/teams`, data, getConfig()),
  update: (id, data) => axios.put(`${API_URL}/teams/${id}`, data, getConfig()),
  delete: (id) => axios.delete(`${API_URL}/teams/${id}`, getConfig())
};

export const statsAPI = {
  getUserStats: () => axios.get(`${API_URL}/stats`, getConfig())
};
