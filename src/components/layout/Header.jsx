import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // route өөрчлөгдөхөд menu хаах
  useEffect(() => { setMenuOpen(false); }, [location]);

  // menu нээлттэй үед body scroll хаах
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { to: '/', label: 'Нүүр хуудас', end: true },
    // { to: '/orders', label: 'Захиалагчид' },
    // { to: '/guide', label: 'Захиалга өгөх заавар' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
         
<img src="/logo_last.png" alt="Garid Trade" height="60" />
            
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            {navLinks.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                {n.label}
              </NavLink>
            ))}
            {/* <button className={styles.link}>Туслах цэс <span className={styles.chevron}>▾</span></button> */}
          </nav>

       

          <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)} aria-label="">
            <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              {/* <span className={styles.drawerTitle}>Цэс</span> */}
              <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            {navLinks.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => isActive ? `${styles.drawerLink} ${styles.drawerLinkActive}` : styles.drawerLink}
                onClick={() => setMenuOpen(false)}>
                {n.label}
              </NavLink>
            ))}
            <div className={styles.drawerDivider} />
            
          </div>
        </div>
      )}
    </>
  );
}