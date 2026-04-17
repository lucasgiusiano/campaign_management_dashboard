import { useState } from 'react'
import { formatCurrency, formatNumber } from '../../utils/formatters'
import styles from './CampaignTable.module.css'

const SortIcon = ({ colKey, sortConfig }) => {
  if (sortConfig.key !== colKey)
    return <span className={styles.sortIcon}>↕</span>
  return (
    <span className={`${styles.sortIcon} ${styles.sortActive}`}>
      {sortConfig.direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

const SORTABLE_COLUMNS = ['name', 'startDate', 'profit']

export default function CampaignTable({ campaigns, sortConfig, onSort, onDelete }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = (id) => {
    onDelete(id)
    setDeleteConfirm(null)
  }

  if (campaigns.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No campaigns yet. Add your first one!</p>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                { key: 'name', label: 'Name' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
                { key: 'clicks', label: 'Clicks' },
                { key: 'cost', label: 'Cost' },
                { key: 'revenue', label: 'Revenue' },
                { key: 'profit', label: 'Profit' },
                { key: 'actions', label: 'Actions' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className={`${styles.th} ${SORTABLE_COLUMNS.includes(key) ? styles.sortable : ''}`}
                  onClick={SORTABLE_COLUMNS.includes(key) ? () => onSort(key) : undefined}
                >
                  {label}
                  {SORTABLE_COLUMNS.includes(key) && (
                    <SortIcon colKey={key} sortConfig={sortConfig} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const profit = campaign.revenue - campaign.cost
              return (
                <tr key={campaign.id} className={styles.row}>
                  <td className={`${styles.td} ${styles.nameCell}`}>{campaign.name}</td>
                  <td className={styles.td}>{campaign.startDate}</td>
                  <td className={styles.td}>{campaign.endDate}</td>
                  <td className={styles.td}>{formatNumber(campaign.clicks)}</td>
                  <td className={`${styles.td} ${styles.danger}`}>{formatCurrency(campaign.cost)}</td>
                  <td className={`${styles.td} ${styles.success}`}>{formatCurrency(campaign.revenue)}</td>
                  <td className={`${styles.td} ${styles.profitCell} ${profit >= 0 ? styles.primary : styles.danger}`}>
                    {formatCurrency(profit)}
                  </td>
                  <td className={styles.td}>
                    {deleteConfirm === campaign.id ? (
                      <div className={styles.confirmRow}>
                        <span className={styles.confirmText}>Sure?</span>
                        <button className={styles.confirmYes} onClick={() => handleDelete(campaign.id)}>Yes</button>
                        <button className={styles.confirmNo} onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteConfirm(campaign.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
