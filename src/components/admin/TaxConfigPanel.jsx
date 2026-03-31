import React, { useState, useEffect } from 'react';
import { getTaxConfig, updateTaxConfig } from '../../services/api';

export default function TaxConfigPanel() {
  const [cfg,     setCfg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  useEffect(() => {
    getTaxConfig()
      .then((r) => setCfg(r.data))
      .catch(() => flash('❌ Тохиргоо татахад алдаа'))
      .finally(() => setLoading(false));
  }, []);

  const upd = (key, val) => setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await updateTaxConfig(cfg);
      setCfg(r.data);
      flash('✅ Тохиргоо амжилттай хадгалагдлаа');
    } catch { flash('❌ Хадгалахад алдаа гарлаа'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Ачаалж байна...</div>;
  if (!cfg)    return null;

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 5 };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#0f172a' };
  const hintStyle  = { fontSize: 12, color: '#64748b' };
  const inputWrapStyle = {
    display: 'flex', alignItems: 'center',
    border: '1px solid #cbd5e1', borderRadius: 8,
    background: '#f8fafc', overflow: 'hidden',
  };
  const affixStyle = {
    padding: '0 12px', fontSize: 13, color: '#475569',
    background: '#f1f5f9', borderRight: '1px solid #e2e8f0',
    height: 40, display: 'flex', alignItems: 'center',
  };
  const inputStyle = {
    flex: 1, border: 'none', background: 'transparent',
    padding: '10px 12px', fontSize: 15, fontWeight: 600,
    color: '#0f172a', outline: 'none', fontFamily: 'inherit',
  };

  const Field = ({ label, hint, name, value, suffix, step = '0.01', onChange }) => (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={hintStyle}>{hint}</p>}
      <div style={inputWrapStyle}>
        <input
          type="number"
          step={step}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
        />
        {suffix && <span style={{ ...affixStyle, borderRight: 'none', borderLeft: '1px solid #e2e8f0' }}>{suffix}</span>}
      </div>
    </div>
  );

  const card = {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 12, padding: '24px 28px', marginBottom: 20,
  };
  const cardTitle = {
    fontSize: 16, fontWeight: 700, color: '#0f172a',
    marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f1f5f9',
  };
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={card}>
        <h2 style={cardTitle}>📊 Онцгой албан татвар</h2>
        <div style={grid}>
          <Field
            label="0–2000cc татварын хувь"
            hint="Жижиг хөдөлгүүртэй машинд хамаарна"
            name="exciseTaxRate1"
            value={(cfg.exciseTaxRate1 ?? 0.05) * 100}
            onChange={(k, v) => upd('exciseTaxRate1', v / 100)}
            suffix="%"
            step="0.1"
          />
          <Field
            label="2001–3000cc татварын хувь"
            hint="Дунд хэмжээний хөдөлгүүрт"
            name="exciseTaxRate2"
            value={(cfg.exciseTaxRate2 ?? 0.10) * 100}
            onChange={(k, v) => upd('exciseTaxRate2', v / 100)}
            suffix="%"
            step="0.1"
          />
          <Field
            label="3001cc+ татварын хувь"
            hint="Том хөдөлгүүртэй машинд"
            name="exciseTaxRate3"
            value={(cfg.exciseTaxRate3 ?? 0.15) * 100}
            onChange={(k, v) => upd('exciseTaxRate3', v / 100)}
            suffix="%"
            step="0.1"
          />
          <Field
            label="Цахилгаан машины татвар"
            hint="EV, PHEV машинд хамаарна"
            name="exciseTaxRateEV"
            value={(cfg.exciseTaxRateEV ?? 0) * 100}
            onChange={(k, v) => upd('exciseTaxRateEV', v / 100)}
            suffix="%"
            step="0.1"
          />
        </div>
      </div>

      <div style={card}>
        <h2 style={cardTitle}>📋 Нэмэлт тохиргоо</h2>
        <div style={grid}>
          <Field
            label="Гааль боловсруулах хураамж"
            hint="Гаалийн бүрдүүлэлтийн суурь хураамж (₮)"
            name="customsProcessingFee"
            value={cfg.customsProcessingFee ?? 0}
            onChange={upd}
            suffix="₮"
            step="1000"
          />
          <Field
            label="Хилийн боомтын хураамж"
            hint="Боомтын үйлчилгээний хураамж (₮)"
            name="portFee"
            value={cfg.portFee ?? 0}
            onChange={upd}
            suffix="₮"
            step="1000"
          />
        </div>
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, marginBottom: 16,
          background: msg.startsWith('❌') ? '#fef2f2' : '#f0fdf4',
          color:      msg.startsWith('❌') ? '#991b1b' : '#166534',
          border:     `1px solid ${msg.startsWith('❌') ? '#fca5a5' : '#86efac'}`,
        }}>
          {msg}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saving ? '#a78bfa' : '#6c2bd9', color: '#fff',
          border: 'none', borderRadius: 10, padding: '14px 32px',
          fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start', fontFamily: 'inherit',
        }}
      >
        {saving ? '💾 Хадгалж байна...' : '💾 Тохиргоо хадгалах'}
      </button>
    </div>
  );
}