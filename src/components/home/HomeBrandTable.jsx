import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS } from '../../utils/constants';
import styles from './HomeBrandTable.module.css';

const COLS = 4;
const DEFAULT_ROWS = 3; // 3 мөр = 12 брэнд харуулна

export default function HomeBrandTable() {
  const [expanded, setExpanded]       = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  const visibleBrands = expanded ? BRANDS : BRANDS.slice(0, DEFAULT_ROWS * COLS);

  // Брэндүүдийг COLS-аар мөрт хувааx
  const rows = [];
  for (let i = 0; i < visibleBrands.length; i += COLS) {
    rows.push(visibleBrands.slice(i, i + COLS));
  }

  const handleBrandClick = (brand) => {
    if (brand.models && brand.models.length > 0) {
      setActiveBrand(activeBrand === brand.name ? null : brand.name);
    } else {
      navigate(`/cars/${encodeURIComponent(brand.name)}`);
    }
  };

  const handleToggleExpand = () => {
    setExpanded((prev) => {
      const next = !prev;
      // Нуух үед accordion хааx
      if (!next) setActiveBrand(null);
      return next;
    });
  };

  const handleModelClick = (e, brandName, model) => {
    e.stopPropagation();
    navigate(`/cars/${encodeURIComponent(brandName)}/${encodeURIComponent(model)}`);
  };

  const renderModels = (brand) => {
    const columns = Array.from({ length: COLS }, (_, ci) =>
      brand.models.filter((_, mi) => mi % COLS === ci)
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
      <h2 className={styles.title}>Хүссэн машинаа Солонгосоос захиалцгаая</h2>

      <div className={styles.table}>
        {rows.map((row, rowIdx) => {
          const activeInRow = row.find((b) => b.name === activeBrand);

          return (
            <React.Fragment key={rowIdx}>
              <div className={styles.grid}>
                {row.map((brand) => (
                  <button
                    key={brand.name}
                    className={`${styles.brandItem} ${activeBrand === brand.name ? styles.brandActive : ''}`}
                    onClick={() => handleBrandClick(brand)}
                  >
                    <span className={styles.brandName}>{brand.name}</span>
                    <span className={styles.brandCount}>{brand.count.toLocaleString()}</span>
                  </button>
                ))}
                {Array.from({ length: COLS - row.length }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.emptyCell} />
                ))}
              </div>

              {activeInRow && (
                <div className={styles.accordionRow}>
                  {renderModels(activeInRow)}
                </div>
              )}
            </React.Fragment>
          );
        })}

        <button className={styles.expandBtn} onClick={handleToggleExpand}>
          {expanded ? 'Нуух' : 'Бүгдийг харах'}
          <span className={styles.chevron}>{expanded ? '∧' : '∨'}</span>
        </button>
      </div>
    </div>
  );
}