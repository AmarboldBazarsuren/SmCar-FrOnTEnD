import React from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKRW, formatKm } from '../../utils/format';
import styles from './CarCard.module.css';

export default function CarCard({ car }) {
  const id = car.id || car.vehicleId;
  const title = car.title || `${car.brand || ''} ${car.model || ''}`.trim();
  const year = car.year || car.manufactureYear;
  const mileage = car.mileage;
  const fuel = car.fuelType || car.fuel;
  const cc = car.cc || car.displacement;
  const basePrice = car.krwPrice || car.basePrice;
  const totalPrice = car.totalPrice || car.mntPrice;
  const thumbnail = car.thumbnail || car.images?.[0] || car.image;

  return (
    <Link to={`/listing/${id}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.img} loading="lazy" />
        ) : (
          <div className={styles.imgPlaceholder}>
            <span>📷</span>
          </div>
        )}
        {car.isNew && <span className={styles.badgeNew}>Шинэ</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          {year && <span>{year}</span>}
          {mileage != null && <><span className={styles.sep}>—</span><span>{formatKm(mileage)}</span></>}
          {fuel && <><span className={styles.sep}>—</span><span>{fuel}</span></>}
          {cc && <><span className={styles.sep}>—</span><span>{cc}сс</span></>}
        </div>
        {basePrice && (
          <p className={styles.basePrice}>Үндсэн үнэ: {formatKRW(basePrice)}</p>
        )}
        <p className={styles.totalPrice}>{formatMNT(totalPrice || basePrice * 2.4)}</p>
      </div>
    </Link>
  );
}
