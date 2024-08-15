import axios from 'axios';

const API_URL = 'https://mytasks-bkndss.onrender.com';

export const fetchTasks = () => axios.get(`${API_URL}/tasks`);
export const fetchTaskById = (id) => axios.get(`${API_URL}/tasks/${id}`);
export const createTask = (task) => axios.post(`${API_URL}/tasks`, task);
export const updateTask = (id, task) => axios.put(`${API_URL}/tasks/${id}`, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/tasks/${id}`);