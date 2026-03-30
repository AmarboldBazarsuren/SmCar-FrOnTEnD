import React, { useState } from 'react';
import styles from './CarImageGallery.module.css';

export default function CarImageGallery({ images = [], title }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images.length) {
    return (
      <div className={styles.placeholder}>
        <span>📷 Зураг байхгүй</span>
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div className={styles.mainWrap}>
        <img
          src={images[activeIdx]}
          alt={`${title} - ${activeIdx + 1}`}
          className={styles.mainImg}
        />
        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prev}>‹</button>
        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={next}>›</button>
        <div className={styles.counter}>{activeIdx + 1} / {images.length}</div>
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbs}>
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${activeIdx === i ? styles.thumbActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <img src={img} alt={`thumb-${i}`} />
            {i === 3 && images.length > 4 && (
              <div className={styles.moreOverlay}>+{images.length - 4}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
