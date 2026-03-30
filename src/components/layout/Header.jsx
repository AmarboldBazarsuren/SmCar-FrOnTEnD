import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#111827"/>
            <text x="5" y="21" fontSize="16" fontWeight="800" fill="white" fontFamily="Manrope">G</text>
          </svg>
          <span className={styles.logoText}>GARID TRADE</span>
        </Link>

        {/* Nav */}
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Нүүр хуудас
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Захиалагчид
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Захиалга өгөх заавар
          </NavLink>
          <div className={styles.dropdownWrap}>
            <button className={styles.link}>
              Туслах цэс <span className={styles.chevron}>▾</span>
            </button>
          </div>
        </nav>

        {/* CTA */}
        <Link to="/travel-cars" className={styles.ctaBtn}>
          <span className={styles.ctaIcon}>🌿</span>
          Аялалын машин
        </Link>
      </div>
    </header>
  );
}
