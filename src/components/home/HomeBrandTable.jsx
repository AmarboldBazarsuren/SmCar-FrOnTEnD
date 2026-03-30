import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS } from '../../utils/constants';
import styles from './HomeBrandTable.module.css';

const TOP_BRANDS = BRANDS.slice(0, 4); // Kia, Hyundai, Mercedes-Benz, BMW

export default function HomeBrandTable() {
  const [expandedBrand, setExpandedBrand] = useState(null);
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    setExpandedBrand(expandedBrand === brandName ? null : brandName);
  };

  const handleModelClick = (brand, model) => {
    navigate(`/cars/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`);
  };

  const otherBrands = BRANDS.slice(4);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Солонгос улсаас автомашин захиалга</h2>

      {/* Top 4 brands with sub-models */}
      <div className={styles.topGrid}>
        {TOP_BRANDS.map((brand) => (
          <div key={brand.name} className={styles.brandBlock}>
            <button
              className={styles.brandHeader}
              onClick={() => navigate(`/cars/${encodeURIComponent(brand.name)}`)}
            >
              <span className={styles.brandName}>{brand.name}</span>
              <span className={styles.brandCount}>{brand.count.toLocaleString()}</span>
            </button>
            <div className={styles.modelList}>
              {brand.models.slice(0, 5).map((model) => (
                <button
                  key={model}
                  className={styles.modelItem}
                  onClick={() => handleModelClick(brand.name, model)}
                >
                  <span className={styles.modelName}>{model}</span>
                  <span className={styles.modelCount}>
                    {/* placeholder counts */}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Other brands row */}
      <div className={styles.otherRow}>
        {otherBrands.map((brand) => (
          <button
            key={brand.name}
            className={styles.otherBrand}
            onClick={() => navigate(`/cars/${encodeURIComponent(brand.name)}`)}
          >
            <span className={styles.otherName}>{brand.name}</span>
            <span className={styles.otherCount}>{brand.count.toLocaleString()}</span>
          </button>
        ))}
      </div>

      {/* Expand button */}
      <div className={styles.expandRow}>
        <button className={styles.expandBtn}>
          Бүгдийг харах <span>▾</span>
        </button>
      </div>
    </div>
  );
}
