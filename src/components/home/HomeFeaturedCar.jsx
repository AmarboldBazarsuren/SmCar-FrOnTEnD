import React from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKm } from '../../utils/format';
import styles from './HomeFeaturedCar.module.css';

export default function HomeFeaturedCar({ car }) {
  if (!car) return null;

  return (
    <div className={styles.hero}>
      <div className={styles.imageWrap}>
        {car.thumbnail && (
          <img src={car.thumbnail} alt={car.title} className={styles.image} />
        )}
        <div className={styles.imageBadge}>ОНЦЛОХ МАШИН</div>
      </div>
      <div className={styles.info}>
        <div className={styles.badge}>ОНЦЛОХ МАШИН</div>
        <h2 className={styles.title}>{car.title}</h2>
        {car.subtitle && <p className={styles.subtitle}>{car.subtitle} — Хамгийн хямдаар!</p>}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>ҮЙЛДВЭРЛЭСЭН:</span>
            <span className={styles.specValue}>{car.year}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>ГҮЙЛТ:</span>
            <span className={styles.specValue}>{formatKm(car.mileage)}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>ХӨДӨЛГҮҮР:</span>
            <span className={styles.specValue}>{car.engine}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>ҮНЭ:</span>
            <span className={styles.specPrice}>{formatMNT(car.price)}</span>
          </div>
        </div>
        <Link to={`/listing/${car.id}`} className={styles.detailBtn}>
          ДЭЛГЭРЭНГҮЙ ҮЗЭХ
        </Link>
      </div>
    </div>
  );
}
