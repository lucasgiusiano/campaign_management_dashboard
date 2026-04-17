import { useState, useEffect } from 'react'

const STORAGE_KEY = 'campaigns'

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: 'Summer Sale',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    clicks: 4200,
    cost: 1200,
    revenue: 3800,
  },
  {
    id: 2,
    name: 'Brand Awareness Q3',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    clicks: 9800,
    cost: 3500,
    revenue: 7200,
  },
  {
    id: 3,
    name: 'Holiday Promo',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    clicks: 15000,
    cost: 5000,
    revenue: 12400,
  },
]

const EMPTY_FORM = {
  name: '',
  startDate: '',
  endDate: '',
  clicks: '',
  cost: '',
  revenue: '',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(value)

export default function App() {
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_CAMPAIGNS
    } catch {
      return INITIAL_CAMPAIGNS
    }
  })

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
  }, [campaigns])

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.startDate) newErrors.startDate = 'Start date is required'
    if (!form.endDate) newErrors.endDate = 'End date is required'
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      newErrors.endDate = 'End date must be after start date'
    if (!form.clicks || isNaN(form.clicks) || Number(form.clicks) < 0)
      newErrors.clicks = 'Valid clicks count required'
    if (!form.cost || isNaN(form.cost) || Number(form.cost) < 0)
      newErrors.cost = 'Valid cost required'
    if (!form.revenue || isNaN(form.revenue) || Number(form.revenue) < 0)
      newErrors.revenue = 'Valid revenue required'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const newCampaign = {
      id: Date.now(),
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      clicks: Number(form.clicks),
      cost: Number(form.cost),
      revenue: Number(form.revenue),
    }
    setCampaigns((prev) => [newCampaign, ...prev])
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (!sortConfig.key) return 0
    const dir = sortConfig.direction === 'asc' ? 1 : -1
    if (sortConfig.key === 'profit') {
      return ((a.revenue - a.cost) - (b.revenue - b.cost)) * dir
    }
    if (sortConfig.key === 'startDate') {
      return (a.startDate > b.startDate ? 1 : -1) * dir
    }
    if (sortConfig.key === 'name') {
      return a.name.localeCompare(b.name) * dir
    }
    return 0
  })

  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
  const totalProfit = totalRevenue - totalCost

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <span style={styles.sortIcon}>↕</span>
    return <span style={{ ...styles.sortIcon, color: '#6366f1' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Campaign Dashboard</h1>
            <p style={styles.subtitle}>Track and manage your campaign performance</p>
          </div>
          <button style={styles.addBtn} onClick={() => { setShowForm((v) => !v); setErrors({}) }}>
            {showForm ? '✕ Cancel' : '+ New Campaign'}
          </button>
        </div>

        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Campaigns</span>
            <span style={styles.cardValue}>{campaigns.length}</span>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Cost</span>
            <span style={{ ...styles.cardValue, color: '#ef4444' }}>{formatCurrency(totalCost)}</span>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Revenue</span>
            <span style={{ ...styles.cardValue, color: '#10b981' }}>{formatCurrency(totalRevenue)}</span>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Profit</span>
            <span style={{ ...styles.cardValue, color: totalProfit >= 0 ? '#6366f1' : '#ef4444' }}>
              {formatCurrency(totalProfit)}
            </span>
          </div>
        </div>

        {/* Add Campaign Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Add New Campaign</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Campaign Name</label>
                  <input
                    style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Summer Sale"
                  />
                  {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Start Date</label>
                  <input
                    style={{ ...styles.input, ...(errors.startDate ? styles.inputError : {}) }}
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && <span style={styles.errorText}>{errors.startDate}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>End Date</label>
                  <input
                    style={{ ...styles.input, ...(errors.endDate ? styles.inputError : {}) }}
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && <span style={styles.errorText}>{errors.endDate}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Clicks</label>
                  <input
                    style={{ ...styles.input, ...(errors.clicks ? styles.inputError : {}) }}
                    type="number"
                    name="clicks"
                    value={form.clicks}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                  {errors.clicks && <span style={styles.errorText}>{errors.clicks}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Cost ($)</label>
                  <input
                    style={{ ...styles.input, ...(errors.cost ? styles.inputError : {}) }}
                    type="number"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.cost && <span style={styles.errorText}>{errors.cost}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Revenue ($)</label>
                  <input
                    style={{ ...styles.input, ...(errors.revenue ? styles.inputError : {}) }}
                    type="number"
                    name="revenue"
                    value={form.revenue}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.revenue && <span style={styles.errorText}>{errors.revenue}</span>}
                </div>
              </div>

              {/* Live profit preview */}
              {form.cost && form.revenue && (
                <div style={styles.profitPreview}>
                  Estimated profit:{' '}
                  <strong style={{ color: (Number(form.revenue) - Number(form.cost)) >= 0 ? '#10b981' : '#ef4444' }}>
                    {formatCurrency(Number(form.revenue) - Number(form.cost))}
                  </strong>
                </div>
              )}

              <button type="submit" style={styles.submitBtn}>Add Campaign</button>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableCard}>
          {campaigns.length === 0 ? (
            <div style={styles.empty}>No campaigns yet. Add your first one!</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th} onClick={() => handleSort('name')}>
                      Name <SortIcon colKey="name" />
                    </th>
                    <th style={styles.th} onClick={() => handleSort('startDate')}>
                      Start Date <SortIcon colKey="startDate" />
                    </th>
                    <th style={styles.th}>End Date</th>
                    <th style={styles.th}>Clicks</th>
                    <th style={styles.th}>Cost</th>
                    <th style={styles.th}>Revenue</th>
                    <th style={styles.th} onClick={() => handleSort('profit')}>
                      Profit <SortIcon colKey="profit" />
                    </th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCampaigns.map((c, i) => {
                    const profit = c.revenue - c.cost
                    return (
                      <tr key={c.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                        <td style={styles.td}>{c.startDate}</td>
                        <td style={styles.td}>{c.endDate}</td>
                        <td style={styles.td}>{formatNumber(c.clicks)}</td>
                        <td style={{ ...styles.td, color: '#ef4444' }}>{formatCurrency(c.cost)}</td>
                        <td style={{ ...styles.td, color: '#10b981' }}>{formatCurrency(c.revenue)}</td>
                        <td style={{ ...styles.td, fontWeight: 700, color: profit >= 0 ? '#6366f1' : '#ef4444' }}>
                          {formatCurrency(profit)}
                        </td>
                        <td style={styles.td}>
                          {deleteConfirm === c.id ? (
                            <div style={styles.confirmRow}>
                              <span style={styles.confirmText}>Sure?</span>
                              <button style={styles.confirmYes} onClick={() => handleDelete(c.id)}>Yes</button>
                              <button style={styles.confirmNo} onClick={() => setDeleteConfirm(null)}>No</button>
                            </div>
                          ) : (
                            <button style={styles.deleteBtn} onClick={() => setDeleteConfirm(c.id)}>
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
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '32px 16px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  addBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1a1a2e',
  },
  formCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    color: '#1a1a2e',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: '#1a1a2e',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },
  profitPreview: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  submitBtn: {
    marginTop: 20,
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '11px 28px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tableCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  thead: {
    background: '#f9fafb',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #f0f2f5',
  },
  tr: {
    transition: 'background 0.1s',
  },
  td: {
    padding: '13px 16px',
    borderBottom: '1px solid #f0f2f5',
    whiteSpace: 'nowrap',
  },
  sortIcon: {
    marginLeft: 4,
    fontSize: 11,
    color: '#d1d5db',
  },
  deleteBtn: {
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: 6,
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  confirmRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  confirmText: {
    fontSize: 12,
    color: '#6b7280',
  },
  confirmYes: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  confirmNo: {
    background: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    padding: 48,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 15,
  },
}
