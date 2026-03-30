import React, { useState } from 'react';
import { BRANDS, FUEL_TYPES, TRANSMISSIONS } from '../../utils/constants';
import styles from './CarFilter.module.css';

export default function CarFilter({ filters, onChange, activeBrand }) {
  const [expandedBrand, setExpandedBrand] = useState(activeBrand || null);

  const selectedBrand = BRANDS.find((b) => b.name === (filters.brand || activeBrand));

  const handleBrandClick = (brandName) => {
    if (expandedBrand === brandName) {
      setExpandedBrand(null);
      onChange({ brand: '', model: '' });
    } else {
      setExpandedBrand(brandName);
      onChange({ brand: brandName, model: '' });
    }
  };

  const handleModelClick = (model) => {
    onChange({ model: filters.model === model ? '' : model });
  };

  return (
    <aside className={styles.sidebar}>
      {/* Year filter */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span>ҮЙЛДВЭРЛЭСЭН ОН</span>
          <button className={styles.collapseBtn}>∧</button>
        </div>
        <div className={styles.rangeRow}>
          <select
            className={styles.rangeSelect}
            value={filters.yearFrom || ''}
            onChange={(e) => onChange({ yearFrom: e.target.value })}
          >
            <option value="">Доод</option>
            {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className={styles.rangeSep}>—</span>
          <select
            className={styles.rangeSelect}
            value={filters.yearTo || ''}
            onChange={(e) => onChange({ yearTo: e.target.value })}
          >
            <option value="">Дээд</option>
            {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand filter */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span>ҮЙЛДВЭРЛЭГЧ{filters.brand ? `: ${filters.brand.toUpperCase()}` : ''}</span>
          <button className={styles.collapseBtn}>∧</button>
        </div>
        {filters.brand && (
          <div className={styles.activeTag}>
            {filters.brand}
            <button onClick={() => onChange({ brand: '', model: '' })} className={styles.removeTag}>✕</button>
          </div>
        )}
        <div className={styles.brandList}>
          {BRANDS.map((b) => (
            <label key={b.name} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.brand === b.name}
                onChange={() => handleBrandClick(b.name)}
                className={styles.checkbox}
              />
              <span className={styles.checkLabel}>{b.name}</span>
              <span className={styles.checkCount}>{b.count.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Model filter — shown when brand selected */}
      {selectedBrand && (
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <span>ЗАГВАР: {selectedBrand.name.toUpperCase()}</span>
            <button className={styles.collapseBtn}>∧</button>
          </div>
          {filters.model && (
            <div className={styles.activeTag}>
              {filters.model}
              <button onClick={() => onChange({ model: '' })} className={styles.removeTag}>✕</button>
            </div>
          )}
          <div className={styles.brandList}>
            {selectedBrand.models.map((m) => (
              <label key={m} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={filters.model === m}
                  onChange={() => handleModelClick(m)}
                  className={styles.checkbox}
                />
                <span className={styles.checkLabel}>{m}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Fuel type */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span>ТҮЛШ</span>
          <button className={styles.collapseBtn}>∧</button>
        </div>
        <div className={styles.chipRow}>
          {FUEL_TYPES.slice(1).map((f) => (
            <button
              key={f}
              className={`${styles.chip} ${filters.fuelType === f ? styles.chipActive : ''}`}
              onClick={() => onChange({ fuelType: filters.fuelType === f ? '' : f })}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span>ХУРДНЫ ХАЙРЦАГ</span>
          <button className={styles.collapseBtn}>∧</button>
        </div>
        <div className={styles.chipRow}>
          {TRANSMISSIONS.slice(1).map((t) => (
            <button
              key={t}
              className={`${styles.chip} ${filters.transmission === t ? styles.chipActive : ''}`}
              onClick={() => onChange({ transmission: filters.transmission === t ? '' : t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
