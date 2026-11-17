'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, MoveVertical, Image as ImageIcon } from 'lucide-react';
import { categoriesData } from '@/lib/data/mockData';
import styles from './page.module.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(categoriesData);

  const toggleVisibility = (id: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, visible: !c.visible } : c
    ));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Catégories</h1>
          <p className={styles.subtitle}>Gérez les catégories de photos et vidéos</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <div className={styles.colDrag}></div>
          <div className={styles.colName}>Nom</div>
          <div className={styles.colCount}>Médias</div>
          <div className={styles.colStatus}>Visibilité</div>
          <div className={styles.colActions}>Actions</div>
        </div>

        <div className={styles.tableBody}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.tableRow}>
              <div className={styles.colDrag}>
                <button className={styles.dragHandle} title="Réordonner">
                  <MoveVertical size={16} />
                </button>
              </div>
              
              <div className={styles.colName}>
                <div className={styles.catInfo}>
                  <div className={styles.catIcon}>
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <span className={styles.catTitle}>{cat.name}</span>
                    {cat.description && <span className={styles.catDesc}>{cat.description}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.colCount}>
                <span className={styles.badge}>{cat.mediaCount} médias</span>
              </div>

              <div className={styles.colStatus}>
                <button 
                  className={`${styles.statusToggle} ${cat.visible ? styles.statusVisible : styles.statusHidden}`}
                  onClick={() => toggleVisibility(cat.id)}
                  title={cat.visible ? "Masquer la catégorie" : "Rendre visible"}
                >
                  {cat.visible ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Masquée</>}
                </button>
              </div>

              <div className={styles.colActions}>
                <button className={styles.actionBtn} title="Modifier">
                  <Edit2 size={16} />
                </button>
                <button className={`${styles.actionBtn} ${styles.dangerBtn}`} title="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
