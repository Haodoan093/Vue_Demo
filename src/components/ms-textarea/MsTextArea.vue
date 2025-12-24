<script setup>
import { computed } from 'vue'

//#region Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: null,
  },
})
//#endregion

//#region Emits
const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change'])
//#endregion

//#region Computed
const hasError = computed(() => !!props.error)

const charCount = computed(() => props.modelValue.length)

// const isMaxed = computed(() => props.maxLength && charCount.value >= props.maxLength)
//#endregion

//#region Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}
//#endregion
</script>

<template>
  <div class="ms-textarea">
    <label v-if="label" class="ms-textarea__label">
      {{ label }}
      <span v-if="required" class="ms-textarea__required">*</span>
    </label>
    <div class="ms-textarea__wrapper">
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :class="['ms-textarea__field', { 'ms-textarea__field--error': hasError }]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-if="maxLength" class="ms-textarea__counter">{{ charCount }}/{{ maxLength }}</div>
    </div>
    <p v-if="error" class="ms-textarea__error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.ms-textarea {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ms-textarea__label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ms-textarea__required {
  color: #d32f2f;
}

.ms-textarea__wrapper {
  position: relative;
}

.ms-textarea__field {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  color: #333;
  resize: vertical;
  transition: all 0.3s;
}

.ms-textarea__field:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.ms-textarea__field:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.ms-textarea__field--error {
  border-color: #d32f2f;
}

.ms-textarea__field--error:focus {
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.1);
}

.ms-textarea__counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.ms-textarea__error {
  font-size: 12px;
  color: #d32f2f;
  margin: 0;
}
</style>
