<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// Traffic source data — representative distribution
const sources = [
  { label: 'Organic Search', value: 42, color: '#8b5cf6' },
  { label: 'Direct', value: 28, color: '#22c55e' },
  { label: 'Social Media', value: 18, color: '#f59e0b' },
  { label: 'Referral', value: 12, color: '#8b5cf6' },
]

const total = sources.reduce((s, d) => s + d.value, 0)

const chartData = computed(() => ({
  labels: sources.map(s => s.label),
  datasets: [
    {
      data: sources.map(s => s.value),
      backgroundColor: sources.map(s => s.color),
      hoverBackgroundColor: sources.map(s => s.color),
      borderWidth: 2,
      borderColor: '#18181b',
      hoverBorderColor: '#18181b',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
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
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
}
</script>

<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <div>
        <h3 class="chart-title">Traffic Sources</h3>
        <p class="chart-subtitle">Where your users come from</p>
      </div>
    </div>

    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="donut-center">
          <span class="donut-total">{{ total }}%</span>
          <span class="donut-label">Coverage</span>
        </div>
      </div>

      <div class="legend">
        <div v-for="src in sources" :key="src.label" class="legend-row">
          <div class="legend-dot" :style="{ background: src.color }" />
          <span class="legend-text">{{ src.label }}</span>
          <span class="legend-pct">{{ src.value }}%</span>
        </div>
      </div>
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

.donut-layout {
  display: flex;
  align-items: center;
  gap: 28px;
}

.donut-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.donut-total {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #fafafa;
  letter-spacing: -0.5px;
}

.donut-label {
  font-size: 11px;
  color: #71717a;
}

.legend {
  flex: 1;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(39,39,42,0.8);
}
.legend-row:last-child { border-bottom: none; }

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
  font-size: 13px;
  color: #a1a1aa;
}

.legend-pct {
  font-size: 13px;
  font-weight: 600;
  color: #fafafa;
}
</style>
