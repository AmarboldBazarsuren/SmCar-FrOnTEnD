import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Admin token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Cars ────────────────────────────────────────────────────────────────────
export const getCars    = (params = {}) => api.get('/cars', { params }).then((r) => r.data);
export const getCarById = (id)          => api.get(`/cars/${id}`).then((r) => r.data);
export const calcPrice  = (body)        => api.post('/cars/price-calc', body).then((r) => r.data);

// ── Public banners ──────────────────────────────────────────────────────────
export const getBanners = () => api.get('/banners').then((r) => r.data);

// ── Admin auth ──────────────────────────────────────────────────────────────
export const adminLogin  = (body) => api.post('/admin/login', body).then((r) => r.data);
export const adminLogout = ()     => api.post('/admin/logout').then((r) => r.data);
export const adminMe     = ()     => api.get('/admin/me').then((r) => r.data);

// ── Admin price config ──────────────────────────────────────────────────────
export const getPriceConfig    = ()     => api.get('/admin/price-config').then((r) => r.data);
export const updatePriceConfig = (body) => api.put('/admin/price-config', body).then((r) => r.data);

// ── Admin tax config ────────────────────────────────────────────────────────
export const getTaxConfig    = ()     => api.get('/admin/tax-config').then((r) => r.data);
export const updateTaxConfig = (body) => api.put('/admin/tax-config', body).then((r) => r.data);

// ── Admin banners ───────────────────────────────────────────────────────────
export const getAdminBanners  = ()          => api.get('/admin/banners').then((r) => r.data);
export const createAdminBanner = (body)     => api.post('/admin/banners', body).then((r) => r.data);
export const updateAdminBanner = (id, body) => api.put(`/admin/banners/${id}`, body).then((r) => r.data);
export const deleteAdminBanner = (id)       => api.delete(`/admin/banners/${id}`).then((r) => r.data);