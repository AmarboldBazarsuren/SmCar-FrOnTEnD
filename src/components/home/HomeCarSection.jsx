import React, { useRef } from 'react';
import CarCard from '../cars/CarCard';
import styles from './HomeCarSection.module.css';

export default function HomeCarSection({ title, cars, loading }) {
  const trackRef = useRef(null);
  const carList = Array.isArray(cars) ? cars : [];

  const scroll = (dir) => {
    if (!trackRef.current) return;
    // Нэг удаад 4 картын өргөнөөр гүйх
    const card = trackRef.current.querySelector(`.${styles.cardWrap}`);
    const cardW = card ? card.offsetWidth + 16 : 300;
    trackRef.current.scrollBy({ left: dir * cardW * 4, behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scroll(-1)}>‹</button>
          <button className={styles.arrow} onClick={() => scroll(1)}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`${styles.cardWrap} ${styles.skeleton}`} />
            ))
          : carList.map((car) => (
              <div key={car.id || car.vehicleId} className={styles.cardWrap}>
                <CarCard car={car} />
              </div>
            ))}
      </div>
    </section>
  );
}