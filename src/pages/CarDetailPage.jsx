import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useCarDetail from '../hooks/useCarDetail';
import CarImageGallery from '../components/cars/CarImageGallery';
import CarPriceBox from '../components/cars/CarPriceBox';
import CarSpecTable from '../components/cars/CarSpecTable';
import CarBreadcrumb from '../components/cars/CarBreadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import styles from './CarDetailPage.module.css';

export default function CarDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useCarDetail(id);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (loading) return <LoadingSpinner size="lg" text="Машины мэдээлэл татаж байна..." />;
  if (error)   return <ErrorMessage message={error} />;
  if (!data)   return null;

  const { carInfo, priceBreakdown } = data;

  const title = carInfo?.title || `Машин #${id}`;
  const images = carInfo?.images || (carInfo?.thumbnail ? [carInfo.thumbnail] : []);

  const breadcrumbs = [
    { label: 'Нүүр хуудас', href: '/' },
    carInfo?.brand && { label: carInfo.brand, href: `/cars/${encodeURIComponent(carInfo.brand)}` },
    carInfo?.model && { label: carInfo.model, href: `/cars/${encodeURIComponent(carInfo.brand)}/${encodeURIComponent(carInfo.model)}` },
    { label: title },
  ].filter(Boolean);

  const handleOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Top bar: breadcrumb + encar link */}
        <div className={styles.topBar}>
          <CarBreadcrumb items={breadcrumbs} />
          <a
            href={`https://encar.mn/listing/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.encarLink}
          >
            🔗 <span>Encar</span> дээрх зарыг харах
          </a>
        </div>

        {/* Main layout */}
        <div className={styles.layout}>
          {/* Left: gallery + info */}
          <div className={styles.left}>
            <CarImageGallery images={images} title={title} />

            <div className={styles.carInfo}>
              <h1 className={styles.title}>{title}</h1>
              <CarSpecTable carInfo={carInfo} />

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Дэлгэрэнгүй оношилгооны мэдээлэл</h2>
                <div className={styles.diagGrid}>
                  <div className={styles.diagItem}>
                    <span className={styles.diagLabel}>Хөдөлгүүр</span>
                    <span className={`${styles.diagStatus} ${styles.ok}`}>Норм</span>
                  </div>
                  <div className={styles.diagItem}>
                    <span className={styles.diagLabel}>Хурдны хайрцаг</span>
                    <span className={`${styles.diagStatus} ${styles.ok}`}>Норм</span>
                  </div>
                  <div className={styles.diagItem}>
                    <span className={styles.diagLabel}>Тоормос</span>
                    <span className={`${styles.diagStatus} ${styles.ok}`}>Норм</span>
                  </div>
                  <div className={styles.diagItem}>
                    <span className={styles.diagLabel}>Цахилгаан</span>
                    <span className={`${styles.diagStatus} ${styles.ok}`}>Норм</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: price box */}
          <div className={styles.right}>
            <CarPriceBox priceBreakdown={priceBreakdown} onOrder={handleOrder} />
            {orderSuccess && (
              <div className={styles.successMsg}>
                ✅ Захиалга амжилттай илгээгдлээ!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
