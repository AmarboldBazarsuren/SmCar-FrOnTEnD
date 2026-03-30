import { useState, useEffect, useCallback } from 'react';
import { getCars } from '../services/api';

export default function useCars(initialFilters = {}) {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchCars = useCallback(async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCars(f);
      setCars(data.data || data.cars || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars(filters);
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return { cars, total, loading, error, filters, updateFilters, refetch: fetchCars };
}
