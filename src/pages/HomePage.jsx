import React, { useEffect, useState } from 'react';
import HomeBanner from '../components/home/HomeBanner';
import HomeBrandTable from '../components/home/HomeBrandTable';
import HomeFeaturedCar from '../components/home/HomeFeaturedCar';
import HomeCarSection from '../components/home/HomeCarSection';
import { getCars } from '../services/api';
import styles from './HomePage.module.css';

// Static featured car for demo (replace with API call)
const FEATURED_CAR = {
  id: '41739536',
  title: 'Mercedes-Benz E-Class E300 Avantgarde',
  subtitle: 'Mercedes-Benz E300 Avantgarde',
  year: 2019,
  mileage: 32085,
  engine: '1991сс, Бензин',
  price: 71520000,
};

export default function HomePage() {
  const [lexusCars, setLexusCars]     = useState([]);
  const [mbCars, setMbCars]           = useState([]);
  const [offroad, setOffroad]         = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [lx, mb, or4] = await Promise.allSettled([
          getCars({ brand: 'Lexus', limit: 8 }),
          getCars({ brand: 'Mercedes-Benz', limit: 8 }),
          getCars({ brand: 'Jeep', limit: 8 }),
        ]);
        if (lx.status === 'fulfilled') setLexusCars(lx.value.data || lx.value.cars || []);
        if (mb.status === 'fulfilled') setMbCars(mb.value.data || mb.value.cars || []);
        if (or4.status === 'fulfilled') setOffroad(or4.value.data || or4.value.cars || []);
      } catch (_) {
        // silently fail — sections just stay empty
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className={styles.page}>
      <HomeBanner />
      <HomeBrandTable />
      <HomeFeaturedCar car={FEATURED_CAR} />

      <div className={styles.sections}>
        <HomeCarSection title="LEXUS LM" cars={lexusCars} loading={loading} />
        <HomeCarSection title="Mercedes Benz!" cars={mbCars} loading={loading} />
        <HomeCarSection title="4 дугуй хөтлөгчтэй жийпүүд" cars={offroad} loading={loading} />
      </div>
    </div>
  );
}
