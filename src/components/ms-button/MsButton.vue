<script setup>
import { computed } from 'vue'

//#region Props
const props = defineProps({
  /**
   * Kiểu button: primary | secondary-2 | link | warning | danger
   * @type {String}
   * @default 'primary'
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary-2', 'link', 'warning', 'danger'].includes(value),
  },

  /**
   * CSS class cho icon (vd: "icon-add", "fa-plus")
   * @type {String}
   * @default ''
   */
  iconClass: {
    type: String,
    default: '',
  },

  /**
   * Vị trí icon: left | right
   * @type {String}
   * @default 'left'
   */
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },

  /**
   * HTML button type: button | submit | reset
   * @type {String}
   * @default 'button'
   */
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },

  /**
   * Trạng thái disabled
   * @type {Boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Tooltip text
   * @type {String}
   * @default ''
   */
  title: {
    type: String,
    default: '',
  },

  /**
   * Class bổ sung
   * @type {String|Array|Object}
   * @default ''
   */
  extraClass: {
    type: [String, Array, Object],
    default: '',
  },
})
//#endregion

//#region Computed
/**
 * Tính toán class button dựa trên variant
 * @returns {Array<String>} - Mảng class
 * createdby: pdthien - 24.12.2025
 */
const buttonClasses = computed(() => {
  const baseClasses = ['ms-button', `ms-button--${props.variant}`]

  if (props.disabled) {
    baseClasses.push('ms-button--disabled')
  }

  if (props.extraClass) {
    if (Array.isArray(props.extraClass)) {
      baseClasses.push(...props.extraClass)
    } else if (typeof props.extraClass === 'object') {
      baseClasses.push(...Object.keys(props.extraClass).filter((key) => props.extraClass[key]))
    } else {
      baseClasses.push(props.extraClass)
    }
  }

  return baseClasses
})

/**
 * Kiểm tra xem icon có ở bên trái không
 * @returns {Boolean}
 * createdby: pdthien - 24.12.2025
 */
const isIconLeft = computed(() => props.iconPosition === 'left' && props.iconClass)

/**
 * Kiểm tra xem icon có ở bên phải không
 * @returns {Boolean}
 * createdby: pdthien - 24.12.2025
 */
const isIconRight = computed(() => props.iconPosition === 'right' && props.iconClass)
//#endregion
</script>

<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled" :title="title">
    <i v-if="isIconLeft" :class="['ms-button__icon ms-button__icon--left', iconClass]"></i>

    <span v-if="$slots.default" class="ms-button__content">
      <slot />
    </span>

    <i v-if="isIconRight" :class="['ms-button__icon ms-button__icon--right', iconClass]"></i>
  </button>
</template>

<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
}

/* Variants */
.ms-button--primary {
  background-color: #1976d2;
  color: white;
}

.ms-button--primary:hover:not(:disabled) {
  background-color: #1565c0;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.ms-button--secondary-2 {
  background-color: #f5f5f5;
  color: #262626;
  border: 1px solid #d9d9d9;
}

.ms-button--secondary-2:hover:not(:disabled) {
  background-color: #efefef;
  border-color: #b3b3b3;
}

.ms-button--link {
  background: none;
  color: #1976d2;
  padding: 0;
}

.ms-button--link:hover:not(:disabled) {
  color: #1565c0;
  text-decoration: underline;
}

.ms-button--warning {
  background-color: #ff9800;
  color: white;
}

.ms-button--warning:hover:not(:disabled) {
  background-color: #f57c00;
}

.ms-button--danger {
  background-color: #dc3545;
  color: white;
}

.ms-button--danger:hover:not(:disabled) {
  background-color: #c82333;
}

/* States */
.ms-button:disabled,
.ms-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Elements */
.ms-button__icon {
  display: inline-flex;
  align-items: center;
  font-size: inherit;
}

.ms-button__content {
  display: inline-flex;
  align-items: center;
}
</style>
