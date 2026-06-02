<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const summary = ref({ totalUsers: 0, totalRevenue: 0, totalSessions: 0 })
const trends = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [summaryRes, trendsRes] = await Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/trends'),
    ])
    summary.value = summaryRes.data || {}
    trends.value = trendsRes.data || []
  } catch (err) {
    console.error('StatsCards error:', err)
  } finally {
    loading.value = false
  }
})

function sparklinePath(values, w, h) {
  if (!values || values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `M ${pts.join(' L ')}`
}

function growthPct(values) {
  if (!values || values.length < 2) return 0
  const first = values[0] || 1
  const last = values[values.length - 1]
  return (((last - first) / first) * 100).toFixed(1)
}

const conversionRate = computed(() => {
  if (!summary.value.totalSessions || !summary.value.totalUsers) return '0.0'
  return ((summary.value.totalSessions / summary.value.totalUsers) * 10).toFixed(1)
})

const cards = computed(() => [
  {
    title: 'Total Users',
    value: (summary.value.totalUsers || 0).toLocaleString(),
    sparkValues: trends.value.map(d => d.users),
    color: '#8b5cf6',
    icon: 'users',
    prefix: '',
    suffix: '',
  },
  {
    title: 'Revenue',
    value: (summary.value.totalRevenue || 0).toLocaleString(),
    sparkValues: trends.value.map(d => d.revenue),
    color: '#22c55e',
    icon: 'revenue',
    prefix: '₹',
    suffix: '',
  },
  {
    title: 'Sessions',
    value: (summary.value.totalSessions || 0).toLocaleString(),
    sparkValues: trends.value.map(d => d.sessions),
    color: '#f59e0b',
    icon: 'sessions',
    prefix: '',
    suffix: '',
  },
  {
    title: 'Conversion Rate',
    value: conversionRate.value,
    sparkValues: trends.value.map(d => d.sessions / (d.users || 1) * 10),
    color: '#8b5cf6',
    icon: 'conversion',
    prefix: '',
    suffix: '%',
  },
])
</script>

<template>
  <div class="stats-grid">
    <!-- Loading skeletons -->
    <template v-if="loading">
      <div v-for="n in 4" :key="n" class="stat-card skeleton-card">
        <div class="sk sk-label" />
        <div class="sk sk-value" />
        <div class="sk sk-spark" />
      </div>
    </template>

    <!-- Actual cards -->
    <template v-else>
      <div v-for="card in cards" :key="card.title" class="stat-card">
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <span
            class="growth-badge"
            :class="Number(growthPct(card.sparkValues)) >= 0 ? 'positive' : 'negative'"
          >
            {{ Number(growthPct(card.sparkValues)) >= 0 ? '▲' : '▼' }}
            {{ Math.abs(Number(growthPct(card.sparkValues))) }}%
          </span>
        </div>
        <div class="card-value">
          <span class="prefix">{{ card.prefix }}</span>{{ card.value }}<span class="suffix">{{ card.suffix }}</span>
        </div>
        <div class="sparkline-wrap">
          <svg width="100%" height="44" viewBox="0 0 120 44" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="`grad-${card.title}`" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="card.color" stop-opacity="0.25" />
                <stop offset="100%" :stop-color="card.color" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              v-if="card.sparkValues.length >= 2"
              :d="sparklinePath(card.sparkValues, 120, 40) + ` L 120,44 L 0,44 Z`"
              :fill="`url(#grad-${card.title})`"
            />
            <path
              v-if="card.sparkValues.length >= 2"
              :d="sparklinePath(card.sparkValues, 120, 40)"
              :stroke="card.color"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px 20px 0 20px;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.growth-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
}

.growth-badge.positive {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.growth-badge.negative {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #fafafa;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  line-height: 1;
}

.prefix, .suffix {
  font-size: 16px;
  font-weight: 600;
  color: #a1a1aa;
}

.sparkline-wrap {
  margin: 0 -20px;
}

/* Skeleton */
.skeleton-card {
  padding: 20px;
}

.sk {
  background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.sk-label { height: 12px; width: 60%; margin-bottom: 14px; }
.sk-value { height: 28px; width: 50%; margin-bottom: 14px; }
.sk-spark { height: 44px; border-radius: 0; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
