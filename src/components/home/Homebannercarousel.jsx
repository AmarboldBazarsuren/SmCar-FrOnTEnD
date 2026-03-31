import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBanners } from '../../services/api';
import { formatMNT, formatKm } from '../../utils/format';
import styles from './HomeBannerCarousel.module.css';

const INTERVAL = 6000;

// Featured car slide (항상 포함)
const buildFeaturedSlide = (car) => ({
  id: 'featured',
  type: 'featured',
  title:       car.title,
  subtitle:    car.engine ? `${car.engine} · ${formatKm(car.mileage)} · ${car.year}` : '',
  imageUrl:    car.thumbnail || '',
  linkUrl:     `/listing/${car.id}`,
  buttonText:  'ДЭЛГЭРЭНГҮЙ ҮЗЭХ',
  price:       car.price ? formatMNT(car.price) : null,
});

export default function HomeBannerCarousel({ featuredCar }) {
  const [slides,  setSlides]  = useState([]);
  const [current, setCurrent] = useState(0);
  const [fading,  setFading]  = useState(false);
  const timerRef = useRef(null);

  // Build slides: admin banners + featured car
  useEffect(() => {
    getBanners()
      .then((res) => {
        const bannerSlides = (res.data || []).map((b) => ({
          id:         b._id,
          type:       'banner',
          title:      b.title,
          subtitle:   b.subtitle,
          imageUrl:   b.imageUrl,
          linkUrl:    b.linkUrl,
          buttonText: b.buttonText || 'Дэлгэрэнгүй үзэх',
        }));
        const featured = featuredCar ? [buildFeaturedSlide(featuredCar)] : [];
        setSlides([...featured, ...bannerSlides]);
      })
      .catch(() => {
        if (featuredCar) setSlides([buildFeaturedSlide(featuredCar)]);
      });
  }, [featuredCar]);

  // Update featured slide if thumbnail loads later
  useEffect(() => {
    if (!featuredCar || slides.length === 0) return;
    setSlides((prev) =>
      prev.map((s) => (s.id === 'featured' ? buildFeaturedSlide(featuredCar) : s))
    );
  }, [featuredCar?.thumbnail]);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 300);
  }, []);

  // Auto-advance
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % slides.length;
        setFading(true);
        setTimeout(() => { setCurrent(next); setFading(false); }, 300);
        return c; // Keep current until fade completes
      });
    }, INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleDot = (i) => {
    clearInterval(timerRef.current);
    goTo(i);
    startTimer();
  };

  const handlePrev = () => handleDot((current - 1 + slides.length) % slides.length);
  const handleNext = () => handleDot((current + 1) % slides.length);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className={styles.heroWrap}>
      <div className={styles.hero}>
        {/* Left: Image */}
        <div className={styles.imageWrap}>
          {slide.imageUrl ? (
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt={slide.title}
              className={`${styles.image} ${fading ? styles.imageFade : ''}`}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
          {/* Overlay gradient */}
          <div className={styles.imageOverlay} />
        </div>

        {/* Right: Info panel */}
        <div className={`${styles.info} ${fading ? styles.infoFade : ''}`}>
          <div className={styles.badge}>
            {slide.type === 'featured' ? 'ОНЦЛОХ МАШИН' : 'ЗАР СУРТАЛЧИЛГАА'}
          </div>

          <h2 className={styles.title}>{slide.title}</h2>
          {slide.subtitle && <p className={styles.subtitle}>{slide.subtitle}</p>}

          {slide.type === 'featured' && slide.price && (
            <div className={styles.price}>{slide.price}</div>
          )}

          {slide.linkUrl && (
            <Link to={slide.linkUrl} className={styles.detailBtn}>
              {slide.buttonText}
            </Link>
          )}

          {/* Navigation */}
          {slides.length > 1 && (
            <div className={styles.nav}>
              <button className={styles.arrowBtn} onClick={handlePrev}>‹</button>
              <div className={styles.dots}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                    onClick={() => handleDot(i)}
                  />
                ))}
              </div>
              <button className={styles.arrowBtn} onClick={handleNext}>›</button>
              <span className={styles.counter}>{current + 1} / {slides.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}