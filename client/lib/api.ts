import { Category, Media } from '@/lib/types';
import { categoriesData, photosData, videosData } from '@/lib/data/mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    signal: AbortSignal.timeout(6000),
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

export async function getPublicCategories(): Promise<Category[]> {
  try {
    const data = await request<Category[]>('/api/categories');
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    console.warn('[API] Backend inaccessible, chargement des catégories de démonstration.');
  }
  return categoriesData;
}

export async function getPublicMedia(params: {
  type?: Media['type'];
  categoryId?: string;
} = {}): Promise<Media[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set('type', params.type);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    const query = searchParams.toString();
    const data = await request<Media[]>(`/api/media${query ? `?${query}` : ''}`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    console.warn('[API] Backend inaccessible, chargement des médias de démonstration.');
  }

  let items = params.type === 'video' ? videosData : photosData;
  if (params.categoryId) {
    items = items.filter(m => m.categoryId === params.categoryId);
  }
  return items;
}
