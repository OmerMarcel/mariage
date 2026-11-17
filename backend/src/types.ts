export type MediaType = 'photo' | 'video';

export type MediaStatus = 'en_attente' | 'approuve' | 'refuse' | 'masque';

export interface Wedding {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  city: string;
  country: string;
  coverPhotoUrl: string;
  loveMessage: string;
  mode: 'public' | 'prive' | 'hybride';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverPhotoUrl?: string;
  order: number;
  visible: boolean;
  mediaCount: number;
}

export interface Media {
  id: string;
  type: MediaType;
  title?: string;
  originalUrl: string;
  thumbnailUrl: string;
  webUrl: string;
  duration?: number;
  width?: number;
  height?: number;
  size: number;
  categoryId?: string;
  albumId?: string;
  uploadedBy?: string;
  guestMessage?: string;
  status: MediaStatus;
  downloadAllowed: boolean;
  createdAt: string;
  approvedAt?: string;
}
