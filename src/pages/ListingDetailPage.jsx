// src/pages/ListingDetailPage.jsx  ← ШИНЭ файл
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../services/api';
import CarImageGallery from '../components/cars/CarImageGallery';
import OrderModal from '../components/cars/OrderModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatMNT, formatKRW, formatKm } from '../utils/format';
import styles from './ListingDetailPage.module.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing,    setListing]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [showModal,  setShowModal]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListingById(id)
      .then((r) => setListing(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" text="Мэдээлэл татаж байна..." />;
  if (error)   return <ErrorMessage message={error} />;
  if (!listing) return null;

  const images    = listing.images || [];
  const mntPrice  = listing.krwPrice ? Math.round(listing.krwPrice * 2.4) : null;

  const specs = [
    { label: 'Он',              value: listing.year },
    { label: 'Гүйлт',          value: listing.mileage != null ? formatKm(listing.mileage) : null },
    { label: 'Хөдөлгүүр',      value: listing.cc ? `${listing.cc}сс` : null },
    { label: 'Хурдны хайрцаг', value: listing.transmission },
    { label: 'Түлш',            value: listing.fuelType },
    { label: 'Өнгө',            value: listing.color },
  ].filter((s) => s.value);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button className={styles.back} onClick={() => navigate(-1)}>← Буцах</button>
          <span className={styles.bsep}>/</span>
          <span className={styles.bcur}>{listing.brand}</span>
          {listing.model && (
            <><span className={styles.bsep}>/</span>
            <span className={styles.bcur}>{listing.model}</span></>
          )}
        </nav>

        <div className={styles.layout}>
          {/* ── Зүүн: Gallery + Мэдээлэл ── */}
          <div className={styles.left}>
            {/* Gallery */}
            <CarImageGallery images={images} title={listing.title} />

            {/* Машины мэдээлэл */}
            <div className={styles.infoCard}>
              <h1 className={styles.title}>{listing.title}</h1>

              {/* Specs inline */}
              {specs.length > 0 && (
                <div className={styles.inlineSpecs}>
                  {specs.slice(0, 4).map((s, i) => (
                    <span key={s.label} className={styles.specItem}>
                      {i > 0 && <span className={styles.specSep}>|</span>}
                      <span className={styles.specLabel}>{s.label}:</span>
                      <span className={styles.specValue}>{s.value}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Spec table */}
              {specs.length > 0 && (
                <div className={styles.specTable}>
                  {specs.map((s) => (
                    <div key={s.label} className={styles.specRow}>
                      <span className={styles.specTLabel}>{s.label}</span>
                      <span className={styles.specTValue}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Тайлбар */}
              {listing.description && (
                <div className={styles.descSection}>
                  <h2 className={styles.sectionTitle}>Тайлбар</h2>
                  <p className={styles.desc}>{listing.description}</p>
                </div>
              )}

              {/* Encar link */}
              {listing.linkUrl && (
                <a href={listing.linkUrl} target="_blank" rel="noopener noreferrer"
                  className={styles.encarLink}>
                  🔗 Дэлгэрэнгүй мэдээлэл харах
                </a>
              )}
            </div>
          </div>

          {/* ── Баруун: Үнийн хайрцаг ── */}
          <div className={styles.right}>
            <div className={styles.priceBox}>
              <div className={styles.priceRows}>
                {listing.krwPrice && (
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Үндсэн үнэ:</span>
                    <span className={styles.priceKrw}>{formatKRW(listing.krwPrice)}</span>
                  </div>
                )}
                {listing.krwPrice && (
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Үндсэн үнэ (₮):</span>
                    <span className={styles.priceMnt}>{formatMNT(listing.krwPrice * 2.4)}</span>
                  </div>
                )}
              </div>

              {mntPrice && (
                <div className={styles.totalBox}>
                  <span className={styles.totalLabel}>Ойролцоо нийт үнэ:</span>
                  <span className={styles.totalValue}>{formatMNT(mntPrice)}</span>
                </div>
              )}

              <div className={styles.notice}>
                {/* <span>ℹ️</span> */}
                {/* <span>Нийт үнэд гааль, татвар, тээвэр зэрэг зардлууд нэмэгдэнэ. Дэлгэрэнгүй мэдээллийг биднээс асууна уу.</span> */}
              </div>

              <button className={styles.orderBtn} onClick={() => setShowModal(true)}>
                Захиалах
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <OrderModal car={{ title: listing.title, id }} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}