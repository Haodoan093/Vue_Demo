<template>
  <div class="ms-table">
    <div class="table-wrap table-scroll" :class="wrapperClass">
      <table :class="tableClass">
        <thead>
          <tr>
            <th v-if="selectable" class="col-checkbox">
              <input
                ref="checkAllRef"
                type="checkbox"
                aria-label="select all"
                :checked="isAllVisibleSelected"
                @change="toggleSelectAllVisible($event.target.checked)"
              />
            </th>

            <th
              v-for="col in normalizedColumns"
              :key="col.key"
              :class="col.thClass"
              :aria-label="col.ariaLabel || undefined"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.title }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in rows" :key="getRowKey(row)" :data-id="getRowKey(row)">
            <td v-if="selectable" class="col-checkbox">
              <input
                type="checkbox"
                class="row-checkbox"
                :checked="isSelected(getRowKey(row))"
                @change="toggleRow(getRowKey(row), $event.target.checked)"
              />
            </td>

            <td v-for="col in normalizedColumns" :key="col.key" :class="col.tdClass">
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :column="col"
                :value="getValue(row, col.key)"
              >
                {{ safeText(getValue(row, col.key)) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showFooter" class="table-footer d-flex">
      <div class="total">
        Tổng: <strong>{{ total }}</strong> bản ghi
      </div>

      <div class="pagination-area">
        <label class="per-page">
          Số bản ghi/trang
          <select :value="pageSize" @change="onChangePageSize($event.target.value)">
            <option v-for="s in pageSizes" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>

        <div class="page-info">{{ startIndex }} - {{ endIndex }} bản ghi</div>

        <button
          type="button"
          class="icon-left-page"
          aria-label="Previous page"
          :disabled="page <= 1"
          @click="emit('update:page', Math.max(1, page - 1))"
        >
          ‹
        </button>
        <button
          type="button"
          class="icon-right-page"
          aria-label="Next page"
          :disabled="page >= totalPages"
          @click="emit('update:page', Math.min(totalPages, page + 1))"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: 'id' },

  selectable: { type: Boolean, default: false },
  selectedKeys: { type: Array, default: () => [] },

  tableClass: { type: String, default: '' },
  wrapperClass: { type: [String, Array, Object], default: '' },

  showFooter: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 25 },
  pageSizes: { type: Array, default: () => [25, 50, 100] },
})

const emit = defineEmits(['update:selectedKeys', 'update:page', 'update:pageSize'])

const normalizedColumns = computed(() =>
  (props.columns ?? []).map((c) => ({
    key: c?.key,
    title: c?.title ?? '',
    thClass: c?.thClass ?? c?.class ?? '',
    tdClass: c?.tdClass ?? c?.class ?? '',
    ariaLabel: c?.ariaLabel,
  })),
)

function safeText(v) {
  const s = (v ?? '').toString().trim()
  return s.length ? s : '—'
}

function getRowKey(row) {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  const k = props.rowKey
  return row?.[k]
}

function normalizeKey(key) {
  return (key ?? '').toString().trim()
}

function getValue(row, key) {
  if (!key) return undefined
  return row?.[key]
}

const selectedSet = computed(() => new Set((props.selectedKeys ?? []).map(normalizeKey)))
const visibleKeys = computed(() =>
  (props.rows ?? []).map((r) => normalizeKey(getRowKey(r))).filter(Boolean),
)

const isAllVisibleSelected = computed(() => {
  if (!props.selectable) return false
  const ids = visibleKeys.value
  if (!ids.length) return false
  return ids.every((id) => selectedSet.value.has(id))
})

const isSomeVisibleSelected = computed(() => {
  if (!props.selectable) return false
  const ids = visibleKeys.value
  if (!ids.length) return false
  const checkedCount = ids.filter((id) => selectedSet.value.has(id)).length
  return checkedCount > 0 && checkedCount < ids.length
})

const checkAllRef = ref(null)
watch(
  isSomeVisibleSelected,
  (val) => {
    if (checkAllRef.value) checkAllRef.value.indeterminate = val
  },
  { immediate: true },
)

function isSelected(key) {
  const k = normalizeKey(key)
  return !!k && selectedSet.value.has(k)
}

function toggleRow(key, checked) {
  const k = normalizeKey(key)
  if (!k) return
  const next = new Set(selectedSet.value)
  if (checked) next.add(k)
  else next.delete(k)
  emit('update:selectedKeys', Array.from(next))
}

function toggleSelectAllVisible(checked) {
  const next = new Set(selectedSet.value)
  const ids = visibleKeys.value
  if (checked) ids.forEach((id) => next.add(id))
  else ids.forEach((id) => next.delete(id))
  emit('update:selectedKeys', Array.from(next))
}

const totalPages = computed(() => Math.max(1, Math.ceil((props.total ?? 0) / props.pageSize)))
const startIndex = computed(() => (props.total ? (props.page - 1) * props.pageSize + 1 : 0))
const endIndex = computed(() =>
  props.total ? Math.min(props.page * props.pageSize, props.total) : 0,
)

function onChangePageSize(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return
  emit('update:pageSize', n)
}
</script>
