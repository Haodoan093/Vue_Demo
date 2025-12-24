<script setup>
import MsButton from '@/components/ms-button/MsButton.vue'
defineProps({
  selectedCount: {
    type: Number,
    default: 0,
  },
})

defineEmits(['clear', 'send-email', 'manage-tags', 'create-job', 'add-campaign', 'delete', 'more'])
</script>

<template>
  <div class="toolbar-grid-selected">
    <div class="toolbar-grid-left d-flex align-items-center">
      <div class="selection-count">
        <strong>{{ selectedCount }}</strong> đang chọn
      </div>
      <MsButton variant="link" extra-class="btn-link m-l-12" @click="$emit('clear')"
        >Bỏ chọn</MsButton
      >
    </div>

    <div class="toolbar-grid-right d-flex align-items-center">
      <MsButton
        variant="secondary-2"
        title="Gửi email"
        icon-class="icon-email"
        extra-class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
        @click="$emit('send-email')"
      >
        Gửi email
      </MsButton>

      <MsButton
        variant="secondary-2"
        title="Quản lý thẻ"
        icon-class="icon-tag"
        extra-class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
        @click="$emit('manage-tags')"
      >
        Quản lý thẻ
      </MsButton>

      <MsButton
        variant="secondary-2"
        title="Tạo công việc"
        icon-class="icon-document-check"
        extra-class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
        @click="$emit('create-job')"
      >
        Tạo công việc
      </MsButton>

      <MsButton
        variant="secondary-2"
        title="Thêm vào chiến dịch"
        icon-class="icon-sb-recruiment-campaign"
        extra-class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
        @click="$emit('add-campaign')"
      >
        Thêm vào chiến dịch
      </MsButton>

      <MsButton
        variant="secondary-2"
        title="Xóa ứng viên"
        icon-class="icon-delete"
        extra-class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
        @click="$emit('delete')"
      >
        Xóa ứng viên
      </MsButton>

      <MsButton
        variant="secondary-2"
        title="Thêm tùy chọn"
        icon-class="icon-more-vertical"
        extra-class="btn btn-secondary-2"
        @click="$emit('more')"
      >
      </MsButton>
    </div>
  </div>
</template>

<style scoped>
.toolbar-grid-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.toolbar-grid-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selection-count {
  font-size: 14px;
  color: #262626;
}

.selection-count strong {
  font-weight: 600;
  color: #1890ff;
}

.btn-link {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: none;
  transition: color 0.3s;
}

.btn-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.toolbar-grid-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-secondary-2 {
  background-color: #fff;
  color: #262626;
}

.btn-secondary-2:hover {
  border-color: #40a9ff;
  color: #1890ff;
}

.m-r-8 {
  margin-right: 8px;
}

.m-l-12 {
  margin-left: 12px;
}

.wrap-icon-button-toolbar {
  padding: 4px 8px;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}
</style>
