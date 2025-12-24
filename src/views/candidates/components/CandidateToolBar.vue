<script setup>
import MsInput from '@/components/ms-input/MsInput.vue'

defineProps({
  query: {
    type: String,
    default: '',
  },
})

defineEmits(['update:query', 'filter', 'export', 'history', 'settings'])
</script>

<template>
  <div class="search-grid d-flex">
    <div class="search-ontab">
      <div class="texteditor-container wrap-icon-button-toolbar">
        <div class="button-container">
          <div class="ai-search">
            <div class="button-content">
              <i class="search"></i>
            </div>
          </div>
        </div>
        <div class="input-container">
          <MsInput
            :model-value="query"
            type="search"
            placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
            size="medium"
            @update:model-value="$emit('update:query', $event)"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="toolbar-grid-right">
    <div class="filter-area wrap-icon-button-toolbar m-r-8" title="Bộ lọc" @click="$emit('filter')">
      <div class="icon-filter ic-svg"></div>
    </div>
    <div class="wrap-icon-button-toolbar m-r-8" title="Xuất khẩu" @click="$emit('export')">
      <div class="icon-export ic-svg"></div>
    </div>
    <div
      class="wrap-icon-button-toolbar m-r-8"
      title="Xem nhanh hoạt động"
      @click="$emit('history')"
    >
      <div class="icon-interactive-history ic-svg"></div>
    </div>
    <div class="z-index-default dropdown" @click="$emit('settings')">
      <div class="wrap-icon-button-setting">
        <div class="icon-setting ic-svg"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-grid {
  display: flex;
}

.search-ontab {
  flex: 1;
}

.texteditor-container {
  display: flex;
  align-items: center;
}

.button-container {
  margin-right: 8px;
}

.ai-search {
  cursor: pointer;
  padding: 4px 8px;
}

.input-container {
  flex: 1;
}

.toolbar-grid-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wrap-icon-button-toolbar {
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.3s;
}

.wrap-icon-button-toolbar:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.icon-filter,
.icon-export,
.icon-interactive-history,
.icon-setting {
  font-size: 16px;
  color: #262626;
}

.m-r-8 {
  margin-right: 8px;
}
</style>
