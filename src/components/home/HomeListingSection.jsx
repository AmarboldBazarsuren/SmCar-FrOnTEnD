// src/components/home/HomeListingSection.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatMNT, formatKRW, formatKm } from '../../utils/format';
import styles from './HomeListingSection.module.css';

function ListingCard({ item }) {
  const thumbnail = item.images?.[0] || '';
  const imgCount  = item.images?.length || 0;
  const mntPrice  = item.krwPrice ? Math.round(item.krwPrice * 2.4) : null;

  return (
    <Link to={`/listing-detail/${item._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imgWrap}>
          {thumbnail ? (
            <img src={thumbnail} alt={item.title} className={styles.img} loading="lazy" />
          ) : (
            <div className={styles.imgPlaceholder}><span>📷</span></div>
          )}
          <span className={styles.badge}>Зар</span>
          {imgCount > 1 && (
            <span className={styles.imgCount}>📷 {imgCount}</span>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.meta}>
            {item.year     && <span>{item.year}</span>}
            {item.mileage  != null && <><span className={styles.sep}>—</span><span>{formatKm(item.mileage)}</span></>}
            {item.fuelType && <><span className={styles.sep}>—</span><span>{item.fuelType}</span></>}
            {item.cc       && <><span className={styles.sep}>—</span><span>{item.cc}сс</span></>}
          </div>
          {item.krwPrice && (
            <p className={styles.basePrice}>Үндсэн үнэ: {formatKRW(item.krwPrice)}</p>
          )}
          {mntPrice && <p className={styles.totalPrice}>{formatMNT(mntPrice)}</p>}
        </div>
      </div>
    </Link>
  );
}

export default function HomeListingSection({ listings = [], loading }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(`.${styles.cardWrap}`);
    const cardW = card ? card.offsetWidth + 16 : 300;
    trackRef.current.scrollBy({ left: dir * cardW * 4, behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>🔥 Онцлох зарууд</h2>
          <span className={styles.subLabel}>Манай санал болгох машинууд</span>
        </div>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scroll(-1)}>‹</button>
          <button className={styles.arrow} onClick={() => scroll(1)}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${styles.cardWrap} ${styles.skeleton}`} />
            ))
          : listings.map((item) => (
              <div key={item._id} className={styles.cardWrap}>
                <ListingCard item={item} />
              </div>
            ))}
      </div>
    </section>
  );
}