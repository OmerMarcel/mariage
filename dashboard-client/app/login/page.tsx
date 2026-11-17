'use client';

import { FormEvent, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Heart, LogIn } from 'lucide-react';
import { getFirebaseAuth } from '@/lib/firebase';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      window.location.assign('/');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Connexion impossible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <Heart size={28} color="var(--gold)" fill="var(--gold)" />
        <h1>Administration</h1>
        <p>Connectez-vous pour gérer le mariage.</p>

        <label>
          Adresse e-mail
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          <LogIn size={16} />
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
