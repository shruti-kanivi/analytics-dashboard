<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown
} from '@lucide/vue'
import { useRouter } from 'vue-router'

// ROUTER
const router = useRouter()

// SEARCH PROPS
const props = defineProps({
  search: String
})

// EMITS
const emit = defineEmits(['update:search', 'navigate'])

// ── Search quick actions ─────────────────────────────────────────────────────
const showSearchMenu = ref(false)

const quickSearchItems = [
  { key: 'overview', label: 'Overview', hint: 'Dashboard summary' },
  { key: 'revenue', label: 'Revenue', hint: 'Financial metrics' },
  { key: 'users', label: 'Users', hint: 'User growth and activity' },
  { key: 'traffic', label: 'Traffic', hint: 'Acquisition and sources' },
  { key: 'performance', label: 'Performance', hint: 'System and KPI performance' },
  { key: 'reports', label: 'Reports', hint: 'Export and reporting' },
  { key: 'settings', label: 'Settings', hint: 'Dashboard preferences' },
]

const filteredSearchItems = computed(() => {
  const q = (props.search || '').trim().toLowerCase()
  if (!q) return []
  return quickSearchItems
    .filter(item => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q))
    .slice(0, 6)
})

const onSearchInput = (e) => {
  emit('update:search', e.target.value)
  showSearchMenu.value = true
}

const onSearchFocus = () => {
  if ((props.search || '').trim()) showSearchMenu.value = true
}

const onSearchKeydown = (e) => {
  if (e.key === 'Escape') {
    showSearchMenu.value = false
    return
  }

  if (e.key === 'Enter' && filteredSearchItems.value.length > 0) {
    e.preventDefault()
    selectSearchItem(filteredSearchItems.value[0])
  }
}

const selectSearchItem = (item) => {
  emit('update:search', '')
  emit('navigate', item.key)
  showSearchMenu.value = false
}

// ── User info from token ──────────────────────────────────────────────────────
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user_info')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const userInfo = computed(() => {
  const token = localStorage.getItem('token')
  const payload = token ? parseJwt(token) : null
  const stored = getStoredUser()
  return {
    name: payload?.name || stored?.name || 'User',
    email: payload?.email || stored?.email || '',
    role: payload?.role || stored?.role || 'Analytics User',
  }
})

const initials = computed(() => {
  const parts = userInfo.value.name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : userInfo.value.name.slice(0, 2).toUpperCase()
})

// ── Notifications ────────────────────────────────────────────────────────────
const showNotifMenu = ref(false)

const notifications = ref([
  {
    id: 1,
    read: false,
    icon: 'revenue',
    title: 'Revenue milestone reached',
    body: 'Monthly revenue exceeded ₹10,000 for the first time.',
    time: '2 min ago',
  },
  {
    id: 2,
    read: false,
    icon: 'traffic',
    title: 'Traffic spike detected',
    body: 'Sessions are up 240% compared to yesterday.',
    time: '18 min ago',
  },
  {
    id: 3,
    read: false,
    icon: 'data',
    title: 'New data seeded',
    body: '20 analytics records were added to the database.',
    time: '1 hr ago',
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleNotif = () => {
  showNotifMenu.value = !showNotifMenu.value
  showProfileMenu.value = false
}

const markRead = (id) => {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}

const markAllRead = () => {
  notifications.value.forEach(n => { n.read = true })
}

// ── Profile dropdown ──────────────────────────────────────────────────────────
const showProfileMenu = ref(false)

const toggleProfile = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifMenu.value = false
}

function closeOnOutside(e) {
  if (!e.target.closest('.profile-section')) showProfileMenu.value = false
  if (!e.target.closest('.notif-section'))   showNotifMenu.value = false
  if (!e.target.closest('.search-section'))  showSearchMenu.value = false
}

onMounted(() => document.addEventListener('click', closeOnOutside))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutside))

// ── Actions ───────────────────────────────────────────────────────────────────
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_info')
  showProfileMenu.value = false
  router.push('/login')
}

const goToSettings = () => {
  showProfileMenu.value = false
  emit('navigate', 'settings')
}

</script>


