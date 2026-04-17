import { useState, useEffect } from 'react'
import { useCampaigns } from './hooks/useCampaigns'
import SummaryCards from './components/SummaryCards/SummaryCards'
import CampaignForm from './components/CampaignForm/CampaignForm'
import CampaignTable from './components/CampaignTable/CampaignTable'
import styles from './App.module.css'

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [showForm, setShowForm] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const { campaigns, count, totals, sortConfig, addCampaign, deleteCampaign, toggleSort } = useCampaigns()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const handleAdd = (data) => {
    addCampaign(data)
    setShowForm(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Campaign Dashboard</h1>
            <p className={styles.subtitle}>Track and manage your campaign performance</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className={styles.newBtn}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? '✕ Cancel' : '+ New Campaign'}
            </button>
          </div>
        </header>

        <SummaryCards count={count} totals={totals} />

        {showForm && (
          <CampaignForm
            onAdd={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}

        <CampaignTable
          campaigns={campaigns}
          sortConfig={sortConfig}
          onSort={toggleSort}
          onDelete={deleteCampaign}
        />

      </div>
    </div>
  )
}
