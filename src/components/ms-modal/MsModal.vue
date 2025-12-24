<script setup>
import { computed, watch } from 'vue'
import MsButton from '@/components/ms-button/MsButton.vue'

//#region Props
const props = defineProps({
  /**
   * Tiêu đề modal
   * @type {String}
   * @default ''
   */
  title: {
    type: String,
    default: '',
  },

  /**
   * Hiển thị/ẩn modal (v-model)
   * @type {Boolean}
   * @default false
   */
  visible: {
    type: Boolean,
    default: false,
  },

  /**
   * Kích thước modal: small | medium | large
   * @type {String}
   * @default 'medium'
   */
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },

  /**
   * Hiển thị nút close
   * @type {Boolean}
   * @default true
   */
  closable: {
    type: Boolean,
    default: true,
  },

  /**
   * Có thể đóng bằng click overlay
   * @type {Boolean}
   * @default true
   */
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },

  /**
   * Text nút confirm
   * @type {String}
   * @default 'Xác nhận'
   */
  okText: {
    type: String,
    default: 'Xác nhận',
  },

  /**
   * Text nút cancel
   * @type {String}
   * @default 'Hủy'
   */
  cancelText: {
    type: String,
    default: 'Hủy',
  },

  /**
   * Hiển thị footer với nút action
   * @type {Boolean}
   * @default true
   */
  showFooter: {
    type: Boolean,
    default: true,
  },

  /**
   * Loading state của modal
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
const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'close'])
//#endregion

//#region Computed
/**
 * Tính toán modal class dựa trên size
 * @returns {Object} - Object chứa class
 * @createdBy: dchao - 24.12.2025
 */
const modalClasses = computed(() => ({
  'ms-modal': true,
  'ms-modal--hidden': !props.visible,
  [`ms-modal--${props.size}`]: true,
}))

/**
 * Tính toán card class
 * @returns {Object} - Object chứa class
 * @createdBy: dchao - 24.12.2025
 */
const cardClasses = computed(() => ({
  'ms-modal__card': true,
  'ms-modal__card--loading': props.loading,
}))
//#endregion

//#region Methods
/**
 * Xử lý đóng modal (click overlay)
 * @createdBy: dchao - 24.12.2025
 */
const handleOverlayClick = () => {
  if (!props.closeOnOverlay) return
  handleClose()
}

/**
 * Xử lý đóng modal
 * @createdBy: dchao - 24.12.2025
 */
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

/**
 * Xử lý confirm
 * @createdBy: dchao - 24.12.2025
 */
const handleConfirm = () => {
  emit('confirm')
}

/**
 * Xử lý cancel
 * @createdBy: dchao - 24.12.2025
 */
const handleCancel = () => {
  emit('cancel')
  handleClose()
}

/**
 * Xử lý escape key
 * @param {KeyboardEvent} e - Event
 * @createdBy: dchao - 24.12.2025
 */
const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && props.visible && props.closable) {
    handleClose()
  }
}
//#endregion

//#region Watchers
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'auto'
    }
  },
)
//#endregion
</script>

<template>
  <div :class="modalClasses">
    <!-- Overlay -->
    <div class="ms-modal__overlay" @click="handleOverlayClick"></div>

    <!-- Modal Card -->
    <div :class="cardClasses">
      <!-- Header -->
      <div class="ms-modal__header">
        <h2 v-if="title" class="ms-modal__title">{{ title }}</h2>

        <slot name="header">
          <h2 v-if="!title" class="ms-modal__title"></h2>
        </slot>

        <MsButton
          v-if="closable"
          variant="secondary-2"
          title="Đóng"
          extra-class="ms-modal__close-btn"
          @click="handleClose"
        >
          ×
        </MsButton>
      </div>

      <!-- Body -->
      <div class="ms-modal__body">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div v-if="showFooter" class="ms-modal__footer">
        <slot name="footer">
          <MsButton variant="secondary-2" :disabled="loading" @click="handleCancel">
            {{ cancelText }}
          </MsButton>
          <MsButton variant="primary" :disabled="loading" @click="handleConfirm">
            {{ okText }}
          </MsButton>
        </slot>
      </div>

      <!-- Loading overlay -->
      <div v-if="loading" class="ms-modal__loading">
        <div class="ms-modal__spinner"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ms-modal {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.ms-modal--hidden {
  display: none;
  opacity: 0;
  pointer-events: none;
}

/* Overlay */
.ms-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  animation: fadeIn 0.2s ease;
}

/* Card */
.ms-modal__card {
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

/* Size variants */
.ms-modal--small .ms-modal__card {
  width: min(400px, calc(100vw - 48px));
}

.ms-modal--medium .ms-modal__card {
  width: min(570px, calc(100vw - 48px));
}

.ms-modal--large .ms-modal__card {
  width: min(560px, calc(100vw - 48px));
}

/* Header */
.ms-modal__header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  flex-shrink: 0;
  gap: 16px;
}

.ms-modal__title {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  flex: 1;
}

.ms-modal__close-btn {
  font-size: 24px;
  padding: 4px 8px;
  color: #8c8c8c;
  min-width: 36px;
}

.ms-modal__close-btn:hover {
  color: #262626;
  background-color: #f5f5f5;
}

/* Body */
.ms-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Footer */
.ms-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e6e6e6;
  background-color: #fafafa;
  flex-shrink: 0;
}

/* Loading state */
.ms-modal__card--loading .ms-modal__body,
.ms-modal__card--loading .ms-modal__footer {
  opacity: 0.6;
  pointer-events: none;
}

.ms-modal__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  z-index: 10;
}

.ms-modal__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Animations */
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar styling */
.ms-modal__body::-webkit-scrollbar {
  width: 8px;
}

.ms-modal__body::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.ms-modal__body::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

.ms-modal__body::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
