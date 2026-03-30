import React from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKRW, formatKm } from '../../utils/format';
import styles from './CarListRow.module.css';

export default function CarListRow({ car }) {
  const id = car.id || car.vehicleId;
  const title = car.title || `${car.brand || ''} ${car.model || ''}`.trim();
  const year = car.year || car.manufactureYear;
  const mileage = car.mileage;
  const fuel = car.fuelType || car.fuel;
  const cc = car.cc || car.displacement;
  const basePrice = car.krwPrice || car.basePrice;
  const totalPrice = car.totalPrice || car.mntPrice;
  const images = car.images || (car.thumbnail ? [car.thumbnail] : []);

  return (
    <Link to={`/listing/${id}`} className={styles.row}>
      <div className={styles.images}>
        {images.slice(0, 2).map((img, i) => (
          <div key={i} className={styles.imgWrap}>
            <img src={img} alt={title} className={styles.img} loading="lazy" />
          </div>
        ))}
        {images.length === 0 && (
          <div className={`${styles.imgWrap} ${styles.placeholder}`}>
            <span>📷</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
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
        <p className={styles.totalPrice}>{formatMNT(totalPrice)}</p>
      </div>
    </Link>
  );
}
