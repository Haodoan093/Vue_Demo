<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:collapsed'])

const isCollapsed = computed({
  get: () => props.collapsed,
  set: (value) => emit('update:collapsed', value),
})

const items = [
  { icon: 'icon-sb-recruiment', label: 'Tin tuyển dụng', href: '#' },
  { icon: 'icon-sb-candidate', label: 'Ứng viên', href: '/' },
  { icon: 'icon-sb-calendar', label: 'Lịch', href: '#' },
  { icon: 'icon-sb-talent-pools', label: 'Kho tiềm năng', href: '#' },
  { icon: 'icon-sb-recruiment-campaign-active', label: 'Chiến dịch tuyển dụng', href: '#' },
  { icon: 'icon-sb-task', label: 'Công việc', href: '#' },
  { icon: 'icon-email-ai-marketing', label: 'aiMarketing', href: '#' },
  { icon: 'icon-chat-box', label: 'Trao đổi với ứng viên', href: '#' },
  { icon: 'icon-sb-report', label: 'Báo cáo', href: '#' },
  { icon: 'icon-sb-setting', label: 'Khác', href: '#' },
]

function isInternalLink(href) {
  return typeof href === 'string' && href.startsWith('/')
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('misa_sidebar_collapsed', isCollapsed.value ? '1' : '0')
}

onMounted(() => {
  const saved = localStorage.getItem('misa_sidebar_collapsed') === '1'
  emit('update:collapsed', saved)
})
</script>

<template>
  <div class="app-sidebar">
    <div id="sidebar" :class="isCollapsed ? 'sidebar-collapse-mode' : 'sidebar-expand-mode'">
      <div class="sidebar-item-list">
        <div class="sidebar-container">
          <div v-for="item in items" :key="item.label" class="sidebar-item pointer">
            <RouterLink v-if="isInternalLink(item.href)" :to="item.href">
              <div class="item-content d-flex h-100 align-items-center pos-relative">
                <div class="item-icon" :class="item.icon"></div>
                <div class="icon-text" :title="item.label">{{ item.label }}</div>
              </div>
            </RouterLink>
            <a v-else :href="item.href">
              <div class="item-content d-flex h-100 align-items-center pos-relative">
                <div class="item-icon" :class="item.icon"></div>
                <div class="icon-text" :title="item.label">{{ item.label }}</div>
              </div>
            </a>
          </div>
        </div>

        <div class="bottom-area pos-absolute w-100">
          <div class="collapse-btn d-flex align-items-center pointer border" @click="toggleSidebar">
            <div
              id="icon-left"
              class="item-icon"
              :class="isCollapsed ? 'icon-right' : 'icon-left'"
            ></div>
            <div class="icon-text text-content">{{ isCollapsed ? 'Mở rộng' : 'Thu gọn' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
