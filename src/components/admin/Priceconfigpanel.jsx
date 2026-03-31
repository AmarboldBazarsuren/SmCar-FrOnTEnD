import React, { useState, useEffect } from 'react';
import { getPriceConfig, updatePriceConfig } from '../../services/api';
import styles from './PriceConfigPanel.module.css';

const Field = ({ label, hint, name, value, onChange, prefix, suffix, step = '0.01', type = 'number' }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}</label>
    {hint && <p className={styles.hint}>{hint}</p>}
    <div className={styles.inputWrap}>
      {prefix && <span className={styles.affix}>{prefix}</span>}
      <input
        type={type}
        step={step}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      />
      {suffix && <span className={styles.affix}>{suffix}</span>}
    </div>
  </div>
);

export default function PriceConfigPanel() {
  const [cfg,     setCfg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  useEffect(() => {
    getPriceConfig()
      .then((r) => setCfg(r.data))
      .catch(() => flash('❌ Тохиргоо татахад алдаа'))
      .finally(() => setLoading(false));
  }, []);

  const upd = (key, val) => setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await updatePriceConfig(cfg);
      setCfg(r.data);
      flash('✅ Тохиргоо амжилттай хадгалагдлаа');
    } catch { flash('❌ Хадгалахад алдаа гарлаа'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className={styles.loading}>Ачаалж байна...</div>;
  if (!cfg)    return null;

  const mntPreview = Math.round(5380000 * cfg.krwToMntRate);

  return (
    <div className={styles.wrap}>
      {/* Exchange rate */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>💱 Валютын ханш</h2>
          <div className={styles.preview}>
            Жишээ: ₩5,380,000 → ₮{mntPreview.toLocaleString('en-US').replace(/,/g, "'")}
          </div>
        </div>
        <Field
          label="₩1 = ₮ ? (Вон → Төгрөг ханш)"
          hint="Өдөр бүр шинэчилнэ. Тухайн өдрийн ханш:"
          name="krwToMntRate"
          value={cfg.krwToMntRate}
          onChange={upd}
          prefix="₩1 ="
          suffix="₮"
          step="0.01"
        />
      </div>

      {/* Fixed fees */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🧾 Тогтмол шимтгэлүүд</h2>
        <div className={styles.grid}>
          <Field
            label="Монгол үйлчилгээний шимтгэл"
            hint="Манай үйлчилгээний хөлс (₮)"
            name="serviceFee"
            value={cfg.serviceFee}
            onChange={upd}
            suffix="₮"
            step="1"
          />
          <Field
            label="Тээврийн зардал"
            hint="Солонгос → Монгол тээвэр (₮)"
            name="shippingCost"
            value={cfg.shippingCost}
            onChange={upd}
            suffix="₮"
            step="1"
          />
        </div>
        <div className={styles.infoBox}>
          <strong>⚠️ Анхаар:</strong> Somang Trading болон Garid Trade-н тээврийн зардал ялгаатай байж болно. Тус бүрийн бодит зардалд тохируулна уу.
        </div>
      </div>

      {/* Tax rates */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📐 Татварын хувь</h2>
        <div className={styles.grid}>
          <Field
            label="Гааль татвар (CIF-н хувь)"
            hint="CIF × хувь = гааль татвар"
            name="customsDutyRate"
            value={cfg.customsDutyRate * 100}
            onChange={(k, v) => upd('customsDutyRate', v / 100)}
            suffix="%"
            step="0.1"
          />
          <Field
            label="НӨАТ (хувь)"
            hint="(CIF + гааль + онцгой) × хувь = НӨАТ"
            name="vatRate"
            value={cfg.vatRate * 100}
            onChange={(k, v) => upd('vatRate', v / 100)}
            suffix="%"
            step="0.1"
          />
        </div>
      </div>

      {/* Payment split */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>💳 Төлбөрийн хуваарь</h2>
        <div className={styles.grid}>
          <Field
            label="Урьдчилгаа (%)"
            hint="Захиалахад төлөх хувь"
            name="advancePaymentRate"
            value={cfg.advancePaymentRate * 100}
            onChange={(k, v) => upd('advancePaymentRate', v / 100)}
            suffix="%"
            step="1"
          />
          <Field
            label="Монголд ирэхэд (%)"
            hint="Хүргэлтийн үед төлөх хувь"
            name="remainingPaymentRate"
            value={cfg.remainingPaymentRate * 100}
            onChange={(k, v) => upd('remainingPaymentRate', v / 100)}
            suffix="%"
            step="1"
          />
        </div>
        <div className={styles.infoBox} style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
          Нийт: {((cfg.advancePaymentRate + cfg.remainingPaymentRate) * 100).toFixed(0)}% — энэ нь яг 100% байх ёстой
        </div>
      </div>

      {msg && <div className={`${styles.msg} ${msg.startsWith('❌') ? styles.msgErr : styles.msgOk}`}>{msg}</div>}

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        {saving ? '💾 Хадгалж байна...' : '💾 Тохиргоо хадгалах'}
      </button>
    </div>
  );
}