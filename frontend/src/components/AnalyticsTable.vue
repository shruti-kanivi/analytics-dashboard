<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const props = defineProps({ search: { type: String, default: '' } })

const trends = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/analytics/trends')
    trends.value = res.data || []
  } catch (err) {
    console.error('AnalyticsTable error:', err)
  } finally {
    loading.value = false
  }
})

const allRows = computed(() =>
  trends.value.map((row, idx) => {
    const prev = trends.value[idx - 1]
    const growth = prev && prev.revenue
      ? (((row.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
      : null
    return { ...row, growth }
  }).slice().reverse()
)

const tableRows = computed(() => {
  const q = props.search.trim().toLowerCase()
  if (!q) return allRows.value
  return allRows.value.filter(row => {
    const dateShort = fmtDate(row.date).toLowerCase()          // "Jan 5, 2024"
    const dateLong  = fmtDateLong(row.date).toLowerCase()      // "January 5, 2024"
    const usersStr   = row.users.toString()
    const revenueStr = row.revenue.toString()
    const sessionsStr = row.sessions.toString()
    return dateShort.includes(q) || dateLong.includes(q)
      || usersStr.includes(q) || revenueStr.includes(q) || sessionsStr.includes(q)
  })
})

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function fmtDateLong(d) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<template>
  <div class="table-card">
    <div class="table-header">
      <div>
        <h3 class="table-title">Recent Analytics</h3>
        <p class="table-subtitle">Performance breakdown by date</p>
      </div>
      <button class="export-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export
      </button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Users</th>
            <th>Revenue</th>
            <th>Sessions</th>
            <th>Growth</th>
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr v-for="n in 5" :key="n" class="sk-row">
            <td v-for="c in 5" :key="c"><div class="sk" /></td>
          </tr>
        </tbody>

        <tbody v-else-if="tableRows.length">
          <tr v-for="row in tableRows" :key="row._id">
            <td class="cell-date">{{ fmtDate(row.date) }}</td>
            <td class="cell-num">{{ row.users.toLocaleString() }}</td>
            <td class="cell-revenue">₹{{ row.revenue.toLocaleString() }}</td>
            <td class="cell-num">{{ row.sessions.toLocaleString() }}</td>
            <td>
              <span
                v-if="row.growth !== null"
                class="growth-pill"
                :class="Number(row.growth) >= 0 ? 'up' : 'down'"
              >
                {{ Number(row.growth) >= 0 ? '▲' : '▼' }}
                {{ Math.abs(Number(row.growth)) }}%
              </span>
              <span v-else class="growth-pill neutral">—</span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="5" class="no-results">No results for "{{ props.search }}"</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-title {
  font-size: 15px;
  font-weight: 600;
  color: #fafafa;
  margin-bottom: 2px;
}

.table-subtitle {
  font-size: 12px;
  color: #71717a;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #09090b;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  color: #a1a1aa;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.export-btn:hover { background: #27272a; color: #fafafa; }

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #27272a;
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid rgba(51,65,85,0.4);
  transition: background 0.1s;
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(39,39,42,0.5); }

tbody td {
  padding: 13px 14px;
  font-size: 13.5px;
  color: #d4d4d8;
}

.cell-date { color: #fafafa; font-weight: 500; }
.cell-num { font-variant-numeric: tabular-nums; }
.cell-revenue { color: #22c55e; font-weight: 500; font-variant-numeric: tabular-nums; }

.growth-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.growth-pill.up { background: rgba(34,197,94,0.15); color: #22c55e; }
.growth-pill.down { background: rgba(239,68,68,0.15); color: #ef4444; }
.growth-pill.neutral { background: rgba(113,113,122,0.15); color: #71717a; }

/* Skeleton */
.sk-row td { padding: 13px 14px; }

/* Empty / no-results */
.no-results {
  padding: 32px 0;
  text-align: center;
  color: #71717a;
  font-size: 13px;
}
.sk {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
