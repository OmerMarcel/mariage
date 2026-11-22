import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firestore: Firestore | undefined;

export function getDatabase(): Firestore {
  if (firestore) {
    return firestore;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    );
  }

  const app = getApps()[0] ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  firestore = getFirestore(app);
  return firestore;
}

export function initFirebase(): boolean {
  try {
    getDatabase();
    return true;
  } catch (error) {
    console.warn('[Firebase] Non initialisé au démarrage :', error instanceof Error ? error.message : error);
    return false;
  }
}
