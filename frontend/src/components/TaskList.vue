<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const analytics = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/analytics/trends");
    analytics.value = res.data;
  } catch (err) {
    console.error("API error:", err);
  }
});
</script>

<template>
  <div class="data-list">
    <div 
      v-for="item in analytics" 
      :key="item._id" 
      class="data-row"
    >
      <span>{{ new Date(item.date).toLocaleDateString() }}</span>
      <span>Users: {{ item.users }}</span>
      <span>Revenue: ₹{{ item.revenue }}</span>
    </div>
  </div>
</template>