import React, { useState, useEffect, useRef } from 'react';
import styles from './CarImageGallery.module.css';

const thumbUrl = (url) => url.replace('rw=1280&cw=1280', 'rw=200&cw=200');

export default function CarImageGallery({ images = [], title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const preloadRef                = useRef([]);
  const thumbsRef                 = useRef(null);

  // Preload images
  useEffect(() => {
    if (!images.length) return;
    const preloadAt = (idx) => {
      if (!images[idx] || preloadRef.current[idx]) return;
      const img = new Image();
      img.src = images[idx];
      preloadRef.current[idx] = img;
    };
    preloadAt(0);
    const timer = setTimeout(() => images.forEach((_, i) => preloadAt(i)), 200);
    return () => clearTimeout(timer);
  }, [images]);

  // Scroll active thumb into view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const thumbEl = thumbsRef.current.children[activeIdx];
    if (thumbEl) thumbEl.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
  }, [activeIdx]);

  if (!images.length) {
    return (
      <div className={styles.placeholder}>
        <span>📷 Зураг байхгүй</span>
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className={styles.gallery}>
      {/* Main зураг */}
      <div
        className={styles.mainWrap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} - ${i + 1}`}
            className={`${styles.mainImg} ${i === activeIdx ? styles.mainImgActive : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}

        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prev}>‹</button>
        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={next}>›</button>
        <div className={styles.counter}>{activeIdx + 1} / {images.length}</div>
      </div>

      {/* Thumbnail strip — бүх thumbnail-г доор нь горизонтаалаар */}
      <div className={styles.thumbs} ref={thumbsRef}>
        {images.map((img, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${activeIdx === i ? styles.thumbActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <img
              src={thumbUrl(img)}
              alt={`thumb-${i}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}