import React, { useEffect, useState } from 'react';
import HomeBanner        from '../components/home/HomeBanner';
import HomeBrandTable    from '../components/home/HomeBrandTable';
import HomeBannerCarousel from '../components/home/HomeBannerCarousel';
import HomeCarSection    from '../components/home/HomeCarSection';
import HomeServices      from '../components/home/HomeServices';
import { getCars, getCarById } from '../services/api';
import { translateCar } from '../utils/translate';
import styles from './HomePage.module.css';

const FEATURED_ID = '41739536';

const FEATURED_CAR_BASE = {
  id:      FEATURED_ID,
  title:   'Mercedes-Benz E-Class E300 Avantgarde',
  year:    2019,
  mileage: 32085,
  engine:  '1991сс, Бензин',
  price:   71520000,
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
  const [featuredCar, setFeaturedCar] = useState(FEATURED_CAR_BASE);
  const [bmwCars,     setBmwCars]     = useState([]);
  const [mbCars,      setMbCars]      = useState([]);
  const [offroad,     setOffroad]     = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [featuredRes, bmw, mb, or4] = await Promise.allSettled([
          getCarById(FEATURED_ID),
          fetchWithCache('bmw',  { brand: 'BMW',           limit: 8 }),
          fetchWithCache('mb',   { brand: 'Mercedes-Benz', limit: 8 }),
          fetchWithCache('jeep', { brand: 'Jeep',          limit: 8 }),
        ]);

        if (cancelled) return;

        if (featuredRes.status === 'fulfilled') {
          const carInfo = featuredRes.value?.data?.carInfo;
          if (carInfo?.thumbnail || carInfo?.images?.[0]) {
            setFeaturedCar((prev) => ({
              ...prev,
              thumbnail: carInfo.thumbnail || carInfo.images[0],
            }));
          }
        }

        if (bmw.status  === 'fulfilled') setBmwCars(extractCars(bmw.value).map(translateCar));
        if (mb.status   === 'fulfilled') setMbCars(extractCars(mb.value).map(translateCar));
        if (or4.status  === 'fulfilled') setOffroad(extractCars(or4.value).map(translateCar));
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

      {/* Баннер + онцлох машин нэг carousel болгон нэгтгэв */}
      <HomeBannerCarousel featuredCar={featuredCar} />

      <div className={styles.sections}>
        <HomeCarSection title="BMW"                         cars={bmwCars}  loading={loading} />
        <HomeCarSection title="Mercedes-Benz"               cars={mbCars}   loading={loading} />
        <HomeCarSection title="4 дугуй хөтлөгчтэй жийпүүд" cars={offroad}  loading={loading} />
      </div>
      <HomeServices />
    </div>
  );
}