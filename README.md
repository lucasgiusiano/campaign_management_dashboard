# Campaign Dashboard

A React-based campaign management dashboard built with Vite.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- View campaigns in a sortable table
- Add campaigns via a validated form
- Delete campaigns with a confirmation step
- Dynamic profit calculation (Revenue − Cost)
- Summary cards: total campaigns, clicks, cost, revenue and profit
- Sort by name, start date, or profit
- Live profit preview while filling the form
- Data persisted in localStorage

## Project Structure

```
src/
├── components/
│   ├── CampaignForm/
│   │   ├── CampaignForm.jsx       # Add campaign form with validation
│   │   └── CampaignForm.module.css
│   ├── CampaignTable/
│   │   ├── CampaignTable.jsx      # Sortable campaigns table
│   │   └── CampaignTable.module.css
│   └── SummaryCards/
│       ├── SummaryCards.jsx       # KPI summary cards
│       └── SummaryCards.module.css
├── hooks/
│   └── useCampaigns.js            # Campaign state, sorting, localStorage
├── utils/
│   └── formatters.js              # Currency and number formatters
├── App.jsx                        # Root component — layout & composition
├── App.module.css
├── index.css                      # Global reset & CSS variables
└── main.jsx
```

## Stack

- React 18
- Vite 4
- CSS Modules
