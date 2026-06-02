<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const trends = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/analytics/trends')
    trends.value = res.data || []
  } catch (err) {
    console.error('RevenueChart error:', err)
  } finally {
    loading.value = false
  }
})

const chartData = computed(() => ({
  labels: trends.value.map(d =>
    new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  ),
  datasets: [
    {
      label: 'Revenue',
      data: trends.value.map(d => d.revenue),
      borderColor: '#8b5cf6',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
        gradient.addColorStop(0, 'rgba(139,92,246,0.22)')
        gradient.addColorStop(1, 'rgba(139,92,246,0.00)')
        return gradient
      },
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#18181b',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      borderColor: '#27272a',
      borderWidth: 1,
      titleColor: '#94a3b8',
      bodyColor: '#f1f5f9',
      padding: 12,
      callbacks: {
        label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(39,39,42,0.8)', drawBorder: false },
      ticks: { color: '#71717a', font: { size: 12, family: 'Inter' } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(39,39,42,0.8)', drawBorder: false },
      ticks: {
        color: '#71717a',
        font: { size: 12, family: 'Inter' },
        callback: (v) => `₹${v}`,
      },
      border: { display: false },
    },
  },
}
</script>

<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <div>
        <h3 class="chart-title">Revenue Trend</h3>
        <p class="chart-subtitle">Revenue over time</p>
      </div>
      <div class="legend-dot" style="--c:#8b5cf6">Revenue</div>
    </div>
    <div class="chart-body">
      <div v-if="loading" class="sk-chart" />
      <Line v-else :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.15s;
}
.chart-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.4); }

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #fafafa;
  margin-bottom: 2px;
}

.chart-subtitle {
  font-size: 12px;
  color: #71717a;
}

.legend-dot {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a1a1aa;
}
.legend-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c);
}

.chart-body {
  height: 220px;
}

.sk-chart {
  height: 100%;
  background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
