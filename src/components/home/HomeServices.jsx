import React from 'react';
import styles from './HomeServices.module.css';

const SERVICES = [
  {
    icon: '💰',
    title: 'Боломжийн үнэ',
    desc: 'Автомашиныг зах зээлийн бодит үнээр, нэмэлт далд зардалгүйгээр захиалах боломж',
  },
  {
    icon: '⚡',
    title: 'Шуурхай тээвэр',
    desc: 'Хурдан, найдвартай тээврийн шийдлээр таны машиныг богино хугацаанд хүргэнэ',
  },
  {
    icon: '🔍',
    title: 'Найдвартай шалгалт',
    desc: 'Сонгосон автомашинд мэргэжлийн нарийвчилсан үзлэг хийж, баталгаажуулна',
  },
  {
    icon: '📋',
    title: 'Нэмэлт үйлчилгээ',
    desc: 'Гааль, бүрдүүлэлт, оношлогоо, даатгал, улсын дугаар зэрэг бүх үйлчилгээг нэг дороос',
  },
  {
    icon: '🤝',
    title: 'Хэрэглэгчийн зөвлөгөө',
    desc: 'Таны хэрэгцээ, шаардлагад тохирсон автомашин сонгоход мэргэжлийн зөвлөгөө өгнө',
  },
];

export default function HomeServices() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Солонгос улсаас бүх төрлийн автомашин захиалгын үйлчилгээ</h2>
          <p className={styles.subtitle}>
            Бид Солонгос улсаас хямд, чанартай, шалгарсан автомашинуудыг Монголд хүргэх бүхий л үйлчилгээг санал болгож байна.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((s, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{s.icon}</span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}