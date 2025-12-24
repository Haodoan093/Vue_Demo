<script setup>
import { computed } from 'vue'

const modelValue = defineModel({
  type: [String, Number],
  default: '',
})
const { size, disabled, readonly, error, placeholder } = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
})
const wrapperClass = computed(() => ({
  'ms-input--disabled': disabled,
  'ms-input--error': error,
  [`ms-input--${size}`]: true,
}))
const handleInput = (event) => {
  modelValue.value = event.target.value
}
</script>

<template>
  <div class="ms-input" :class="wrapperClass">
    <slot name="prepend"></slot>
    <input
      :value="modelValue"
      type="text"
      class="ms-input__field"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
    />
    <slot name="append"></slot>
  </div>
</template>

<style scoped>
.ms-input {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  transition: all 0.3s;
}

.ms-input:hover:not(.ms-input--disabled) {
  border-color: #40a9ff;
}

.ms-input:focus-within:not(.ms-input--disabled) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ms-input__field {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 0;
  font-size: 14px;
}

.ms-input--small .ms-input__field {
  padding: 4px 0;
  font-size: 12px;
}

.ms-input--large .ms-input__field {
  padding: 12px 0;
  font-size: 16px;
}

.ms-input--disabled {
  cursor: not-allowed;
}

.ms-input--disabled .ms-input__field {
  color: #bfbfbf;
  cursor: not-allowed;
}

.ms-input--error {
  border-color: #ff4d4f;
}

.ms-input__clear {
  background: none;
  border: none;
  color: #bfbfbf;
  cursor: pointer;
  padding: 0 4px;
  font-size: 14px;
  transition: color 0.3s;
}

.ms-input__clear:hover {
  color: #262626;
}

.ms-input__clear:disabled {
  cursor: not-allowed;
  color: #d9d9d9;
}
</style>
