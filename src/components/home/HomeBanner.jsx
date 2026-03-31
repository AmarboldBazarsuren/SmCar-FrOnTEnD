import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS } from '../../utils/constants';
import styles from './HomeBanner.module.css';

export default function HomeBanner() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const navigate = useNavigate();

  const selectedBrand = BRANDS.find((b) => b.name === brand);
  const models = selectedBrand?.models || [];

  const handleSearch = () => {
    if (brand && model) navigate(`/cars/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`);
    else if (brand) navigate(`/cars/${encodeURIComponent(brand)}`);
    else navigate('/cars');
  };

  return (
    <div className={styles.banner}>
      <div className={styles.overlay}>
        <p className={styles.tagline}>Машины төрөл болон загвараа сонгоно уу.</p>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setModel(''); }}
          >
            <option value="">Брэнд</option>
            {BRANDS.map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
          >
            <option value="">Загвар</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
        <button className={styles.searchBtn} onClick={handleSearch}>
          Хайх
        </button>
      </div>
    </div>
  );
}
