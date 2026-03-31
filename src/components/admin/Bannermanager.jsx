import React, { useState, useEffect, useRef } from 'react';
import {
  getAdminBanners, createAdminBanner, updateAdminBanner, deleteAdminBanner,
} from '../../services/api';
import styles from './BannerManager.module.css';

const EMPTY = {
  title: '', subtitle: '', imageUrl: '', linkUrl: '',
  buttonText: 'Дэлгэрэнгүй үзэх', isActive: true, order: 0,
};

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [msg,     setMsg]     = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try { const r = await getAdminBanners(); setBanners(r.data); }
    catch { setMsg('❌ Баннер татахад алдаа гарлаа'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // ── Зураг upload ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB шалгах
    if (file.size > 5 * 1024 * 1024) {
      flash('❌ Зургийн хэмжээ 5MB-аас хэтрэхгүй байх ёстой');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/upload/banner', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        flash('✅ Зураг амжилттай upload хийгдлээ');
      } else {
        flash(`❌ ${data.message || 'Upload алдаа'}`);
      }
    } catch {
      flash('❌ Зураг upload хийхэд алдаа гарлаа');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Хадгалах ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title || !form.imageUrl) {
      flash('❌ Гарчиг болон зураг шаардлагатай');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const r = await updateAdminBanner(editing, form);
        setBanners((b) => b.map((x) => (x._id === editing ? r.data : x)));
        flash('✅ Баннер шинэчлэгдлээ');
      } else {
        const r = await createAdminBanner(form);
        setBanners((b) => [r.data, ...b]);
        flash('✅ Баннер нэмэгдлээ');
      }
      setForm(EMPTY);
      setEditing(null);
    } catch { flash('❌ Хадгалахад алдаа гарлаа'); }
    finally { setSaving(false); }
  };

  const handleEdit = (b) => {
    setEditing(b._id);
    setForm({
      title: b.title, subtitle: b.subtitle || '',
      imageUrl: b.imageUrl, linkUrl: b.linkUrl || '',
      buttonText: b.buttonText || 'Дэлгэрэнгүй үзэх',
      isActive: b.isActive, order: b.order || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Баннерыг устгах уу?')) return;
    await deleteAdminBanner(id);
    setBanners((b) => b.filter((x) => x._id !== id));
    flash('✅ Устгагдлаа');
  };

  const toggleActive = async (b) => {
    const r = await updateAdminBanner(b._id, { isActive: !b.isActive });
    setBanners((prev) => prev.map((x) => (x._id === b._id ? r.data : x)));
  };

  const f = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className={styles.wrap}>
      {/* ── Form ── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          {editing ? '✏️ Баннер засах' : '➕ Шинэ баннер нэмэх'}
        </h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Гарчиг *</label>
            <input className={styles.input} value={form.title}
              onChange={(e) => f('title', e.target.value)}
              placeholder="Жишээ: Шинэ BMW Series 5 ирлээ!" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Дэд гарчиг</label>
            <input className={styles.input} value={form.subtitle}
              onChange={(e) => f('subtitle', e.target.value)}
              placeholder="Нэмэлт тайлбар..." />
          </div>

          {/* ── Зураг оруулах хэсэг ── */}
          <div className={`${styles.field} ${styles.fullRow}`}>
            <label className={styles.label}>Зураг *</label>

            {/* Upload товч */}
            <div className={styles.uploadRow}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? '⏳ Uploading...' : '📁 Зураг сонгох'}
              </button>
              <span className={styles.orText}>эсвэл URL оруулах:</span>
              <input
                className={styles.input}
                style={{ flex: 1 }}
                value={form.imageUrl}
                onChange={(e) => f('imageUrl', e.target.value)}
                placeholder="https://ci.encar.com/..."
              />
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className={styles.previewWrap}>
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className={styles.preview}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <button
                  type="button"
                  className={styles.removeImg}
                  onClick={() => f('imageUrl', '')}
                >
                  ✕ Зураг хасах
                </button>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Холбоос URL (заавал биш)</label>
            <input className={styles.input} value={form.linkUrl}
              onChange={(e) => f('linkUrl', e.target.value)}
              placeholder="/listing/41739536" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Товчлуурын текст</label>
            <input className={styles.input} value={form.buttonText}
              onChange={(e) => f('buttonText', e.target.value)} />
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
              <span style={{ marginLeft: 8, fontSize: 13, color: '#64748b' }}>
                {form.isActive ? 'Идэвхтэй' : 'Нуугдсан'}
              </span>
            </label>
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
              onClick={() => { setEditing(null); setForm(EMPTY); }}>
              Цуцлах
            </button>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Хадгалж байна...' : editing ? 'Шинэчлэх' : 'Баннер нэмэх'}
          </button>
        </div>
      </div>

      {/* ── List ── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📋 Баннерийн жагсаалт ({banners.length})</h2>
        {loading ? (
          <div className={styles.empty}>Ачаалж байна...</div>
        ) : banners.length === 0 ? (
          <div className={styles.empty}>Баннер байхгүй байна.</div>
        ) : (
          <div className={styles.list}>
            {banners.map((b) => (
              <div key={b._id} className={`${styles.item} ${!b.isActive ? styles.itemInactive : ''}`}>
                <div className={styles.itemThumb}>
                  <img src={b.imageUrl} alt={b.title}
                    onError={(e) => { e.target.src = ''; }} />
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{b.title}</span>
                  {b.subtitle && <span className={styles.itemSub}>{b.subtitle}</span>}
                  <span className={styles.itemUrl}>{b.linkUrl || '—'}</span>
                </div>
                <div className={styles.itemMeta}>
                  <span className={`${styles.badge} ${b.isActive ? styles.badgeOn : styles.badgeOff}`}>
                    {b.isActive ? 'Идэвхтэй' : 'Нуугдсан'}
                  </span>
                  <span className={styles.order}>#{b.order}</span>
                </div>
                <div className={styles.itemActions}>
                  <button className={styles.toggleBtn} onClick={() => toggleActive(b)}>
                    {b.isActive ? '🙈 Нуух' : '👁 Харуулах'}
                  </button>
                  <button className={styles.editBtn} onClick={() => handleEdit(b)}>✏️ Засах</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(b._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}