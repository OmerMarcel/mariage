'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, CheckCircle, XCircle, Clock, Upload, Download, Filter } from 'lucide-react';
import { guestsData } from '@/lib/data/mockData';
import { getStatusLabel } from '@/lib/utils';
import styles from './page.module.css';

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState(guestsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGuests = guests.filter(guest => {
    if (statusFilter !== 'all' && guest.invitationStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        guest.firstName.toLowerCase().includes(q) ||
        guest.lastName.toLowerCase().includes(q) ||
        guest.email?.toLowerCase().includes(q) ||
        guest.group?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'attending': return <CheckCircle size={14} className={styles.statusAttending} />;
      case 'declined': return <XCircle size={14} className={styles.statusDeclined} />;
      case 'invited': return <Mail size={14} className={styles.statusInvited} />;
      default: return <Clock size={14} className={styles.statusPending} />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invités</h1>
          <p className={styles.subtitle}>{guests.length} invités au total</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary btn-sm">
            Importer CSV
          </button>
          <button className="btn btn-primary btn-sm">
            <Plus size={16} />
            Ajouter un invité
          </button>
        </div>
      </div>

      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un invité..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="attending">Présents</option>
              <option value="declined">Déclinés</option>
              <option value="invited">Invités</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Contact</th>
                <th>Groupe</th>
                <th>Statut RSVP</th>
                <th>Permissions</th>
                <th className={styles.textRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest.id}>
                  <td>
                    <div className={styles.guestInfo}>
                      <div className={styles.guestAvatar}>
                        {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.guestName}>{guest.firstName} {guest.lastName}</div>
                        {!guest.active && <span className={styles.inactiveBadge}>Inactif</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      {guest.email && <div className={styles.contactItem}>{guest.email}</div>}
                      {guest.phone && <div className={styles.contactItem}>{guest.phone}</div>}
                      {!guest.email && !guest.phone && <span className={styles.noContact}>-</span>}
                    </div>
                  </td>
                  <td>
                    <span className={styles.groupBadge}>{guest.group || 'Non assigné'}</span>
                  </td>
                  <td>
                    <div className={styles.statusCell}>
                      {getStatusIcon(guest.invitationStatus)}
                      <span>{getStatusLabel(guest.invitationStatus)}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.permissions}>
                      <span className={`${styles.permIcon} ${guest.uploadAllowed ? styles.permActive : ''}`} title="Upload autorisé">
                        <Upload size={14} />
                      </span>
                      <span className={`${styles.permIcon} ${guest.downloadAllowed ? styles.permActive : ''}`} title="Téléchargement autorisé">
                        <Download size={14} />
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="Modifier">
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.dangerBtn}`} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGuests.length === 0 && (
            <div className={styles.emptyState}>
              <Filter size={40} className={styles.emptyIcon} />
              <p>Aucun invité ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
