<script setup>
import { computed } from 'vue'

const modelValue = defineModel({
  type: [String, Number],
  default: '',
})

const { size, disabled, error, placeholder, options } = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
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
  options: {
    type: Array,
    default: () => [],
    validator: (value) =>
      value.every((item) => typeof item === 'object' && 'label' in item && 'value' in item),
  },
})

const wrapperClass = computed(() => ({
  'ms-select--disabled': disabled,
  'ms-select--error': error,
  [`ms-select--${size}`]: true,
}))

const handleChange = (event) => {
  modelValue.value = event.target.value
}
</script>

<template>
  <div class="ms-select" :class="wrapperClass">
    <select
      :value="modelValue"
      class="ms-select__field"
      :disabled="disabled"
      @change="handleChange"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="ms-select__caret" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.ms-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  background-color: white;
  transition: all 0.3s;
}

.ms-select:hover:not(.ms-select--disabled) {
  border-color: #40a9ff;
}

.ms-select__field {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 0;
  font-size: 14px;
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  padding-right: 24px;
}

.ms-select--small .ms-select__field {
  padding: 4px 0;
  font-size: 12px;
}

.ms-select--large .ms-select__field {
  padding: 12px 0;
  font-size: 16px;
}

.ms-select__caret {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #595959;
}

.ms-select--disabled {
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.ms-select--disabled .ms-select__field {
  color: #bfbfbf;
  cursor: not-allowed;
}

.ms-select--error {
  border-color: #ff4d4f;
}

.ms-select--error .ms-select__caret {
  border-top-color: #ff4d4f;
}
</style>
