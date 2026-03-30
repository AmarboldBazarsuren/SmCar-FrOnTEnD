import React from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKRW, formatKm } from '../../utils/format';
import styles from './CarCard.module.css';

export default function CarCard({ car }) {
  const id       = car.id || car.vehicleId || car.encar_id;
  const title    = car.title || `${car.brand || ''} ${car.model || ''}`.trim();
  const year     = car.year || car.manufactureYear;
  const mileage  = car.mileage;
  const fuel     = car.fuelType || car.fuel;
  const cc       = car.cc || car.displacement;
  const krwPrice = car.krwPrice || car.basePrice ||
                   car.prices?.KRW ||
                   (car.price ? Math.round(parseFloat(car.price) * 10000) : null);
  // thumbnail: image эсвэл images[0]
  const thumbnail = car.thumbnail || car.image ||
                    (Array.isArray(car.images) ? car.images[0] : null);

  return (
    <Link to={`/listing/${id}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.img} loading="lazy" />
        ) : (
          <div className={styles.imgPlaceholder}><span>📷</span></div>
        )}
        {car.isNew && <span className={styles.badgeNew}>Шинэ</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          {year     && <span>{year}</span>}
          {mileage != null && <><span className={styles.sep}>—</span><span>{formatKm(mileage)}</span></>}
          {fuel     && <><span className={styles.sep}>—</span><span>{fuel}</span></>}
          {cc       && <><span className={styles.sep}>—</span><span>{cc}сс</span></>}
        </div>
        {krwPrice && (
          <p className={styles.basePrice}>Үндсэн үнэ: {formatKRW(krwPrice)}</p>
        )}
        {/* Нийт үнэ backend-аас ирэхгүй тул ойролцоо тооцоолно */}
        {krwPrice && (
          <p className={styles.totalPrice}>{formatMNT(Math.round(krwPrice * 2.4))}</p>
        )}
      </div>
    </Link>
  );
}