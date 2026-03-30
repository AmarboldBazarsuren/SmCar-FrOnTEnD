import React, { useState, useEffect, useRef } from 'react';
import styles from './CarImageGallery.module.css';

// Thumbnail-д жижиг чанар, main зурагт том чанар ашиглах
const thumbUrl = (url) => url.replace('rw=1280&cw=1280', 'rw=300&cw=300');

export default function CarImageGallery({ images = [], title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loaded, setLoaded]       = useState({});       // ачаалагдсан зургийн index
  const preloadRef                = useRef([]);

  // Бүх зургийг арын горимд урьдчилан ачаалах
  useEffect(() => {
    if (!images.length) return;

    // Одоогийн зургийг тэргүүн ачаалах
    const preloadAt = (idx) => {
      if (!images[idx] || preloadRef.current[idx]) return;
      const img = new Image();
      img.src = images[idx];
      img.onload = () => setLoaded((prev) => ({ ...prev, [idx]: true }));
      preloadRef.current[idx] = img;
    };

    // 1. Эхний зургийг шууд
    preloadAt(0);

    // 2. Бусдыг 200ms-ийн дараа дараалан
    const timer = setTimeout(() => {
      images.forEach((_, i) => preloadAt(i));
    }, 200);

    return () => clearTimeout(timer);
  }, [images]);

  // Дараагийн зургийг идэвхтэй урьдчилан ачаалах
  useEffect(() => {
    const next = (activeIdx + 1) % images.length;
    const prev = (activeIdx - 1 + images.length) % images.length;
    [next, prev].forEach((idx) => {
      if (!preloadRef.current[idx]) {
        const img = new Image();
        img.src = images[idx];
        img.onload = () => setLoaded((p) => ({ ...p, [idx]: true }));
        preloadRef.current[idx] = img;
      }
    });
  }, [activeIdx, images]);

  if (!images.length) {
    return (
      <div className={styles.placeholder}>
        <span>📷 Зураг байхгүй</span>
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  // Гар утасны swipe дэмжих
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
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
        {/* Бүх зургийг DOM-д байлгаж, зөвхөн идэвхтэйг харуулах — тэгвэл switch хурдан */}
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

      {/* Thumbnail-ууд */}
      <div className={styles.thumbs}>
        {images.slice(0, 4).map((img, i) => (
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
            {i === 3 && images.length > 4 && (
              <div className={styles.moreOverlay}>+{images.length - 4}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}