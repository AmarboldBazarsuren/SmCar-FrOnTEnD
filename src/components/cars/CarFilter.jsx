import React, { useState } from 'react';
import { BRANDS, FUEL_TYPES, TRANSMISSIONS } from '../../utils/constants';
import styles from './CarFilter.module.css';

export default function CarFilter({ filters, onChange, activeBrand }) {
  const selectedBrand = BRANDS.find((b) => b.name === (filters.brand || activeBrand));

  const handleBrandClick = (brandName) => {
    if (filters.brand === brandName) {
      onChange({ brand: '', model: '' });
    } else {
      onChange({ brand: brandName, model: '' });
    }
  };

  const handleModelClick = (model) => {
    onChange({ model: filters.model === model ? '' : model });
  };

  // Fuel filter — apicars.info-д англи утга явуулна
  // Translate: Монгол → API value
  const FUEL_API = {
    'Бензин':     'gasoline',
    'Дизель':     'diesel',
    'Цахилгаан':  'electric',
    'Гибрид':     'hybrid',
  };
  const TRANS_API = {
    'Автомат': 'automatic',
    'Механик': 'manual',
  };

  const handleFuel = (label) => {
    const apiVal = FUEL_API[label] || label;
    onChange({ fuelType: filters.fuelType === apiVal ? '' : apiVal });
  };

  const handleTrans = (label) => {
    const apiVal = TRANS_API[label] || label;
    onChange({ transmission: filters.transmission === apiVal ? '' : apiVal });
  };

  // Active check helpers
  const isFuelActive = (label) => {
    const apiVal = FUEL_API[label] || label;
    return filters.fuelType === apiVal || filters.fuelType === label;
  };

  const isTransActive = (label) => {
    const apiVal = TRANS_API[label] || label;
    return filters.transmission === apiVal || filters.transmission === label;
  };

  return (
    <aside className={styles.sidebar}>
      {/* Year */}
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

      {/* Brand */}
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

      {/* Model — brand сонгосон үед харагдана */}
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

      {/* Fuel */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span>ТҮЛШ</span>
          <button className={styles.collapseBtn}>∧</button>
        </div>
        <div className={styles.chipRow}>
          {['Бензин', 'Дизель', 'Цахилгаан', 'Гибрид'].map((f) => (
            <button
              key={f}
              className={`${styles.chip} ${isFuelActive(f) ? styles.chipActive : ''}`}
              onClick={() => handleFuel(f)}
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
          {['Автомат', 'Механик'].map((t) => (
            <button
              key={t}
              className={`${styles.chip} ${isTransActive(t) ? styles.chipActive : ''}`}
              onClick={() => handleTrans(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {(filters.fuelType || filters.transmission || filters.yearFrom || filters.yearTo) && (
        <div className={styles.group}>
          <button
            className={styles.clearAllBtn}
            onClick={() => onChange({ fuelType: '', transmission: '', yearFrom: '', yearTo: '', model: '', brand: '' })}
          >
            ✕ Бүх шүүлтүүр цэвэрлэх
          </button>
        </div>
      )}
    </aside>
  );
}