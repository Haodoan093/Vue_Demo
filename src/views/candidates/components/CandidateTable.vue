<script setup>
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButton from '@/components/ms-button/MsButton.vue'

//#region Props
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 25,
  },
})
//#endregion

//#region Emits
defineEmits(['update:selected-keys', 'update:page', 'update:page-size', 'edit'])
//#endregion

//#region Methods
/**
 * Chuyển đổi text an toàn - nếu rỗng thì hiển thị dấu gạch ngang (—)
 * @param {any} v - Giá trị cần convert
 * @returns {string} - Text an toàn
 * @createdBy: haodc - 24.12.2025
 */
const safeText = (v) => {
  const s = (v ?? '').toString().trim()
  return s.length ? s : '—'
}

/**
 * Convert giá trị rating thành số (0-5)
 * Hỗ trợ cả giá trị số và text tiếng Việt
 * @param {any} rate - Giá trị rating
 * @returns {number} - Số sao (0-5)
 * @createdBy: dchao - 24.12.2025
 */
const rateToNumber = (rate) => {
  if (rate == null) return 0

  const asNumber = Number(rate)
  if (Number.isFinite(asNumber)) {
    return Math.max(0, Math.min(5, Math.round(asNumber)))
  }

  const normalizeText = (str) => (str ?? '').toString().trim().toLowerCase()
  const s = normalizeText(rate)
  const map = {
    'xuất sắc': 5,
    'xuat sac': 5,
    tốt: 4,
    tot: 4,
    khá: 3,
    kha: 3,
    'trung bình': 2,
    'trung binh': 2,
    kém: 1,
    kem: 1,
    '-': 0,
    '—': 0,
    '': 0,
  }
  return map[s] ?? 0
}

/**
 * Kiểm tra xem giá trị có phải số hữu hạn không
 * @param {any} v - Giá trị cần kiểm tra
 * @returns {boolean} - True nếu là số hữu hạn
 * @createdBy: dchao - 24.12.2025
 */
const isFiniteNumber = (v) => Number.isFinite(Number(v))

/**
 * Chuyển đổi score phù hợp với chân dung thành phần trăm an toàn (1-100)
 * @param {any} score - Giá trị score
 * @returns {number} - Phần trăm (1-100)
 * @createdBy: dchao - 24.12.2025
 */
const personaSafe = (score) => {
  const n = Number(score)
  if (!Number.isFinite(n)) return 0
  return Math.max(1, Math.min(100, Math.round(n)))
}

/**
 * Lấy class CSS cho mức độ phù hợp với chân dung
 * Good >= 70%, Medium >= 40%, Bad < 40%
 * @param {any} score - Giá trị score
 * @returns {string} - Class name
 * @createdBy: dchao - 24.12.2025
 */
const getPersonaFitClass = (score) => {
  const safe = personaSafe(score)
  if (safe >= 70) return 'compatibility-level--good'
  if (safe >= 40) return 'compatibility-level--medium'
  return 'compatibility-level--bad'
}

/**
 * Lấy chữ viết tắt từ tên đầy đủ (ví dụ: "Nguyễn Văn A" -> "NA")
 * @param {string} fullName - Tên đầy đủ
 * @returns {string} - 2 ký tự viết tắt
 * @createdBy: dchao - 24.12.2025
 */
const initials = (fullName) => {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '--'
  const a = parts[0][0] ?? ''
  const b = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (a + b).toUpperCase()
}

/**
 * Hash string thành số để tạo màu avatar
 * @param {string} str - Chuỗi cần hash
 * @returns {number} - Số hash
 * @createdBy: dchao - 24.12.2025
 */
const hashString = (str) => {
  const s = (str ?? '').toString()
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Lấy màu nền avatar dựa trên thông tin ứng viên
 * Luôn trả về cùng một màu cho cùng một ứng viên
 * @param {Object} candidate - Dữ liệu ứng viên
 * @returns {string} - Mã màu hex
 * @createdBy: dchao - 24.12.2025
 */
const avatarBg = (candidate) => {
  const palette = [
    '#22C55E',
    '#14B8A6',
    '#06B6D4',
    '#A3E635',
    '#F59E0B',
    '#F97316',
    '#3B82F6',
    '#6366F1',
    '#A855F7',
    '#EC4899',
    '#EF4444',
    '#10B981',
  ]
  const key = (candidate?.id ?? candidate?.fullName ?? '').toString()
  const idx = hashString(key) % palette.length
  return palette[idx]
}
//#endregion
</script>

<template>
  <div class="table-candidate">
    <MsTable
      :rows="rows"
      :columns="columns"
      row-key="id"
      selectable
      :selected-keys="selectedKeys"
      @update:selected-keys="$emit('update:selected-keys', $event)"
      show-footer
      :total="total"
      :page="page"
      :page-size="pageSize"
      :page-sizes="[25, 50, 100]"
      table-class="candidates-table"
      @update:page="$emit('update:page', $event)"
      @update:page-size="$emit('update:page-size', $event)"
    >
      <template #cell-fullName="{ row }">
        <span
          class="avatar"
          :style="{ backgroundColor: avatarBg(row) }"
          :title="safeText(row.fullName)"
        >
          {{ initials(row.fullName) }}
        </span>
        <div class="name-block">
          <div class="name">
            {{ safeText(row.fullName) }}
            <span v-if="row.isNew" class="tag-new">
              <span class="new-candi">MỚI</span>
            </span>
          </div>
          <div class="sub">{{ safeText(row.position) }}</div>
        </div>
      </template>

      <template #cell-rate="{ row }">
        <span
          v-if="rateToNumber(row.rate)"
          class="rating-stars"
          :title="`${rateToNumber(row.rate)}/5`"
        >
          <i
            v-for="i in 5"
            :key="i"
            class="fa"
            :class="i <= rateToNumber(row.rate) ? 'fa-star' : 'fa-star-o'"
          ></i>
        </span>
        <span v-else>—</span>
      </template>

      <template #cell-personaFit="{ row }">
        <span
          v-if="isFiniteNumber(row.personaFit)"
          class="compatibility-level"
          :class="getPersonaFitClass(row.personaFit)"
          :title="`Phù hợp với chân dung: ${personaSafe(row.personaFit)}%`"
        >
          {{ personaSafe(row.personaFit) }}%
        </span>
        <span v-else>—</span>
      </template>

      <template #cell-actions="{ row }">
        <MsButton
          variant="link"
          icon-class="icon-edit"
          title="Chỉnh sửa"
          extraClass="btn-row-edit"
          @click="$emit('edit', row)"
        />
      </template>
    </MsTable>
  </div>
</template>

<style scoped>
.table-candidate {
  width: 100%;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  color: white;
  font-weight: 600;
  font-size: 12px;
  margin-right: 8px;
}

.name-block {
  display: inline-block;
  vertical-align: middle;
}

.name {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.sub {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.tag-new {
  margin-left: 8px;
}

.new-candi {
  display: inline-block;
  background-color: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
}

.rating-stars {
  color: #ffc069;
  font-size: 14px;
}

.fa {
  margin-right: 2px;
}

.compatibility-level {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.compatibility-level--good {
  background-color: #f6ffed;
  color: #52c41a;
}

.compatibility-level--medium {
  background-color: #fffbe6;
  color: #faad14;
}

.compatibility-level--bad {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.btn-row-edit {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: color 0.3s;
}

.btn-row-edit:hover {
  color: #40a9ff;
}

.icon-edit {
  display: inline-block;
}
</style>
