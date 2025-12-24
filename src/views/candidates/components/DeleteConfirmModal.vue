<script setup>
//#region Props
defineProps({
  /**
   * Hiển thị/ẩn modal
   * @type {Boolean}
   * @default false
   */
  visible: {
    type: Boolean,
    default: false,
  },

  /**
   * Số lượng item cần xóa
   * @type {Number}
   * @default 1
   */
  count: {
    type: Number,
    default: 1,
  },

  /**
   * Loading state
   * @type {Boolean}
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },
})
//#endregion

//#region Emits
const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
//#endregion

//#region Methods
/**
 * Xử lý xác nhận xóa
 * @createdBy: dchao - 24.12.2025
 */
const handleConfirm = () => {
  emit('confirm')
}

/**
 * Xử lý hủy xóa
 * @createdBy: dchao - 24.12.2025
 */
const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
//#endregion
</script>

<template>
  <div
    v-if="visible"
    class="delete-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="deleteModalTitle"
  >
    <!-- Overlay -->
    <div class="delete-modal__overlay" @click="handleCancel"></div>

    <!-- Card -->
    <div class="delete-modal__card">
      <!-- Icon -->
      <div class="delete-modal__icon">
        <i class="icon-delete"></i>
      </div>

      <!-- Title -->
      <h2 id="deleteModalTitle" class="delete-modal__title">
        Xác nhận xóa {{ count > 1 ? count + ' ứng viên' : 'ứng viên' }}
      </h2>

      <!-- Message -->
      <p class="delete-modal__message">
        Bạn có chắc chắn muốn xóa
        <span class="delete-modal__highlight">{{ count }}</span>
        ứng viên? Hành động này không thể hoàn tác.
      </p>

      <!-- Actions -->
      <div class="delete-modal__actions">
        <button
          type="button"
          class="delete-modal__btn delete-modal__btn--cancel"
          :disabled="loading"
          @click="handleCancel"
        >
          Hủy
        </button>
        <button
          type="button"
          class="delete-modal__btn delete-modal__btn--danger"
          :disabled="loading"
          @click="handleConfirm"
        >
          <span v-if="!loading">Xóa</span>
          <span v-else>Đang xóa...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.delete-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

.delete-modal__card {
  position: relative;
  background: white;
  border-radius: 4px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  padding: 32px 24px;
  width: min(400px, calc(100vw - 48px));
  text-align: center;
  animation: slideUp 0.3s ease;
}

.delete-modal__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background-color: #fff1f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ff4d4f;
}

.delete-modal__title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px;
}

.delete-modal__message {
  font-size: 14px;
  color: #595959;
  margin: 0 0 24px;
  line-height: 1.5;
}

.delete-modal__highlight {
  font-weight: 600;
  color: #ff4d4f;
}

.delete-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.delete-modal__btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
}

.delete-modal__btn--cancel {
  background-color: #f5f5f5;
  color: #262626;
  border: 1px solid #d9d9d9;
}

.delete-modal__btn--cancel:hover:not(:disabled) {
  background-color: #efefef;
  border-color: #b3b3b3;
}

.delete-modal__btn--danger {
  background-color: #ff4d4f;
  color: white;
}

.delete-modal__btn--danger:hover:not(:disabled) {
  background-color: #ff7875;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.delete-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
