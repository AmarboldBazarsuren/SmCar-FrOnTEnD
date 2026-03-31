import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Лого + тайлбар */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <img src="/logo_last.png" alt="Garid Trade" className={styles.logoImg} />
            </Link>
            <p className={styles.brandDesc}>
              Солонгос улсаас найдвартай, хямд үнээр автомашин захиалах үйлчилгээ. Бид таны итгэлт түнш.
            </p>
            <div className={styles.phones}>
              
              <span>📞 +976 7222-0707</span>
            </div>
          </div>

          {/* Холбоосууд */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Үйлчилгээ</h4>
              <Link to="/cars" className={styles.link}>Машин захиалах</Link>
              <Link to="/guide" className={styles.link}>Захиалга өгөх заавар</Link>
              <Link to="/orders" className={styles.link}>Захиалагчид</Link>
              <Link to="/travel-cars" className={styles.link}>Аялалын машин</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Брэндүүд</h4>
              <Link to="/cars/Kia" className={styles.link}>Kia</Link>
              <Link to="/cars/Hyundai" className={styles.link}>Hyundai</Link>
              <Link to="/cars/Mercedes-Benz" className={styles.link}>Mercedes-Benz</Link>
              <Link to="/cars/BMW" className={styles.link}>BMW</Link>
              <Link to="/cars/Genesis" className={styles.link}>Genesis</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Холбоо барих</h4>
              <span className={styles.info}>Улаанбаатар, Монгол</span>
            
              <a href="" className={styles.link}>+976 7222-0707</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Somang Trading. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span className={styles.powered}>Солонгос улсаас автомашин захиалга</span>
        </div>
      </div>
    </footer>
  );
}