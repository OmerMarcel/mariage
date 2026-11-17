'use client';

import { useState } from 'react';
import { Save, Settings, Shield, Globe, HardDrive, Image as ImageIcon } from 'lucide-react';
import { weddingData } from '@/lib/data/mockData';
import styles from './page.module.css';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({ ...weddingData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Paramètres sauvegardés (simulation)');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Paramètres</h1>
          <p className={styles.subtitle}>Configuration globale de la plateforme</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          <Save size={16} />
          Sauvegarder
        </button>
      </div>

      <div className={styles.layout}>
        {/* Tabs sidebar */}
        <div className={styles.tabsMenu}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'general' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Settings size={18} /> Général
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'privacy' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} /> Confidentialité
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'seo' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <Globe size={18} /> SEO & Partage
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'storage' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('storage')}
          >
            <HardDrive size={18} /> Stockage
          </button>
        </div>

        {/* Form Content */}
        <div className={styles.tabContent}>
          <form onSubmit={handleSave} className={styles.formCard}>
            
            {activeTab === 'general' && (
              <div className={styles.tabPanel}>
                <h2 className={styles.panelTitle}>Informations du mariage</h2>
                
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="brideName">Prénom Mariée</label>
                    <input type="text" id="brideName" name="brideName" className="form-input" value={formData.brideName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="groomName">Prénom Marié</label>
                    <input type="text" id="groomName" name="groomName" className="form-input" value={formData.groomName} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="weddingDate">Date du mariage</label>
                    <input type="date" id="weddingDate" name="weddingDate" className="form-input" value={formData.weddingDate} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="weddingTime">Heure</label>
                    <input type="time" id="weddingTime" name="weddingTime" className="form-input" value={formData.weddingTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="venue">Lieu de réception</label>
                  <input type="text" id="venue" name="venue" className="form-input" value={formData.venue} onChange={handleChange} />
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">Ville</label>
                    <input type="text" id="city" name="city" className="form-input" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Pays</label>
                    <input type="text" id="country" name="country" className="form-input" value={formData.country} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="loveMessage">Message d&apos;accueil</label>
                  <textarea id="loveMessage" name="loveMessage" className="form-textarea" value={formData.loveMessage} onChange={handleChange} rows={4} />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.tabPanel}>
                <h2 className={styles.panelTitle}>Confidentialité et Accès</h2>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="mode">Mode du site</label>
                  <select id="mode" name="mode" className="form-select" value={formData.mode} onChange={handleChange}>
                    <option value="public">Public (accessible à tous)</option>
                    <option value="prive">Privé (mot de passe requis pour tout le site)</option>
                    <option value="hybride">Hybride (accueil public, galeries privées)</option>
                  </select>
                  <p className={styles.helpText}>
                    En mode hybride, les invités devront saisir leur code d&apos;accès pour voir les photos et vidéos.
                  </p>
                </div>

                <div className={styles.settingsGroup}>
                  <h3 className={styles.groupTitle}>Permissions par défaut (Nouveaux invités)</h3>
                  
                  <label className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>Autoriser l&apos;upload</span>
                      <span className={styles.toggleDesc}>Les invités peuvent envoyer des photos/vidéos</span>
                    </div>
                    <div className={styles.toggleSwitch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </div>
                  </label>
                  
                  <label className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>Autoriser le téléchargement</span>
                      <span className={styles.toggleDesc}>Les invités peuvent télécharger les fichiers originaux</span>
                    </div>
                    <div className={styles.toggleSwitch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </div>
                  </label>
                  
                  <label className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>Validation automatique</span>
                      <span className={styles.toggleDesc}>Publier les uploads invités sans modération (Non recommandé)</span>
                    </div>
                    <div className={styles.toggleSwitch}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className={styles.tabPanel}>
                <h2 className={styles.panelTitle}>Référencement (SEO) et Partage social</h2>
                
                <div className="form-group">
                  <label className="form-label">Titre du site (Meta Title)</label>
                  <input type="text" className="form-input" defaultValue={`${formData.brideName} & ${formData.groomName} — Notre Mariage`} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description (Meta Description)</label>
                  <textarea className="form-textarea" rows={3} defaultValue="Découvrez les souvenirs de notre mariage : photos, vidéos, albums et invitation virtuelle. Un moment unique partagé avec nos proches." />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Image de partage (Open Graph)</label>
                  <div className={styles.ogImagePreview}>
                    <ImageIcon size={32} color="var(--gold-dark)" />
                    <span>Sélectionner une image (1200x630px recommandé)</span>
                  </div>
                </div>

                <label className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Indexation Google</span>
                    <span className={styles.toggleDesc}>Autoriser les moteurs de recherche à indexer les pages publiques</span>
                  </div>
                  <div className={styles.toggleSwitch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className={styles.tabPanel}>
                <h2 className={styles.panelTitle}>Stockage Object S3 (Configuration)</h2>
                
                <div className={styles.storageUsage}>
                  <div className={styles.storageInfo}>
                    <span className={styles.storageLabel}>Espace utilisé</span>
                    <span className={styles.storageValue}>12.4 Go / 50 Go</span>
                  </div>
                  <div className={styles.storageBar}>
                    <div className={styles.storageFill} style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Endpoint URL</label>
                  <input type="text" className="form-input" defaultValue="s3.eu-west-3.amazonaws.com" disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Bucket Name</label>
                  <input type="text" className="form-input" defaultValue="mariage-amara-theo-assets" disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">CDN URL</label>
                  <input type="text" className="form-input" defaultValue="https://cdn.amara-theo.fr" disabled />
                </div>
                <p className={styles.helpText}>
                  Les paramètres de stockage sont définis dans les variables d&apos;environnement côté serveur et ne peuvent pas être modifiés ici.
                </p>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
