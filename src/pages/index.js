import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Management App</h1>
      <div className={styles.imageContainer}>
        <img src="/tarea.png" alt="Imagen de fondo" className={styles.image} />
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/register">Register</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
}
