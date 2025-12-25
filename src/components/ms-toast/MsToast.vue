<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

/**
 * Get icon class based on toast type
 */
function getIconClass(type) {
  switch (type) {
    case 'success':
      return 'icon-check-circle'
    case 'error':
      return 'icon-close-circle'
    case 'warning':
      return 'icon-warning'
    case 'info':
    default:
      return 'icon-info-circle'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="ms-toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="ms-toast"
          :class="[`ms-toast--${toast.type}`]"
          role="alert"
        >
          <div class="ms-toast__icon">
            <i :class="getIconClass(toast.type)"></i>
          </div>
          <div class="ms-toast__content">
            <div v-if="toast.title" class="ms-toast__title">{{ toast.title }}</div>
            <div class="ms-toast__message">{{ toast.message }}</div>
          </div>
          <button
            type="button"
            class="ms-toast__close"
            aria-label="Đóng"
            @click="removeToast(toast.id)"
          >
            <i class="icon-close"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.ms-toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.ms-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 1px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  animation: slideIn 0.3s ease;
}

.ms-toast__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.ms-toast--success .ms-toast__icon {
  color: #52c41a;
}

.ms-toast--error .ms-toast__icon {
  color: #ff4d4f;
}

.ms-toast--warning .ms-toast__icon {
  color: #faad14;
}

.ms-toast--info .ms-toast__icon {
  color: #1890ff;
}

.ms-toast__content {
  flex: 1;
  min-width: 0;
}

.ms-toast__title {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  margin-bottom: 4px;
}

.ms-toast__message {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  word-wrap: break-word;
}

.ms-toast__close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #8c8c8c;
  padding: 0;
  transition: color 0.2s;
}

.ms-toast__close:hover {
  color: #262626;
}

/* Success variant */
.ms-toast--success {
  border-left: 4px solid #52c41a;
}

/* Error variant */
.ms-toast--error {
  border-left: 4px solid #ff4d4f;
}

/* Warning variant */
.ms-toast--warning {
  border-left: 4px solid #faad14;
}

/* Info variant */
.ms-toast--info {
  border-left: 4px solid #1890ff;
}

/* Transition animations */
.toast-enter-active {
  animation: slideIn 0.3s ease;
}

.toast-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
