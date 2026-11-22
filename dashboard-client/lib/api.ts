import { Media, MediaStatus } from '@/lib/types';
import { getFirebaseAuth } from '@/lib/firebase';
import { photosData, videosData, pendingMediasData } from '@/lib/data/mockData';

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

export async function getAdminMedia(status?: string): Promise<Media[]> {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  try {
    const data = await request<Media[]>(`/api/admin/media${query}`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    console.warn('[Admin API] Backend inaccessible, chargement des médias locaux.');
  }
  const all = [...pendingMediasData, ...photosData, ...videosData];
  if (status && status !== 'all') {
    return all.filter(m => m.status === status);
  }
  return all;
}

export async function updateMediaStatus(id: string, status: MediaStatus): Promise<Media> {
  try {
    return await request<Media>(`/api/admin/media/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  } catch {
    console.warn('[Admin API] Backend inaccessible, mise à jour simulée.');
    const all = [...pendingMediasData, ...photosData, ...videosData];
    const found = all.find(m => m.id === id);
    if (found) {
      return { ...found, status, approvedAt: status === 'approuve' ? new Date().toISOString() : undefined };
    }
    return {
      id,
      type: 'photo',
      originalUrl: '',
      thumbnailUrl: '',
      webUrl: '',
      size: 0,
      status,
      downloadAllowed: true,
      createdAt: new Date().toISOString(),
    };
  }
}
