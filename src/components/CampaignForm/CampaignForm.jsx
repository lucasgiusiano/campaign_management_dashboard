import { useState } from 'react'
import { formatCurrency } from '../../utils/formatters'
import styles from './CampaignForm.module.css'

const EMPTY_FORM = {
  name: '',
  startDate: '',
  endDate: '',
  clicks: '',
  cost: '',
  revenue: '',
}

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.startDate) errors.startDate = 'Start date is required'
  if (!form.endDate) errors.endDate = 'End date is required'
  if (form.startDate && form.endDate && form.startDate > form.endDate)
    errors.endDate = 'End date must be after start date'
  if (!form.clicks || isNaN(form.clicks) || Number(form.clicks) < 0)
    errors.clicks = 'Enter a valid number of clicks'
  if (!form.cost || isNaN(form.cost) || Number(form.cost) < 0)
    errors.cost = 'Enter a valid cost'
  if (!form.revenue || isNaN(form.revenue) || Number(form.revenue) < 0)
    errors.revenue = 'Enter a valid revenue'
  return errors
}

export default function CampaignForm({ onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onAdd(form)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const liveProfit =
    form.cost !== '' && form.revenue !== ''
      ? Number(form.revenue) - Number(form.cost)
      : null

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Add New Campaign</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Campaign Name</label>
            <input
              id="name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Summer Sale"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              className={`${styles.input} ${errors.endDate ? styles.inputError : ''}`}
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <span className={styles.error}>{errors.endDate}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clicks">Clicks</label>
            <input
              id="clicks"
              className={`${styles.input} ${errors.clicks ? styles.inputError : ''}`}
              type="number"
              name="clicks"
              value={form.clicks}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
            {errors.clicks && <span className={styles.error}>{errors.clicks}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cost">Cost ($)</label>
            <input
              id="cost"
              className={`${styles.input} ${errors.cost ? styles.inputError : ''}`}
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.cost && <span className={styles.error}>{errors.cost}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="revenue">Revenue ($)</label>
            <input
              id="revenue"
              className={`${styles.input} ${errors.revenue ? styles.inputError : ''}`}
              type="number"
              name="revenue"
              value={form.revenue}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.revenue && <span className={styles.error}>{errors.revenue}</span>}
          </div>

        </div>

        {liveProfit !== null && (
          <p className={styles.profitPreview}>
            Estimated profit:{' '}
            <strong className={liveProfit >= 0 ? styles.success : styles.danger}>
              {formatCurrency(liveProfit)}
            </strong>
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            Add Campaign
          </button>
        </div>
      </form>
    </div>
  )
}
