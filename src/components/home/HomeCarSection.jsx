import React, { useRef } from 'react';
import CarCard from '../cars/CarCard';
import styles from './HomeCarSection.module.css';

export default function HomeCarSection({ title, cars, loading }) {
  const scrollRef = useRef(null);

  // cars array биш бол хамгаалах
  const carList = Array.isArray(cars) ? cars : [];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <button className={styles.arrow} onClick={() => scroll(-1)}>‹</button>
          <button className={styles.arrow} onClick={() => scroll(1)}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={scrollRef}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
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