<template>
  <header class="navbar">

    <!-- LEFT -->
    <div class="navbar-left">

      <h2 class="logo">
        AnalyticsPro
      </h2>

    </div>


    <!-- CENTER SEARCH -->
    <div class="navbar-center">

      <div class="search-section">

        <div class="search-box">

          <Search
            size="18"
            class="search-icon"
          />

          <input
            :value="props.search"
            @input="onSearchInput"
            @focus="onSearchFocus"
            @keydown="onSearchKeydown"
            class="search-input"
            placeholder="Search analytics..."
          />

        </div>

        <div
          v-if="showSearchMenu && filteredSearchItems.length"
          class="search-menu"
        >
          <button
            v-for="item in filteredSearchItems"
            :key="item.key"
            class="search-item"
            @click="selectSearchItem(item)"
          >
            <div class="search-item-title">{{ item.label }}</div>
            <div class="search-item-hint">{{ item.hint }}</div>
          </button>
        </div>

      </div>

    </div>


    <!-- RIGHT -->
    <div class="navbar-right">

      <!-- NOTIFICATION -->
      <div class="notif-section">

        <button
          class="icon-button"
          :class="{ 'icon-button--active': showNotifMenu }"
          title="Notifications"
          @click.stop="toggleNotif"
        >
          <span :class="['bell-wrap', { 'bell-ring': unreadCount > 0 && !showNotifMenu }]">
            <Bell size="20" />
          </span>
          <span v-if="unreadCount > 0" class="notif-badge notif-badge--pulse">{{ unreadCount }}</span>
        </button>

        <!-- NOTIF DROPDOWN -->
        <div v-if="showNotifMenu" class="notif-menu">

          <div class="notif-menu-header">
            <span class="notif-menu-title">Notifications</span>
            <button v-if="unreadCount > 0" class="notif-mark-all" @click="markAllRead">Mark all read</button>
          </div>

          <div class="notif-list">
            <div
              v-for="n in notifications"
              :key="n.id"
              class="notif-item"
              :class="{ 'notif-item--unread': !n.read }"
              @click="markRead(n.id)"
            >
              <div class="notif-icon" :data-icon="n.icon">
                <svg v-if="n.icon === 'revenue'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <svg v-else-if="n.icon === 'traffic'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </div>
              <div class="notif-body">
                <p class="notif-title">{{ n.title }}</p>
                <p class="notif-desc">{{ n.body }}</p>
                <span class="notif-time">{{ n.time }}</span>
              </div>
              <span v-if="!n.read" class="unread-dot" />
            </div>
          </div>

          <div v-if="unreadCount === 0" class="notif-empty">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            All caught up!
          </div>

        </div>

      </div>


      <!-- PROFILE -->
      <div class="profile-section">

        <button class="profile-trigger" @click.stop="toggleProfile">
          <div class="avatar">{{ initials }}</div>
          <div class="profile-info">
            <span class="profile-name">{{ userInfo.name }}</span>
          </div>
          <ChevronDown size="14" class="chevron" :class="{ rotated: showProfileMenu }" />
        </button>


        <!-- DROPDOWN -->
        <div v-if="showProfileMenu" class="profile-menu">

          <!-- User info header -->
          <div class="menu-header">
            <div class="menu-avatar">{{ initials }}</div>
            <div class="menu-user-info">
              <p class="menu-name">{{ userInfo.name }}</p>
              <p class="menu-email">{{ userInfo.email || 'No email' }}</p>
              <span class="menu-role">{{ userInfo.role }}</span>
            </div>
          </div>

          <div class="menu-divider" />

          <!-- Menu items -->
          <button class="menu-item" @click="goToSettings">
            <Settings size="15" />
            <span>Settings</span>
          </button>

          <button class="menu-item" disabled>
            <Shield size="15" />
            <span>Security</span>
            <span class="menu-tag">Soon</span>
          </button>

          <div class="menu-divider" />

          <button class="menu-item danger" @click="logout">
            <LogOut size="15" />
            <span>Log out</span>
          </button>

        </div>

      </div>

    </div>

  </header>
</template>


<style scoped>
.navbar {
  grid-column: 1 / -1;
  grid-row: 1;
  height: 60px;
  background: #111827;
  border-bottom: 1px solid #1e293b;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;
}

.logo {
  color: #f8fafc;
  font-size: 20px;
  font-weight: 700;
}

.navbar-center {
  flex: 1;

  display: flex;
  justify-content: center;
}

.search-section {
  width: 100%;
  max-width: 420px;
  position: relative;
}

.search-box {
  width: 100%;

  background: #0f172a;
  border: 1px solid #334155;

  border-radius: 10px;

  display: flex;
  align-items: center;

  padding: 10px 14px;
}

