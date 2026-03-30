import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export const getCars = (params = {}) =>
  api.get('/cars', { params }).then((r) => r.data);

export const getCarById = (id) =>
  api.get(`/cars/${id}`).then((r) => r.data);

export const calcPrice = (body) =>
  api.post('/cars/price-calc', body).then((r) => r.data);

export const getPriceConfig = () =>
  api.get('/admin/price-config').then((r) => r.data);

export const getTaxConfig = () =>
  api.get('/admin/tax-config').then((r) => r.data);
