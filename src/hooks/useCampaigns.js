import { useState, useEffect, useCallback } from 'react'

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

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : INITIAL_CAMPAIGNS
  } catch {
    return INITIAL_CAMPAIGNS
  }
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState(loadFromStorage)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
  }, [campaigns])

  const addCampaign = useCallback((data) => {
    const newCampaign = {
      id: Date.now(),
      name: data.name.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      clicks: Number(data.clicks),
      cost: Number(data.cost),
      revenue: Number(data.revenue),
    }
    setCampaigns((prev) => [newCampaign, ...prev])
  }, [])

  const deleteCampaign = useCallback((id) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const toggleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (!sortConfig.key) return 0
    const dir = sortConfig.direction === 'asc' ? 1 : -1
    switch (sortConfig.key) {
      case 'profit':
        return ((a.revenue - a.cost) - (b.revenue - b.cost)) * dir
      case 'startDate':
        return (a.startDate > b.startDate ? 1 : -1) * dir
      case 'name':
        return a.name.localeCompare(b.name) * dir
      default:
        return 0
    }
  })

  const totals = campaigns.reduce(
    (acc, c) => ({
      cost: acc.cost + c.cost,
      revenue: acc.revenue + c.revenue,
      clicks: acc.clicks + c.clicks,
    }),
    { cost: 0, revenue: 0, clicks: 0 }
  )

  return {
    campaigns: sortedCampaigns,
    count: campaigns.length,
    totals,
    sortConfig,
    addCampaign,
    deleteCampaign,
    toggleSort,
  }
}
