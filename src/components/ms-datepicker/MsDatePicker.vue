<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const modelValue = defineModel({
  type: String,
  default: '',
})

const props = defineProps({
  placeholder: {
    type: String,
    default: 'dd/MM/yyyy',
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
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  min: {
    type: String,
    default: '',
  },
  max: {
    type: String,
    default: '',
  },
})

const showPicker = ref(false)
const inputRef = ref(null)
const pickerRef = ref(null)

// Current view state
const viewMode = ref('days') // 'days', 'months', 'years'
const viewDate = ref(new Date())

// Days of week
const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Months
const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

// Parse date string (yyyy-MM-dd) to Date object
function parseDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

// Format Date object to yyyy-MM-dd
function formatDate(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Format Date object to dd/MM/yyyy for display
function formatDisplayDate(date) {
  if (!date) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Selected date
const selectedDate = computed(() => parseDate(modelValue.value))

// Display value
const displayValue = computed(() => {
  return selectedDate.value ? formatDisplayDate(selectedDate.value) : ''
})

// Calendar days
const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days = []

  // Previous month days
  const startDayOfWeek = firstDay.getDay()
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    })
  }

  // Current month days
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const isToday = date.getTime() === today.getTime()
    const isSelected = selectedDate.value && date.getTime() === selectedDate.value.getTime()

    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      isSelected,
    })
  }

  // Next month days
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    })
  }

  return days
})

// Header text
const headerText = computed(() => {
  if (viewMode.value === 'years') {
    const startYear = Math.floor(viewDate.value.getFullYear() / 10) * 10
    return `${startYear} - ${startYear + 9}`
  }
  if (viewMode.value === 'months') {
    return viewDate.value.getFullYear().toString()
  }
  return `Tháng ${viewDate.value.getMonth() + 1}, ${viewDate.value.getFullYear()}`
})

// Years for year view
const yearRange = computed(() => {
  const startYear = Math.floor(viewDate.value.getFullYear() / 10) * 10
  const years = []
  for (let i = startYear - 1; i <= startYear + 10; i++) {
    years.push(i)
  }
  return years
})

// Wrapper class
const wrapperClass = computed(() => ({
  'ms-datepicker--disabled': props.disabled,
  'ms-datepicker--error': props.error,
  'ms-datepicker--open': showPicker.value,
  [`ms-datepicker--${props.size}`]: true,
}))

// Methods
function togglePicker() {
  if (props.disabled || props.readonly) return
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    viewMode.value = 'days'
    if (selectedDate.value) {
      viewDate.value = new Date(selectedDate.value)
    } else {
      viewDate.value = new Date()
    }
  }
}

function closePicker() {
  showPicker.value = false
}

function selectDate(day) {
  if (!day.isCurrentMonth) {
    viewDate.value = new Date(day.date)
  }
  modelValue.value = formatDate(day.date)
  closePicker()
}

function selectMonth(monthIndex) {
  viewDate.value = new Date(viewDate.value.getFullYear(), monthIndex, 1)
  viewMode.value = 'days'
}

function selectYear(year) {
  viewDate.value = new Date(year, viewDate.value.getMonth(), 1)
  viewMode.value = 'months'
}

function prevMonth() {
  if (viewMode.value === 'years') {
    viewDate.value = new Date(viewDate.value.getFullYear() - 10, viewDate.value.getMonth(), 1)
  } else if (viewMode.value === 'months') {
    viewDate.value = new Date(viewDate.value.getFullYear() - 1, viewDate.value.getMonth(), 1)
  } else {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
  }
}

function nextMonth() {
  if (viewMode.value === 'years') {
    viewDate.value = new Date(viewDate.value.getFullYear() + 10, viewDate.value.getMonth(), 1)
  } else if (viewMode.value === 'months') {
    viewDate.value = new Date(viewDate.value.getFullYear() + 1, viewDate.value.getMonth(), 1)
  } else {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
  }
}

function cycleViewMode() {
  if (viewMode.value === 'days') {
    viewMode.value = 'months'
  } else if (viewMode.value === 'months') {
    viewMode.value = 'years'
  }
}

function goToToday() {
  const today = new Date()
  modelValue.value = formatDate(today)
  viewDate.value = today
  closePicker()
}

function clearDate() {
  modelValue.value = ''
  closePicker()
}

// Handle input change
function handleInputChange(event) {
  const value = event.target.value
  // Try to parse dd/MM/yyyy format
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!isNaN(date.getTime())) {
      modelValue.value = formatDate(date)
    }
  }
}

