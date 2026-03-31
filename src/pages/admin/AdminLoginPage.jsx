import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import styles from './AdminLoginPage.module.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin({ username, password });
      localStorage.setItem('admin_token', res.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/logo_last.png" alt="Logo" className={styles.logoImg} />
        </div>
        <h1 className={styles.title}>Админ панел</h1>
        <p className={styles.sub}>Зөвхөн эрх бүхий хэрэглэгчид нэвтэрнэ</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Нэвтрэх нэр</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Нууц үг</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Нэвтрэж байна...' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}