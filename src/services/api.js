import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Ganti dengan URL backend Anda
  timeout: 5000, // Timeout request
});

export default api;