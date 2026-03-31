// src/components/admin/CarListingManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  getAdminListings, createAdminListing, updateAdminListing, deleteAdminListing,
} from '../../services/api';
import { formatKRW, formatKm } from '../../utils/format';
import styles from './CarListingManager.module.css';

const EMPTY = {
  title: '', brand: '', model: '', year: '', mileage: '', fuelType: '',
  transmission: '', cc: '', color: '', krwPrice: '', description: '',
  images: [],       // ← олон зурагны URL массив
  linkUrl: '', isActive: true, order: 0,
};

const FUEL_OPTIONS  = ['Бензин', 'Дизель', 'Hybrid', 'Цахилгаан', 'Бензин+Цахилгаан'];
const TRANS_OPTIONS = ['Автомат', 'Механик', 'CVT'];

export default function CarListingManager() {
  const [listings,   setListings]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [saving,     setSaving]    = useState(false);
  const [form,       setForm]      = useState(EMPTY);
  const [editing,    setEditing]   = useState(null);
  const [msg,        setMsg]       = useState('');
  const [uploading,  setUploading] = useState(false);
  const [urlInput,   setUrlInput]  = useState('');   // URL-ээр нэмэх
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try { const r = await getAdminListings(); setListings(r.data || []); }
    catch { flash('❌ Зар татахад алдаа'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  // ── Файлаар upload (олон зураг) ─────────────────────────────────────────
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // 5MB шалгах
    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) { flash('❌ Зургийн хэмжээ 5MB-аас хэтрэхгүй байх ёстой'); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));

      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/upload/images', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setForm((p) => ({ ...p, images: [...p.images, ...data.imageUrls] }));
        flash(`✅ ${data.imageUrls.length} зураг upload хийгдлээ`);
      } else { flash(`❌ ${data.message || 'Upload алдаа'}`); }
    } catch { flash('❌ Upload алдаа гарлаа'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  // ── URL-ээр зураг нэмэх ─────────────────────────────────────────────────
  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) { flash('❌ Зөв URL оруулна уу (https://...)'); return; }
    setForm((p) => ({ ...p, images: [...p.images, url] }));
    setUrlInput('');
  };

  // ── Зураг устгах ────────────────────────────────────────────────────────
  const removeImage = (idx) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  // ── Зургийн дарааллыг солих (drag) ──────────────────────────────────────
  const dragIdx = useRef(null);
  const onDragStart = (i) => { dragIdx.current = i; };
  const onDrop = (i) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    const imgs = [...form.images];
    const [moved] = imgs.splice(dragIdx.current, 1);
    imgs.splice(i, 0, moved);
    setForm((p) => ({ ...p, images: imgs }));
    dragIdx.current = null;
  };

  // ── Хадгалах ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title || !form.brand) { flash('❌ Гарчиг болон брэнд шаардлагатай'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        year:     form.year     ? Number(form.year)     : undefined,
        mileage:  form.mileage  ? Number(form.mileage)  : undefined,
        cc:       form.cc       ? Number(form.cc)       : undefined,
        krwPrice: form.krwPrice ? Number(form.krwPrice) : undefined,
        order:    Number(form.order) || 0,
        images:   form.images,
      };
      if (editing) {
        const r = await updateAdminListing(editing, payload);
        setListings((l) => l.map((x) => (x._id === editing ? r.data : x)));
        flash('✅ Зар шинэчлэгдлээ');
      } else {
        const r = await createAdminListing(payload);
        setListings((l) => [r.data, ...l]);
        flash('✅ Зар нэмэгдлээ');
      }
      setForm(EMPTY); setEditing(null); setUrlInput('');
    } catch { flash('❌ Хадгалахад алдаа гарлаа'); }
    finally { setSaving(false); }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title, brand: item.brand, model: item.model || '',
      year: item.year || '', mileage: item.mileage || '',
      fuelType: item.fuelType || '', transmission: item.transmission || '',
      cc: item.cc || '', color: item.color || '',
      krwPrice: item.krwPrice || '', description: item.description || '',
      images: item.images || [],
      linkUrl: item.linkUrl || '', isActive: item.isActive, order: item.order || 0,
    });
    setUrlInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Зарыг устгах уу?')) return;
    await deleteAdminListing(id);
    setListings((l) => l.filter((x) => x._id !== id));
    flash('✅ Устгагдлаа');
  };

  const toggleActive = async (item) => {
    const r = await updateAdminListing(item._id, { isActive: !item.isActive });
    setListings((l) => l.map((x) => (x._id === item._id ? r.data : x)));
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className={styles.wrap}>
      {/* ── Form ── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          {editing ? '✏️ Зар засах' : '➕ Шинэ машины зар нэмэх'}
        </h2>

        <div className={styles.grid}>
          {/* Гарчиг */}
          <div className={`${styles.field} ${styles.fullRow}`}>
            <label className={styles.label}>Гарчиг *</label>
            <input className={styles.input} value={form.title}
              onChange={(e) => f('title', e.target.value)}
              placeholder="BMW 3-Series 320d 2019" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Брэнд *</label>
            <input className={styles.input} value={form.brand}
              onChange={(e) => f('brand', e.target.value)} placeholder="BMW" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Загвар</label>
            <input className={styles.input} value={form.model}
              onChange={(e) => f('model', e.target.value)} placeholder="3-Series 320d" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Он</label>
            <input type="number" className={styles.input} value={form.year}
              onChange={(e) => f('year', e.target.value)} placeholder="2019" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Гүйлт (км)</label>
            <input type="number" className={styles.input} value={form.mileage}
              onChange={(e) => f('mileage', e.target.value)} placeholder="89000" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Түлш</label>
            <select className={styles.input} value={form.fuelType}
              onChange={(e) => f('fuelType', e.target.value)}>
              <option value="">Сонгох</option>
              {FUEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Хурдны хайрцаг</label>
            <select className={styles.input} value={form.transmission}
              onChange={(e) => f('transmission', e.target.value)}>
              <option value="">Сонгох</option>
              {TRANS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Хөдөлгүүр (cc)</label>
            <input type="number" className={styles.input} value={form.cc}
              onChange={(e) => f('cc', e.target.value)} placeholder="1998" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Өнгө</label>
            <input className={styles.input} value={form.color}
              onChange={(e) => f('color', e.target.value)} placeholder="Цагаан" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Үнэ (₩ Вон)</label>
            <input type="number" className={styles.input} value={form.krwPrice}
              onChange={(e) => f('krwPrice', e.target.value)} placeholder="15500000" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Холбоос (Encar URL)</label>
            <input className={styles.input} value={form.linkUrl}
              onChange={(e) => f('linkUrl', e.target.value)}
              placeholder="https://www.encar.com/..." />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Тайлбар</label>
            <input className={styles.input} value={form.description}
              onChange={(e) => f('description', e.target.value)}
              placeholder="Нэмэлт мэдээлэл..." />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Эрэмбэ (жижиг = дээр)</label>
            <input type="number" className={styles.input} value={form.order}
              onChange={(e) => f('order', parseInt(e.target.value) || 0)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Төлөв</label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.isActive}
                onChange={(e) => f('isActive', e.target.checked)} />
              <span className={styles.toggleSlider} />
              <span className={styles.toggleText}>
                {form.isActive ? 'Идэвхтэй' : 'Нуугдсан'}
              </span>
            </label>
          </div>

          {/* ── Зургууд — бүтэн мөр ── */}
          <div className={`${styles.field} ${styles.fullRow}`}>
            <label className={styles.label}>
              Зургууд ({form.images.length}) —
              <span className={styles.labelHint}> эхний зураг thumbnail болно · чирж дараалал солих боломжтой</span>
            </label>

            {/* Upload товч */}
            <div className={styles.uploadRow}>
              <input ref={fileRef} type="file" accept="image/*" multiple
                style={{ display: 'none' }} onChange={handleFileChange} />
              <button type="button" className={styles.uploadBtn}
                onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? '⏳ Uploading...' : '📁 Зураг сонгох (олон)'}
              </button>
              <span className={styles.orText}>эсвэл URL:</span>
              <input className={`${styles.input} ${styles.urlInput}`}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                placeholder="https://ci.encar.com/..." />
              <button type="button" className={styles.addUrlBtn} onClick={handleAddUrl}>
                + Нэмэх
              </button>
            </div>

            {/* Зургийн grid preview */}
            {form.images.length > 0 && (
              <div className={styles.imgGrid}>
                {form.images.map((url, i) => (
                  <div
                    key={i}
                    className={`${styles.imgItem} ${i === 0 ? styles.imgThumb : ''}`}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                  >
                    <img src={url} alt={`img-${i}`}
                      onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }} />
                    {i === 0 && <span className={styles.thumbBadge}>Thumbnail</span>}
                    <button type="button" className={styles.removeImgBtn}
                      onClick={() => removeImage(i)}>✕</button>
                    <span className={styles.imgNum}>{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {msg && (
          <div className={`${styles.msg} ${msg.startsWith('❌') ? styles.msgErr : styles.msgOk}`}>
            {msg}
          </div>
        )}
        <div className={styles.actions}>
          {editing && (
            <button className={styles.cancelBtn}
              onClick={() => { setEditing(null); setForm(EMPTY); setUrlInput(''); }}>
              Цуцлах
            </button>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Хадгалж байна...' : editing ? 'Шинэчлэх' : 'Зар нэмэх'}
          </button>
        </div>
      </div>

      {/* ── Жагсаалт ── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📋 Зарын жагсаалт ({listings.length})</h2>
        {loading ? (
          <div className={styles.empty}>Ачаалж байна...</div>
        ) : listings.length === 0 ? (
          <div className={styles.empty}>Зар байхгүй байна.</div>
        ) : (
          <div className={styles.list}>
            {listings.map((item) => (
              <div key={item._id}
                className={`${styles.item} ${!item.isActive ? styles.itemInactive : ''}`}>
                <div className={styles.itemThumb}>
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.title} />
                    : <span>📷</span>}
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemSub}>
                    {[
                      item.year,
                      item.mileage ? formatKm(item.mileage) : null,
                      item.fuelType,
                    ].filter(Boolean).join(' — ')}
                  </span>
                  <span className={styles.itemMeta2}>
                    {item.images?.length || 0} зураг
                    {item.krwPrice ? ` · ${formatKRW(item.krwPrice)}` : ''}
                  </span>
                </div>
                <div className={styles.itemMeta}>
                  <span className={`${styles.badge} ${item.isActive ? styles.badgeOn : styles.badgeOff}`}>
                    {item.isActive ? 'Идэвхтэй' : 'Нуугдсан'}
                  </span>
                  <span className={styles.brandTag}>{item.brand}</span>
                </div>
                <div className={styles.itemActions}>
                  <button className={styles.toggleBtn} onClick={() => toggleActive(item)}>
                    {item.isActive ? '🙈 Нуух' : '👁 Харуулах'}
                  </button>
                  <button className={styles.editBtn} onClick={() => handleEdit(item)}>✏️ Засах</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}