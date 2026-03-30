import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CarListPage from './pages/CarListPage';
import CarDetailPage from './pages/CarDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cars" element={<CarListPage />} />
          <Route path="cars/:brand" element={<CarListPage />} />
          <Route path="cars/:brand/:model" element={<CarListPage />} />
          <Route path="listing/:id" element={<CarDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
