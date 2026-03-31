// src/pages/admin/AdminDashboard.jsx  ← одоогийн файлыг ЭНЭ-ээр солино
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminMe, adminLogout } from '../../services/api';
import BannerManager     from '../../components/admin/BannerManager';
import PriceConfigPanel  from '../../components/admin/PriceConfigPanel';
import TaxConfigPanel    from '../../components/admin/TaxConfigPanel';
import CarListingManager from '../../components/admin/CarListingManager';   // ← ШИНЭ
import styles from './AdminDashboard.module.css';

const TABS = [
  { id: 'banners',   icon: '🖼',  label: 'Баннер удирдлага' },
  { id: 'listings',  icon: '🚗',  label: 'Машины зар' },          // ← ШИНЭ
  { id: 'price',     icon: '💱',  label: 'Ханш & Шимтгэл' },
  { id: 'tax',       icon: '📊',  label: 'Татварын тохиргоо' },
];

export default function AdminDashboard() {
  const [tab,      setTab]      = useState('banners');
  const [username, setUsername] = useState('admin');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return; }
    adminMe().then((r) => setUsername(r.username)).catch(() => {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    });
  }, [navigate]);

  const handleLogout = async () => {
    await adminLogout().catch(() => {});
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.brand}>
            <img src="/logo_last.png" alt="logo" className={styles.brandImg} />
            <span className={styles.brandBadge}>ADMIN</span>
          </div>
          <nav className={styles.nav}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`${styles.navBtn} ${tab === t.id ? styles.navActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span className={styles.navIcon}>{t.icon}</span>
                <span className={styles.navLabel}>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className={styles.sideBottom}>
          <a href="/" target="_blank" className={styles.viewSite}>↗ Сайт үзэх</a>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{username[0]?.toUpperCase()}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              <span className={styles.userRole}>Администратор</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Гарах">⏻</button>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>{TABS.find((t) => t.id === tab)?.label}</h1>
        </div>
        <div className={styles.content}>
          {tab === 'banners'  && <BannerManager />}
          {tab === 'listings' && <CarListingManager />}   {/* ← ШИНЭ */}
          {tab === 'price'    && <PriceConfigPanel />}
          {tab === 'tax'      && <TaxConfigPanel />}
        </div>
      </main>
    </div>
  );
}