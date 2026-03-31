import React from 'react';
import { formatMNT, formatKRW } from '../../utils/format';
import styles from './CarPriceBox.module.css';

export default function CarPriceBox({ priceBreakdown, onOrder }) {
  if (!priceBreakdown) return null;

  const {
    krwBasePrice,
    mntBasePrice,
    serviceFee,
    shippingCost,
    exciseTax,
    customsDuty,
    vat,
    customsAndVat,
    totalPrice,
    advancePayment,
    remainingPayment,
    exchangeRate,
  } = priceBreakdown;

  return (
    <div className={styles.box}>
      <div className={styles.rows}>
        <div className={styles.row}>
          {/* <span className={styles.label}>VIN:</span>
          <span className={styles.value}>N/A</span> */}
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Үндсэн үнэ:</span>
          <span className={styles.valueKrw}>{formatKRW(krwBasePrice)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>
            Үндсэн үнэ (MNT):
            <span className={styles.hint} title={`₩1 = ₮${exchangeRate}`}>ⓘ</span>
          </span>
          <span className={styles.value}>{formatMNT(mntBasePrice)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>
            Монгол үйлчилгээний шимтгэл:
            <span className={styles.hint}>ⓘ</span>
          </span>
          <span className={styles.value}>{formatMNT(serviceFee)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>
            Тээврийн зардал:
            <span className={styles.hint}>ⓘ</span>
          </span>
          <span className={styles.value}>{formatMNT(shippingCost)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>
            Онцгой албан татвар:
            <span className={styles.hint}>ⓘ</span>
          </span>
          <span className={styles.value}>{formatMNT(exciseTax)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>
            Гааль татвар/НӨАТ:
            <span className={styles.hint}>ⓘ</span>
          </span>
          <span className={styles.value}>{formatMNT(customsAndVat)}</span>
        </div>
      </div>

      <div className={styles.total}>
        <span className={styles.totalLabel}>Нийт дүн:</span>
        <span className={styles.totalValue}>{formatMNT(totalPrice)}</span>
      </div>

      <div className={styles.paymentRows}>
        <div className={styles.payRow}>
          <span>Урьдчилгаан төлөх төлбөр:</span>
          <span className={styles.payAmt}>{formatMNT(advancePayment)}</span>
        </div>
        <div className={styles.payRow}>
          <span>Монголд ирсэн үед төлөх нийт төлбөр:</span>
          <span className={styles.payAmt}>{formatMNT(remainingPayment)}</span>
        </div>
      </div>

      <button className={styles.orderBtn} onClick={onOrder}>
        Захиалах
      </button>
    </div>
  );
}
