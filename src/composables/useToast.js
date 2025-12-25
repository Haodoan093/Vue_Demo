import { ref } from 'vue'

/**
 * Toast notification composable
 * @createdBy: dchao - 25.12.2025
 */

const toasts = ref([])
let toastId = 0

/**
 * Toast types
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

/**
 * Add a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.message - Toast message
 * @param {string} options.type - Toast type (success, error, warning, info)
 * @param {number} options.duration - Duration in ms (default: 3000)
 * @param {string} options.title - Optional title
 */
function addToast(options) {
  const id = ++toastId
  const toast = {
    id,
    message: options.message || '',
    type: options.type || TOAST_TYPES.INFO,
    duration: options.duration ?? 3000,
    title: options.title || getDefaultTitle(options.type),
    createdAt: Date.now(),
  }

  toasts.value.push(toast)

  // Auto remove after duration
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration)
  }

  return id
}

/**
 * Remove a toast by id
 * @param {number} id - Toast id
 */
function removeToast(id) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

/**
 * Clear all toasts
 */
function clearToasts() {
  toasts.value = []
}

/**
 * Get default title based on type
 * @param {string} type - Toast type
 */
function getDefaultTitle(type) {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return 'Thành công'
    case TOAST_TYPES.ERROR:
      return 'Lỗi'
    case TOAST_TYPES.WARNING:
      return 'Cảnh báo'
    case TOAST_TYPES.INFO:
    default:
      return 'Thông báo'
  }
}

/**
 * Shortcut methods
 */
function success(message, options = {}) {
  return addToast({ ...options, message, type: TOAST_TYPES.SUCCESS })
}

function error(message, options = {}) {
  return addToast({ ...options, message, type: TOAST_TYPES.ERROR })
}

function warning(message, options = {}) {
  return addToast({ ...options, message, type: TOAST_TYPES.WARNING })
}

function info(message, options = {}) {
  return addToast({ ...options, message, type: TOAST_TYPES.INFO })
}

export function useToast() {
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }
}
