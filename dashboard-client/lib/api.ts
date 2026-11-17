import { Media, MediaStatus } from '@/lib/types';
import { getFirebaseAuth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth().currentUser;
  const token = user ? await user.getIdToken() : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as { error?: string; data?: T } | null;

  if (!response.ok) {
    throw new Error(body?.error || `Erreur API (${response.status}).`);
  }
  if (!body || body.data === undefined) {
    throw new Error('Réponse API invalide.');
  }
  return body.data;
}

export function getAdminMedia(status?: string): Promise<Media[]> {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  return request<Media[]>(`/api/admin/media${query}`);
}

export function updateMediaStatus(id: string, status: MediaStatus): Promise<Media> {
  return request<Media>(`/api/admin/media/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
