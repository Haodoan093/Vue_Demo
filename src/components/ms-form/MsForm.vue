<script setup>
import MsInput from '@/components/ms-input/MsInput.vue'

//#region Props
const props = defineProps({
  /**
   * Dữ liệu form (v-model)
   * @type {Object}
   * @default {}
   */
  modelValue: {
    type: Object,
    default: () => ({}),
  },

  /**
   * Danh sách field cần render
   * @type {Array<Object>}
   * @default []
   * @example
   * [
   *   { key: 'fullName', label: 'Họ và tên', type: 'text', required: true },
   *   { key: 'email', label: 'Email', type: 'email' },
   *   { key: 'gender', label: 'Giới tính', type: 'select', options: [...] }
   * ]
   */
  fields: {
    type: Array,
    default: () => [],
  },

  /**
   * Hiển thị loading state
   * @type {Boolean}
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },

  /**
   * Custom form class
   * @type {String}
   * @default ''
   */
  formClass: {
    type: String,
    default: '',
  },
})
//#endregion

//#region Emits
const emit = defineEmits(['update:modelValue', 'submit', 'change'])
//#endregion

//#region Methods
/**
 * Xử lý thay đổi giá trị form field
 * @param {string} key - Key field
 * @param {any} value - Giá trị mới
 * @createdBy: pdthien - 24.12.2025
 */
const handleFieldChange = (key, value) => {
  const newValue = {
    ...props.modelValue,
    [key]: value,
  }
  emit('update:modelValue', newValue)
  emit('change', { key, value })
}

/**
 * Xử lý submit form
 * @param {Event} event - Event
 * @createdBy: pdthien - 24.12.2025
 */
const handleSubmit = (event) => {
  event.preventDefault()
  emit('submit', props.modelValue)
}

/**
 * Lấy giá trị field từ modelValue
 * @param {string} key - Key field
 * @returns {any} - Giá trị field
 * @createdBy: pdthien - 24.12.2025
 */
const getFieldValue = (key) => {
  return props.modelValue?.[key] ?? ''
}

/**
 * Kiểm tra field có required không
 * @param {Object} field - Field config
 * @returns {boolean} - True nếu required
 * @createdBy: pdthien - 24.12.2025
 */
const isFieldRequired = (field) => {
  return field?.required === true
}
//#endregion
</script>

<template>
  <form :class="['ms-form', formClass]" @submit="handleSubmit">
    <div class="ms-form__fields">
      <div
        v-for="field in fields"
        :key="field.key"
        class="ms-form__group"
        :class="{ 'ms-form__group--full': field.fullWidth }"
      >
        <!-- Label -->
        <label v-if="field.label" class="ms-form__label">
          {{ field.label }}
          <span v-if="isFieldRequired(field)" class="ms-form__required">*</span>
        </label>

        <!-- Text Input -->
        <template v-if="['text', 'email', 'phone', 'number', 'password'].includes(field.type)">
          <MsInput
            :model-value="getFieldValue(field.key)"
            :type="field.type || 'text'"
            :placeholder="field.placeholder"
            :disabled="field.disabled || loading"
            :required="field.required"
            @update:model-value="handleFieldChange(field.key, $event)"
          />
        </template>

        <!-- Date Input -->
        <template v-else-if="field.type === 'date'">
          <input
            :value="getFieldValue(field.key)"
            type="date"
            class="ms-form__input"
            :disabled="field.disabled || loading"
            :required="field.required"
            @change="handleFieldChange(field.key, $event.target.value)"
          />
        </template>

        <!-- Textarea -->
        <template v-else-if="field.type === 'textarea'">
          <textarea
            :value="getFieldValue(field.key)"
            :placeholder="field.placeholder"
            :rows="field.rows || 4"
            class="ms-form__textarea"
            :disabled="field.disabled || loading"
            :required="field.required"
            @change="handleFieldChange(field.key, $event.target.value)"
          ></textarea>
        </template>

        <!-- Select -->
        <template v-else-if="field.type === 'select'">
          <select
            :value="getFieldValue(field.key)"
            class="ms-form__select"
            :disabled="field.disabled || loading"
            :required="field.required"
            @change="handleFieldChange(field.key, $event.target.value)"
          >
            <option v-if="!field.required" value="">
              {{ field.placeholder || 'Chọn giá trị' }}
            </option>
            <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </template>

        <!-- Radio -->
        <template v-else-if="field.type === 'radio'">
          <div class="ms-form__radio-group">
            <label v-for="opt in field.options" :key="opt.value" class="ms-form__radio">
              <input
                type="radio"
                :name="field.key"
                :value="opt.value"
                :checked="getFieldValue(field.key) === opt.value"
                :disabled="field.disabled || loading"
                @change="handleFieldChange(field.key, $event.target.value)"
              />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </template>

        <!-- Checkbox -->
        <template v-else-if="field.type === 'checkbox'">
          <div class="ms-form__checkbox-group">
            <label v-for="opt in field.options" :key="opt.value" class="ms-form__checkbox">
              <input
                type="checkbox"
                :value="opt.value"
                :checked="(getFieldValue(field.key) || []).includes(opt.value)"
                :disabled="field.disabled || loading"
                @change="
                  (e) => {
                    const arr = getFieldValue(field.key) || []
                    if (e.target.checked) {
                      handleFieldChange(field.key, [...arr, opt.value])
                    } else {
                      handleFieldChange(
                        field.key,
                        arr.filter((v) => v !== opt.value),
                      )
                    }
                  }
                "
              />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </template>

        <!-- Error message -->
        <div v-if="field.error" class="ms-form__error">{{ field.error }}</div>
      </div>
    </div>

    <!-- Slot cho custom content -->
    <slot name="default"></slot>
  </form>
</template>

<style scoped>
.ms-form {
  width: 100%;
}

.ms-form__fields {
  display: grid;
  gap: 16px;
}

.ms-form__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ms-form__group--full {
  grid-column: 1 / -1;
}

.ms-form__label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  display: flex;
  gap: 2px;
}

.ms-form__required {
  color: #ff4d4f;
}

.ms-form__input,
.ms-form__select,
.ms-form__textarea {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
}

.ms-form__input:hover,
.ms-form__select:hover,
.ms-form__textarea:hover {
  border-color: #40a9ff;
}

.ms-form__input:focus,
.ms-form__select:focus,
.ms-form__textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.ms-form__input:disabled,
.ms-form__select:disabled,
.ms-form__textarea:disabled {
  background-color: #f5f5f5;
  color: #bfbfbf;
  cursor: not-allowed;
}

.ms-form__textarea {
  resize: vertical;
  min-height: 80px;
}

.ms-form__radio-group,
.ms-form__checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ms-form__radio,
.ms-form__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.ms-form__radio input,
.ms-form__checkbox input {
  cursor: pointer;
}

.ms-form__radio input:disabled,
.ms-form__checkbox input:disabled {
  cursor: not-allowed;
}

.ms-form__error {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
}
</style>
