import React, { useEffect, useState } from 'react';
import HomeBanner from '../components/home/HomeBanner';
import HomeBrandTable from '../components/home/HomeBrandTable';
import HomeFeaturedCar from '../components/home/HomeFeaturedCar';
import HomeCarSection from '../components/home/HomeCarSection';
import { getCars } from '../services/api';
import { translateCar } from '../utils/translate';
import styles from './HomePage.module.css';

const FEATURED_CAR = {
  id: '41739536',
  title: 'Mercedes-Benz E-Class E300 Avantgarde',
  year: 2019,
  mileage: 32085,
  engine: '1991сс, Бензин',
  price: 71520000,
};

const extractCars = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data.cars)) return res.data.cars;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.cars)) return res.cars;
  return [];
};

const _cache = {};
const fetchWithCache = async (key, params) => {
  if (_cache[key]) return _cache[key];
  const data = await getCars(params);
  _cache[key] = data;
  return data;
};

export default function HomePage() {
  const [lexusCars, setLexusCars] = useState([]);
  const [mbCars,    setMbCars]    = useState([]);
  const [offroad,   setOffroad]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [lx, mb, or4] = await Promise.allSettled([
          fetchWithCache('lexus', { brand: 'Lexus',         limit: 8 }),
          fetchWithCache('mb',    { brand: 'Mercedes-Benz', limit: 8 }),
          fetchWithCache('jeep',  { brand: 'Jeep',          limit: 8 }),
        ]);
        if (cancelled) return;
        if (lx.status  === 'fulfilled') setLexusCars(extractCars(lx.value).map(translateCar));
        if (mb.status  === 'fulfilled') setMbCars(extractCars(mb.value).map(translateCar));
        if (or4.status === 'fulfilled') setOffroad(extractCars(or4.value).map(translateCar));
      } catch (e) {
        console.error('HomePage fetch error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.page}>
      <HomeBanner />
      <HomeBrandTable />
      <HomeFeaturedCar car={FEATURED_CAR} />
      <div className={styles.sections}>
        <HomeCarSection title="LEXUS"                       cars={lexusCars} loading={loading} />
        <HomeCarSection title="Mercedes-Benz"               cars={mbCars}    loading={loading} />
        <HomeCarSection title="4 дугуй хөтлөгчтэй жийпүүд" cars={offroad}   loading={loading} />
      </div>
    </div>
  );
}