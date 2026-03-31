// src/components/cars/OrderModal.jsx  ← ШИНЭ файл
import React, { useEffect } from 'react';
import styles from './OrderModal.module.css';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61560313482250';
const PHONE_NUMBER      = '+97672220707';
const PHONE_DISPLAY     = '+976 7222-0707';

export default function OrderModal({ car, onClose }) {
  // Esc товч дарахад хаах
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // body scroll хаах
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Messenger-т явуулах мессежийн текст
  const carUrl = window.location.href;
  const messengerMessage = encodeURIComponent(
    `Сайн байна уу! Дараах машинд сонирхож байна:\n${car?.title || 'Машин'}\n${carUrl}`
  );

  // Facebook Messenger send link
  const messengerUrl = `https://m.me/${FACEBOOK_PAGE_URL.split('id=')[1]}?text=${messengerMessage}`;

  // WhatsApp fallback (утасны дугаараар)
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER.replace(/\D/g, '')}?text=${messengerMessage}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Хаах товч */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Гарчиг */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>🚗</div>
          <div>
            <h2 className={styles.title}>Захиалга өгөх</h2>
            {car?.title && <p className={styles.carName}>{car.title}</p>}
          </div>
        </div>

        {/* Тайлбар */}
        <p className={styles.desc}>
          Та сонирхсон машины холбоосыг манай <strong>Facebook хуудас</strong> руу явуулна уу.
          Бид тантай холбогдож дэлгэрэнгүй мэдээлэл өгнө.
        </p>

        {/* Холбоо барих сонголтууд */}
        <div className={styles.options}>

          {/* Messenger */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.optionBtn} ${styles.messengerBtn}`}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.82 1.324 5.34 3.408 7.036V22l3.158-1.737A10.88 10.88 0 0012 20.518c5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2zm1.053 12.484l-2.526-2.695-4.979 2.695 5.473-5.81 2.584 2.695 4.921-2.695-5.473 5.81z"/>
            </svg>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Facebook Messenger</span>
              <span className={styles.optionSub}>Машины холбоосыг явуулах</span>
            </div>
          </a>

          {/* Facebook хуудас */}
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.optionBtn} ${styles.facebookBtn}`}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Facebook хуудас</span>
              <span className={styles.optionSub}>Somang Trading Mongolia</span>
            </div>
          </a>

          {/* Хуваагч */}
          <div className={styles.divider}>
            <span>эсвэл утсаар холбогдох</span>
          </div>

          {/* Утасны дугаар */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className={`${styles.optionBtn} ${styles.phoneBtn}`}
          >
            <span className={styles.phoneIcon}>📞</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>{PHONE_DISPLAY}</span>
              <span className={styles.optionSub}>Даваа–Бямба, 09:00–18:00</span>
            </div>
          </a>
        </div>

        {/* Мессежийн санамж */}
        <div className={styles.hint}>
          <span>💡</span>
          <span>Мессеж явуулахдаа энэ машины холбоосыг оруулна уу:</span>
        </div>
        <div className={styles.urlBox}>
          <span className={styles.urlText}>{window.location.href}</span>
          <button
            className={styles.copyBtn}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Хуулах
          </button>
        </div>
      </div>
    </div>
  );
}