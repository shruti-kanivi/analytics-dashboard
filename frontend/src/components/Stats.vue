<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const summary = ref({
  totalUsers: 0,
  totalRevenue: 0,
  totalSessions: 0,
});

onMounted(async () => {
  try {
    const res = await api.get("/analytics/summary");
    summary.value = res.data || {};
  } catch (err) {
    console.error("Summary API error:", err);
  }
});
</script>

<template>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-title">Users</div>
      <div class="stat-value">{{ summary.totalUsers }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-title">Revenue</div>
      <div class="stat-value">₹{{ summary.totalRevenue }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-title">Sessions</div>
      <div class="stat-value">{{ summary.totalSessions }}</div>
    </div>
  </div>
</template>