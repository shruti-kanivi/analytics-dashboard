<script setup>
import { ref } from 'vue'

import Topbar from '../components/Topbar.vue'
import Sidebar from '../components/Sidebar.vue'
import StatsCards from '../components/StatsCards.vue'
import RevenueChart from '../components/RevenueChart.vue'
import UsersChart from '../components/UsersChart.vue'
import TrafficDonut from '../components/TrafficDonut.vue'
import AnalyticsTable from '../components/AnalyticsTable.vue'


// ACTIVE SIDEBAR SECTION
const activeSection = ref('overview')


// SEARCH STATE
const search = ref('')


// PAGE TITLES
const sectionTitles = {
  overview: {
    title: 'Overview',
    subtitle: 'Welcome back — here’s what’s happening today.'
  },

  revenue: {
    title: 'Revenue',
    subtitle: 'Track your revenue trends and financial performance.'
  },

  users: {
    title: 'Users',
    subtitle: 'Analyze user growth and engagement over time.'
  },

  traffic: {
    title: 'Traffic',
    subtitle: 'Understand where your visitors are coming from.'
  },

  performance: {
    title: 'Performance',
    subtitle: 'Monitor system performance and response metrics.'
  },

  reports: {
    title: 'Reports',
    subtitle: 'View and export detailed analytics reports.'
  },

  settings: {
    title: 'Settings',
    subtitle: 'Manage your dashboard preferences.'
  },
}


// SIDEBAR NAVIGATION
function onNavigate(section) {
  activeSection.value = section
}
</script>


<template>
  <div class="app">

    <!-- NAVBAR -->
    <Topbar
      v-model:search="search"
      @navigate="onNavigate"
    />


    <!-- SIDEBAR -->
    <Sidebar
      :active="activeSection"
      @navigate="onNavigate"
    />


    <!-- MAIN CONTENT -->
    <main class="main">

      <!-- PAGE HEADER -->
      <div class="page-header">

        <h1 class="page-title">
          {{ sectionTitles[activeSection]?.title }}
        </h1>

        <p class="page-subtitle">
          {{ sectionTitles[activeSection]?.subtitle }}
        </p>

      </div>


      <!-- KPI CARDS -->
      <StatsCards />


      <!-- CHARTS -->
      <div class="charts-row">

        <div class="chart-col-wide">
          <RevenueChart />
        </div>

        <div class="chart-col-narrow">
          <TrafficDonut />
        </div>

      </div>


      <!-- USERS CHART -->
      <UsersChart />


      <!-- ANALYTICS TABLE -->
      <AnalyticsTable :search="search" />

    </main>
  </div>
</template>


<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 14px;
  color: #94a3b8;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-col-wide,
.chart-col-narrow {
  width: 100%;
}

@media (max-width: 1100px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>