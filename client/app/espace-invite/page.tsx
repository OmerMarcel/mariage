'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle, Camera, Video, Heart, User, MessageSquare, ChevronDown } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { categoriesData } from '@/lib/data/mockData';
import styles from './page.module.css';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FilePreview {
  file: File;
  preview: string;
  id: string;
}

export default function EspaceInvitePage() {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime', 'video/webm'];
  const MAX_SIZE_MB = 500;

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type) && !f.name.toLowerCase().endsWith('.heif')) {
        alert(`Fichier non supporté: ${f.name}`);
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Fichier trop grand: ${f.name} (max ${MAX_SIZE_MB}Mo)`);
        return false;
      }
      return true;
    });

    const previews = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('video/') ? '' : URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }));
    setFiles(prev => [...prev, ...previews]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploadStatus('uploading');
    // Simulate upload progress
    for (let p = 0; p <= 100; p += 10) {
      await new Promise(res => setTimeout(res, 150));
      setProgress(p);
    }
    setUploadStatus('success');
    setFiles([]);
  };

  const resetForm = () => {
    setUploadStatus('idle');
    setProgress(0);
    setFirstName('');
    setLastName('');
    setMessage('');
    setCategory('');
  };

  return (
    <PublicLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <span className="subtitle">Vous étiez présents</span>
          <h1 className="section-title">Espace Invité</h1>
          <div className="gold-divider" />
          <p className={styles.pageDesc}>
            Partagez vos photos et vidéos de la journée. Chaque souvenir sera précieusement conservé.
          </p>
        </div>

        {/* Success State */}
        {uploadStatus === 'success' ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={60} color="var(--status-approved)" />
            </div>
            <h2 className={styles.successTitle}>Merci pour votre partage !</h2>
            <p className={styles.successText}>
              Vos fichiers ont bien été reçus. Ils seront vérifiés par l&apos;équipe avant d&apos;être publiés.
              Vous serez notifié dès qu&apos;ils seront disponibles dans la galerie.
            </p>
            <div className={styles.successBadge}>
              <Heart size={14} fill="var(--gold)" color="var(--gold)" />
              <span>En attente de validation</span>
            </div>
            <button onClick={resetForm} className="btn btn-primary">
              Envoyer d&apos;autres photos
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            {/* Upload Zone */}
            <div className={styles.uploadSection}>
              <h2 className={styles.sectionTitle}>
                <Camera size={20} />
                Vos photos & vidéos
              </h2>

              {/* Drop Zone */}
              <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                id="upload-drop-zone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.heic,.heif"
                  className={styles.fileInput}
                  onChange={e => addFiles(Array.from(e.target.files || []))}
                  id="file-input"
                />
                <div className={styles.dropZoneContent}>
                  <div className={styles.dropIcon}>
                    <Upload size={32} />
                  </div>
                  <p className={styles.dropTitle}>
                    {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
                  </p>
                  <p className={styles.dropSub}>ou cliquez pour sélectionner</p>
                  <div className={styles.formatBadges}>
                    {['JPG', 'PNG', 'WEBP', 'HEIC', 'MP4', 'MOV'].map(fmt => (
                      <span key={fmt} className={styles.formatBadge}>{fmt}</span>
                    ))}
                  </div>
                  <p className={styles.dropLimit}>Max {MAX_SIZE_MB}Mo par fichier</p>
                </div>
              </div>

              {/* File Previews */}
              {files.length > 0 && (
                <div className={styles.previews}>
                  <div className={styles.previewsHeader}>
                    <span>{files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}</span>
                    <button onClick={() => setFiles([])} className={styles.clearBtn}>
                      Tout supprimer
                    </button>
                  </div>
                  <div className={styles.previewGrid}>
                    {files.map(fp => (
                      <div key={fp.id} className={styles.previewItem}>
                        {fp.file.type.startsWith('video/') ? (
                          <div className={styles.videoPreview}>
                            <Video size={28} color="var(--gold)" />
                            <span className={styles.videoName}>{fp.file.name}</span>
                          </div>
                        ) : (
                          <Image
                            src={fp.preview}
                            alt={fp.file.name}
                            fill
                            className={styles.previewImg}
                            sizes="120px"
                          />
                        )}
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFile(fp.id)}
                          aria-label="Supprimer"
                        >
                          <X size={14} />
                        </button>
                        <span className={styles.fileSize}>
                          {(fp.file.size / (1024 * 1024)).toFixed(1)}Mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.sectionTitle}>
                <User size={20} />
                Informations (facultatif)
              </h2>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-input"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-input"
                    placeholder="Votre nom de famille"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Catégorie</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Choisir une catégorie (facultatif)</option>
                  {categoriesData.filter(c => c.visible).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Message (facultatif)
                </label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Un petit mot pour les mariés..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Progress */}
              {uploadStatus === 'uploading' && (
                <div className={styles.progressWrap}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                  <span className={styles.progressText}>Envoi en cours... {progress}%</span>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={files.length === 0 || uploadStatus === 'uploading'}
                id="upload-submit-btn"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <div className={styles.spinner} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Heart size={16} />
                    Envoyer mes {files.length > 0 ? `${files.length} ` : ''}souvenirs
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Info section */}
        <section className={styles.infoSection}>
          <div className="container-sm">
            <div className={styles.infoGrid}>
              {[
                {
                  icon: <Camera size={24} />,
                  title: 'Photos & Vidéos',
                  desc: 'Partagez vos meilleurs moments capturés pendant la journée.',
                },
                {
                  icon: <CheckCircle size={24} />,
                  title: 'Validation',
                  desc: 'Chaque contenu est vérifié par les mariés avant d\'être publié.',
                },
                {
                  icon: <Heart size={24} />,
                  title: 'Souvenirs éternels',
                  desc: 'Vos photos rejoindront la galerie officielle du mariage.',
                },
              ].map(item => (
                <div key={item.title} className={styles.infoCard}>
                  <div className={styles.infoIcon}>{item.icon}</div>
                  <h3 className={styles.infoTitle}>{item.title}</h3>
                  <p className={styles.infoDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
