import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import TopBar from './TopBar';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <TopBar />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
