<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: { type: String, default: 'overview' }
})
const emit = defineEmits(['navigate'])

// Map label → section key
const sectionKey = label => label.toLowerCase()

const isActive = label => sectionKey(label) === props.active

const navItems = [
  {
    label: 'Overview',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  },
  {
    label: 'Revenue',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  },
  {
    label: 'Users',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    label: 'Traffic',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  },
  {
    label: 'Performance',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  },
  {
    label: 'Reports',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  },
]

const bottomItems = [
  {
    label: 'Settings',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  },
]
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <p class="nav-label">ANALYTICS</p>
        <button
          v-for="item in navItems"
          :key="item.label"
          :class="['nav-item', { active: isActive(item.label) }]"
          @click="emit('navigate', sectionKey(item.label))"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="nav-icon" v-html="item.icon" />
          <span class="nav-text">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <div class="sidebar-bottom">
      <button
        v-for="item in bottomItems"
        :key="item.label"
        :class="['nav-item', { active: isActive(item.label) }]"
        @click="emit('navigate', sectionKey(item.label))"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="nav-icon" v-html="item.icon" />
        <span class="nav-text">{{ item.label }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  grid-row: 2 / 3;
  background: #111113;
  border-right: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  overflow-y: auto;
}

.sidebar-nav {
  flex: 1;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  color: #52525b;
  letter-spacing: 0.08em;
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #71717a;
  font-size: 13.5px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
  margin-bottom: 2px;
}

.nav-item:hover {
  background: #1c1c1f;
  color: #d4d4d8;
}

.nav-item.active {
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
}

.nav-item.active .nav-icon :deep(svg) {
  stroke: #a78bfa;
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.8;
}

.nav-item.active .nav-icon {
  opacity: 1;
}

.sidebar-bottom {
  border-top: 1px solid #27272a;
  padding-top: 12px;
}
</style>
