import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CarBreadcrumb.module.css';

export default function CarBreadcrumb({ items = [] }) {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Буцах
      </button>
      <div className={styles.crumbs}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className={styles.sep}>/</span>}
            {item.href ? (
              <Link to={item.href} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