// Click outside handler
function handleClickOutside(event) {
  if (
    pickerRef.value &&
    !pickerRef.value.contains(event.target) &&
    inputRef.value &&
    !inputRef.value.contains(event.target)
  ) {
    closePicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Sync viewDate when modelValue changes
watch(
  () => modelValue.value,
  (newVal) => {
    const date = parseDate(newVal)
    if (date) {
      viewDate.value = new Date(date)
    }
  },
)
</script>

<template>
  <div class="ms-datepicker" :class="wrapperClass">
    <div ref="inputRef" class="ms-datepicker__input" @click="togglePicker">
      <input
        type="text"
        class="ms-datepicker__field"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @change="handleInputChange"
        @click.stop="togglePicker"
      />
      <span class="ms-datepicker__icon">
        <i class="icon-calendar"></i>
      </span>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPicker" ref="pickerRef" class="ms-datepicker__dropdown">
          <!-- Header -->
          <div class="ms-datepicker__header">
            <button type="button" class="ms-datepicker__nav" @click="prevMonth">
              <i class="icon-chevron-left">‹</i>
            </button>
            <button type="button" class="ms-datepicker__title" @click="cycleViewMode">
              {{ headerText }}
            </button>
            <button type="button" class="ms-datepicker__nav" @click="nextMonth">
              <i class="icon-chevron-right">›</i>
            </button>
          </div>

          <!-- Days View -->
          <div v-if="viewMode === 'days'" class="ms-datepicker__body">
            <div class="ms-datepicker__weekdays">
              <span v-for="day in daysOfWeek" :key="day" class="ms-datepicker__weekday">
                {{ day }}
              </span>
            </div>
            <div class="ms-datepicker__days">
              <button
                v-for="(day, index) in calendarDays"
                :key="index"
                type="button"
                class="ms-datepicker__day"
                :class="{
                  'ms-datepicker__day--other': !day.isCurrentMonth,
                  'ms-datepicker__day--today': day.isToday,
                  'ms-datepicker__day--selected': day.isSelected,
                }"
                @click="selectDate(day)"
              >
                {{ day.date.getDate() }}
              </button>
            </div>
          </div>

          <!-- Months View -->
          <div v-else-if="viewMode === 'months'" class="ms-datepicker__body">
            <div class="ms-datepicker__months">
              <button
                v-for="(month, index) in months"
                :key="index"
                type="button"
                class="ms-datepicker__month"
                :class="{
                  'ms-datepicker__month--selected':
                    selectedDate &&
                    selectedDate.getMonth() === index &&
                    selectedDate.getFullYear() === viewDate.getFullYear(),
                }"
                @click="selectMonth(index)"
              >
                {{ month }}
              </button>
            </div>
          </div>

          <!-- Years View -->
          <div v-else-if="viewMode === 'years'" class="ms-datepicker__body">
            <div class="ms-datepicker__years">
              <button
                v-for="year in yearRange"
                :key="year"
                type="button"
                class="ms-datepicker__year"
                :class="{
                  'ms-datepicker__year--selected':
                    selectedDate && selectedDate.getFullYear() === year,
                }"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="ms-datepicker__footer">
            <button
              type="button"
              class="ms-datepicker__btn ms-datepicker__btn--clear"
              @click="clearDate"
            >
              Xóa
            </button>
            <button
              type="button"
              class="ms-datepicker__btn ms-datepicker__btn--today"
              @click="goToToday"
            >
              Hôm nay
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ms-datepicker {
  position: relative;
  display: inline-flex;
  width: 100%;
}

.ms-datepicker__input {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.ms-datepicker__input:hover:not(.ms-datepicker--disabled .ms-datepicker__input) {
  border-color: #40a9ff;
}

.ms-datepicker--open .ms-datepicker__input {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ms-datepicker--error .ms-datepicker__input {
  border-color: #ff4d4f;
}

.ms-datepicker__field {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 0;
  font-size: 14px;
  background: transparent;
  cursor: pointer;
}

.ms-datepicker--small .ms-datepicker__field {
  padding: 4px 0;
  font-size: 12px;
}

.ms-datepicker--large .ms-datepicker__field {
  padding: 12px 0;
  font-size: 16px;
}

.ms-datepicker--disabled {
  cursor: not-allowed;
}

.ms-datepicker--disabled .ms-datepicker__input {
  background: #f5f5f5;
}

.ms-datepicker--disabled .ms-datepicker__field {
  color: #bfbfbf;
  cursor: not-allowed;
}

.ms-datepicker__icon {
  color: #bfbfbf;
  font-size: 14px;
}

/* Dropdown */
.ms-datepicker__dropdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
  min-width: 280px;
}

/* Header */
.ms-datepicker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.ms-datepicker__nav {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #595959;
  border-radius: 4px;
  font-size: 16px;
}

.ms-datepicker__nav:hover {
  background: #f5f5f5;
}

.ms-datepicker__title {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.ms-datepicker__title:hover {
  background: #f5f5f5;
}

/* Weekdays */
.ms-datepicker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.ms-datepicker__weekday {
  text-align: center;
  font-size: 12px;
  color: #8c8c8c;
  padding: 4px;
}

/* Days */
.ms-datepicker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.ms-datepicker__day {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
}

.ms-datepicker__day:hover {
  background: #f5f5f5;
}

.ms-datepicker__day--other {
  color: #bfbfbf;
}

.ms-datepicker__day--today {
  border: 1px solid #1890ff;
}

.ms-datepicker__day--selected {
  background: #1890ff;
  color: #fff;
}

.ms-datepicker__day--selected:hover {
  background: #40a9ff;
}

/* Months */
.ms-datepicker__months {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.ms-datepicker__month {
  padding: 12px 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
}

.ms-datepicker__month:hover {
  background: #f5f5f5;
}

.ms-datepicker__month--selected {
  background: #1890ff;
  color: #fff;
}

.ms-datepicker__month--selected:hover {
  background: #40a9ff;
}

/* Years */
.ms-datepicker__years {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.ms-datepicker__year {
  padding: 12px 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
}

.ms-datepicker__year:hover {
  background: #f5f5f5;
}

.ms-datepicker__year--selected {
  background: #1890ff;
  color: #fff;
}

.ms-datepicker__year--selected:hover {
  background: #40a9ff;
}

/* Footer */
.ms-datepicker__footer {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.ms-datepicker__btn {
  padding: 4px 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.ms-datepicker__btn--clear {
  color: #8c8c8c;
}

.ms-datepicker__btn--clear:hover {
  color: #262626;
}

.ms-datepicker__btn--today {
  color: #1890ff;
}

.ms-datepicker__btn--today:hover {
  background: #e6f7ff;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
