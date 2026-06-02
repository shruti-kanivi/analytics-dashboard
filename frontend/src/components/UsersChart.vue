<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const trends = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/analytics/trends')
    trends.value = res.data || []
  } catch (err) {
    console.error('UsersChart error:', err)
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
      label: 'Users',
      data: trends.value.map(d => d.users),
      backgroundColor: 'rgba(139,92,246,0.65)',
      hoverBackgroundColor: '#8b5cf6',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'Sessions',
      data: trends.value.map(d => d.sessions),
      backgroundColor: 'rgba(245,158,11,0.55)',
      hoverBackgroundColor: '#f59e0b',
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#a1a1aa',
        font: { size: 12, family: 'Inter' },
        boxWidth: 10,
        boxHeight: 10,
        borderRadius: 3,
        useBorderRadius: true,
      },
    },
    tooltip: {
      backgroundColor: '#18181b',
      borderColor: '#27272a',
      borderWidth: 1,
      titleColor: '#94a3b8',
      bodyColor: '#f1f5f9',
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#71717a', font: { size: 12, family: 'Inter' } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(39,39,42,0.8)', drawBorder: false },
      ticks: { color: '#71717a', font: { size: 12, family: 'Inter' } },
      border: { display: false },
    },
  },
}
</script>

<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <div>
        <h3 class="chart-title">Daily Users vs Sessions</h3>
        <p class="chart-subtitle">Engagement breakdown by day</p>
      </div>
    </div>
    <div class="chart-body">
      <div v-if="loading" class="sk-chart" />
      <Bar v-else :data="chartData" :options="chartOptions" />
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