.search-icon {
  color: #64748b;
  margin-right: 10px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;

  width: 100%;

  color: #f8fafc;
  font-size: 14px;
}

.search-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.45);
  z-index: 320;
}

.search-item {
  width: 100%;
  background: transparent;
  border: 0;
  border-radius: 8px;
  text-align: left;
  padding: 8px 10px;
  cursor: pointer;
}

.search-item:hover {
  background: #0f172a;
}

.search-item-title {
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
}

.search-item-hint {
  color: #64748b;
  font-size: 11px;
  margin-top: 2px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-button {
  width: 40px;
  height: 40px;

  border-radius: 10px;

  background: #0f172a;
  border: 1px solid #334155;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: #f8fafc;

  transition: 0.2s ease;
}

.icon-button:hover {
  background: #1e293b;
}

.profile-section {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 6px 10px 6px 6px;
  cursor: pointer;
  color: #f8fafc;
  transition: background 0.15s, border-color 0.15s;
}

.profile-trigger:hover {
  background: #1e293b;
  border-color: #8b5cf6;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  user-select: none;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.profile-name {
  font-size: 13px;
  font-weight: 500;
  color: #f1f5f9;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  color: #64748b;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* ── Dropdown ─────────────────────────────────────────── */
.profile-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 240px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.55);
  z-index: 300;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 12px;
}

.menu-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.menu-user-info {
  min-width: 0;
}

.menu-name {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-email {
  font-size: 11px;
  color: #64748b;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-role {
  font-size: 10px;
  font-weight: 500;
  background: rgba(139,92,246,0.15);
  color: #a78bfa;
  border-radius: 4px;
  padding: 2px 6px;
}

.menu-divider {
  height: 1px;
  background: #1e293b;
  margin: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 8px;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;
}

.menu-item:hover:not(:disabled) {
  background: #1e293b;
  color: #f1f5f9;
}

.menu-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.menu-item.danger { color: #f87171; }
.menu-item.danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

.menu-tag {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  background: #1e293b;
  color: #64748b;
  border-radius: 4px;
  padding: 1px 6px;
}

/* ── Notification bell ─────────────────────────────────── */
.notif-section {
  position: relative;
}

.icon-button {
  position: relative;
}

.icon-button--active {
  background: #1e293b;
  border-color: #8b5cf6;
  color: #a78bfa;
}

@keyframes bell-ring {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(18deg); }
  20%  { transform: rotate(-16deg); }
  30%  { transform: rotate(14deg); }
  40%  { transform: rotate(-10deg); }
  50%  { transform: rotate(6deg); }
  60%  { transform: rotate(-4deg); }
  70%  { transform: rotate(2deg); }
  80%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  50%       { transform: scale(1.15); box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
}

.bell-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: top center;
}

.bell-ring {
  animation: bell-ring 1.8s ease-in-out infinite;
  animation-delay: 0.5s;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ef4444;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.notif-badge--pulse {
  animation: badge-pulse 2s ease-in-out infinite;
}

/* ── Notification dropdown ─────────────────────────────── */
.notif-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.55);
  z-index: 300;
  overflow: hidden;
}

.notif-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #1e293b;
}

.notif-menu-title {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
}

.notif-mark-all {
  font-size: 11px;
  color: #8b5cf6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.notif-mark-all:hover { color: #a78bfa; }

.notif-list { max-height: 300px; overflow-y: auto; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #1e293b;
  transition: background 0.12s;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: #1a2233; }
.notif-item--unread { background: rgba(139,92,246,0.04); }

.notif-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.notif-icon[data-icon="revenue"] { background: rgba(34,197,94,0.12);  color: #22c55e; }
.notif-icon[data-icon="traffic"] { background: rgba(245,158,11,0.12); color: #f59e0b; }
.notif-icon[data-icon="data"]    { background: rgba(139,92,246,0.12); color: #8b5cf6; }

.notif-body { flex: 1; min-width: 0; }

.notif-title {
  font-size: 13px;
  font-weight: 500;
  color: #f1f5f9;
  margin: 0 0 2px;
}

.notif-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 4px;
  line-height: 1.4;
}

.notif-time {
  font-size: 11px;
  color: #475569;
}

.unread-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8b5cf6;
  flex-shrink: 0;
  margin-top: 4px;
}

.notif-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  font-size: 13px;
  color: #475569;
}
</style>