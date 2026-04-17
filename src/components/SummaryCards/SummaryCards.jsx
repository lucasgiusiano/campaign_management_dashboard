import { formatCurrency, formatNumber } from '../../utils/formatters'
import styles from './SummaryCards.module.css'

export default function SummaryCards({ count, totals }) {
  const profit = totals.revenue - totals.cost

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Total Campaigns</span>
        <span className={styles.value}>{count}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Total Clicks</span>
        <span className={styles.value}>{formatNumber(totals.clicks)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Total Cost</span>
        <span className={`${styles.value} ${styles.danger}`}>{formatCurrency(totals.cost)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Total Revenue</span>
        <span className={`${styles.value} ${styles.success}`}>{formatCurrency(totals.revenue)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Total Profit</span>
        <span className={`${styles.value} ${profit >= 0 ? styles.primary : styles.danger}`}>
          {formatCurrency(profit)}
        </span>
      </div>
    </div>
  )
}
