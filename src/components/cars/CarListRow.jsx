import React from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKRW, formatKm } from '../../utils/format';
import styles from './CarListRow.module.css';

export default function CarListRow({ car }) {
  const id       = car.id || car.vehicleId || car.encar_id;
  const title    = car.title || `${car.brand || ''} ${car.model || ''}`.trim();
  const year     = car.year || car.manufactureYear;
  const mileage  = car.mileage;
  const fuel     = car.fuelType || car.fuel;
  const cc       = car.cc || car.displacement;
  const krwPrice = car.krwPrice || car.basePrice ||
                   car.prices?.KRW ||
                   (car.price ? Math.round(parseFloat(car.price) * 10000) : null);

  // images массив эсвэл нэг image
  const images = Array.isArray(car.images) && car.images.length > 0
    ? car.images
    : car.image
      ? [car.image]
      : car.thumbnail
        ? [car.thumbnail]
        : [];

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
          {year     && <span>{year}</span>}
          {mileage != null && <><span className={styles.sep}>—</span><span>{formatKm(mileage)}</span></>}
          {fuel     && <><span className={styles.sep}>—</span><span>{fuel}</span></>}
          {cc       && <><span className={styles.sep}>—</span><span>{cc}сс</span></>}
        </div>
        {krwPrice && (
          <p className={styles.basePrice}>Үндсэн үнэ: {formatKRW(krwPrice)}</p>
        )}
        {krwPrice && (
          <p className={styles.totalPrice}>
            {formatMNT(Math.round(krwPrice * 2.4))}
          </p>
        )}
      </div>
    </Link>
  );
}