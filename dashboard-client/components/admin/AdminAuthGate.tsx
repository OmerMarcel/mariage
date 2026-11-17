'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(pathname !== '/login');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === '/login') return;

    try {
      return onAuthStateChanged(getFirebaseAuth(), nextUser => {
        setUser(nextUser);
        setIsLoading(false);
      });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Configuration Firebase invalide.');
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isLoading, pathname, router, user]);

  if (pathname === '/login') return <>{children}</>;
  if (error) return <p style={{ padding: '2rem' }}>{error}</p>;
  if (isLoading || !user) return <p style={{ padding: '2rem' }}>Vérification de la session...</p>;

  return <>{children}</>;
}
