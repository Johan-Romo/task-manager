import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Register.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { email, password });
      console.log(response.data);
      setError('');
    } catch (error) {
      setError(error.response.data.error);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Register</h2>
        {error && <div className={`alert alert-danger ${styles.alert}`}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.mb3}>
            <label className={styles.formLabel}>Correo electrónico</label>
            <input
              type="email"
              className={styles.formControl}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.mb3}>
            <label className={styles.formLabel}>Contraseña</label>
            <input
              type="password"
              className={styles.formControl}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.btn}`}>Registrar</button>
        </form>
        <Link href="/" className={`btn btn-secondary ${styles.btn}`}>
          Regresar
        </Link>
      </div>
    </div>
  );
}
