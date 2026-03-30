import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS } from '../../utils/constants';
import styles from './HomeBrandTable.module.css';

export default function HomeBrandTable() {
  const [expanded, setExpanded]       = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  const visibleBrands = expanded ? BRANDS : BRANDS.slice(0, 12);

  const handleBrandClick = (brand) => {
    // Загвар байгаа брэнд дээр дарахад accordion нээнэ
    if (brand.models && brand.models.length > 0) {
      setActiveBrand(activeBrand === brand.name ? null : brand.name);
    } else {
      navigate(`/cars/${encodeURIComponent(brand.name)}`);
    }
  };

  const handleModelClick = (e, brandName, model) => {
    e.stopPropagation();
    navigate(`/cars/${encodeURIComponent(brandName)}/${encodeURIComponent(model)}`);
  };

  // Активэ брэндийн загваруудыг 4 баганаар харуулах
  const renderModels = (brand) => {
    const cols = 4;
    const rows = Math.ceil(brand.models.length / cols);
    // models-г 4 баганат хэлбэрт хувааx
    const columns = Array.from({ length: cols }, (_, ci) =>
      brand.models.filter((_, mi) => mi % cols === ci)
    );

    return (
      <div className={styles.modelPanel}>
        <div className={styles.modelGrid}>
          {columns.map((col, ci) => (
            <div key={ci} className={styles.modelCol}>
              {col.map((model) => (
                <button
                  key={model}
                  className={styles.modelItem}
                  onClick={(e) => handleModelClick(e, brand.name, model)}
                >
                  <span className={styles.modelName}>{model}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Солонгос улсаас автомашин захиалга</h2>

      <div className={styles.table}>
        {/* Брэндүүд + accordion */}
        <div className={styles.grid}>
          {visibleBrands.map((brand) => (
            <React.Fragment key={brand.name}>
              <button
                className={`${styles.brandItem} ${activeBrand === brand.name ? styles.brandActive : ''}`}
                onClick={() => handleBrandClick(brand)}
              >
                <span className={styles.brandName}>{brand.name}</span>
                <span className={styles.brandCount}>{brand.count.toLocaleString()}</span>
              </button>

              {/* Accordion: брэндийн дараа шууд нээгдэнэ — 4 нүдний дараа */}
              {activeBrand === brand.name && (
                <div className={styles.accordionRow}>
                  {renderModels(brand)}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={styles.expandBtn}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Нуух' : 'Бүгдийг харах'}
          <span className={styles.chevron}>{expanded ? '∧' : '∨'}</span>
        </button>
      </div>
    </div>
  );
}