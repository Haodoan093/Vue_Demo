<template>
  <DefaultLayout>
    <div class="app-candidates">
      <div class="app-candidates-layout d-flex dis-flex-grow dis-flex-row">
        <div class="list-candidate-center d-flex dis-flex-grow dis-flex-column">
          <div class="title-header">
            <div class="title-left">Ứng viên</div>
            <div class="title-right d-flex">
              <MsSplitButton
                label="Thêm ứng viên"
                icon-class="icon-add"
                @click="onAddCandidate"
                @toggle="onToggleAddMenu"
              />
            </div>
          </div>

          <div class="candidates-wrapper">
            <div class="candidates-wrapper-content d-flex flex-col">
              <div class="candidate-wrapper-content-grid">
                <div class="toolbar-grid bg-white" :class="{ 'has-selection': selectedCount > 0 }">
                  <div class="toolbar-container d-flex align-items-center justify-content-between">
                    <div class="toolbar-grid-default">
                      <div class="toolbar-grid-left">
                        <div class="search-grid d-flex">
                          <div class="search-ontab">
                            <div class="texteditor-container wrap-icon-button-toolbar">
                              <div class="button-container">
                                <div class="ai-search">
                                  <div class="button-content">
                                    <i class="search"></i>
                                  </div>
                                </div>
                              </div>
                              <div class="input-container">
                                <input
                                  class="text-editor-input"
                                  type="search"
                                  placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
                                  autocomplete="off"
                                  v-model="query"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="toolbar-grid-right">
                        <div class="filter-area wrap-icon-button-toolbar m-r-8" title="Bộ lọc">
                          <div class="icon-filter ic-svg"></div>
                        </div>
                        <div class="wrap-icon-button-toolbar m-r-8" title="Xuất khẩu">
                          <div class="icon-export ic-svg"></div>
                        </div>
                        <div class="wrap-icon-button-toolbar m-r-8" title="Xem nhanh hoạt động">
                          <div class="icon-interactive-history ic-svg"></div>
                        </div>
                        <div class="z-index-default dropdown">
                          <div class="wrap-icon-button-setting">
                            <div class="icon-setting ic-svg"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="toolbar-grid-selected">
                      <div class="toolbar-grid-left d-flex align-items-center">
                        <div class="selection-count">
                          <strong>{{ selectedCount }}</strong> đang chọn
                        </div>
                        <button type="button" class="btn-link m-l-12" @click="clearSelection">
                          Bỏ chọn
                        </button>
                      </div>

                      <div class="toolbar-grid-right d-flex align-items-center">
                        <button
                          type="button"
                          class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
                        >
                          <span class="icon-email m-r-8"></span>
                          Gửi email
                        </button>

                        <button
                          type="button"
                          class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
                        >
                          <span class="icon-tag m-r-8"></span>
                          Quản lý thẻ
                        </button>

                        <button
                          type="button"
                          class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
                        >
                          <span class="icon-document-check m-r-8"></span>
                          Tạo công việc
                        </button>

                        <button
                          type="button"
                          class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
                        >
                          <span class="icon-sb-recruiment-campaign m-r-8"></span>
                          Thêm vào chiến dịch
                        </button>

                        <button
                          type="button"
                          class="btn btn-secondary-2 wrap-icon-button-toolbar m-r-8"
                        >
                          <span class="icon-delete m-r-8"></span>
                          Xóa ứng viên
                        </button>

                        <button type="button" class="btn btn-secondary-2">
                          <span class="icon-more-vertical m-r-8"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="table-candidate">
                  <MsTable
                    :rows="pageItems"
                    :columns="columns"
                    row-key="id"
                    selectable
                    :selected-keys="selectedKeysModel"
                    @update:selected-keys="onUpdateSelectedKeys"
                    show-footer
                    :total="total"
                    :page="page"
                    :page-size="pageSize"
                    :page-sizes="[25, 50, 100]"
                    table-class="candidates-table"
                    @update:page="page = $event"
                    @update:page-size="pageSize = $event"
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

                    <template #cell-actions>
                      <button
                        type="button"
                        class="btn-row-edit"
                        aria-label="Chỉnh sửa"
                        title="Chỉnh sửa"
                      >
                        <span class="icon-edit"></span>
                      </button>
                    </template>
                  </MsTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { DEFAULT_CANDIDATES } from '@/data/defaultCandidates'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsSplitButton from '@/components/ms-button/MsSplitButton.vue'

const LS_KEY = 'misa_candidates'

const query = ref('')
const page = ref(1)
const pageSize = ref(25)

const selectedIds = ref(new Set())

const columns = Object.freeze([
  { key: 'phone', title: 'Số điện thoại', class: 'col-phone' },
  { key: 'source', title: 'Nguồn ứng viên', class: 'col-source' },
  { key: 'fullName', title: 'Họ và tên', class: 'col-name' },
  { key: 'email', title: 'Email', class: 'col-email' },
  { key: 'campaign', title: 'Chiến dịch tuyển dụng', class: 'col-campaign' },
  { key: 'position', title: 'Vị trí tuyển dụng', class: 'col-position' },
  { key: 'jobPost', title: 'Tin tuyển dụng', class: 'col-job' },
  { key: 'recruitStage', title: 'Vòng tuyển dụng', class: 'col-recruit-stage' },
  { key: 'rate', title: 'Đánh giá', class: 'col-rate' },
  { key: 'appliedDate', title: 'Ngày ứng tuyển', class: 'col-applied-date' },
  { key: 'eduLevel', title: 'Trình độ đào tạo', class: 'col-edu-level' },
  { key: 'school', title: 'Nơi đào tạo', class: 'col-school' },
  { key: 'major', title: 'Chuyên ngành', class: 'col-major' },
  { key: 'recentWork', title: 'Nơi làm việc gần đây', class: 'col-recent-work' },
  { key: 'exploiter', title: 'Nhân sự khai thác', class: 'col-exploit' },
  { key: 'unit', title: 'Đơn vị sử dụng', class: 'col-unit' },
  { key: 'personaFit', title: 'Phù hợp với chân dung', class: 'col-persona' },
  { key: 'area', title: 'Khu vực', class: 'col-area' },
  { key: 'referrer', title: 'Người giới thiệu', class: 'col-referrer' },
  { key: 'receptionInfo', title: 'Thông tin tiếp nhận', class: 'col-reception-info' },
  { key: 'talentPool', title: 'Thuộc kho tiềm năng', class: 'col-talent-pool' },
  { key: 'actions', title: '', class: 'col-actions', ariaLabel: 'Hành động' },
])

const selectedKeysModel = computed({
  get() {
    return Array.from(selectedIds.value)
  },
  set(nextKeys) {
    const arr = Array.isArray(nextKeys) ? nextKeys : []
    const normalized = arr.map((k) => (k ?? '').toString().trim()).filter(Boolean)
    selectedIds.value = new Set(normalized)
  },
})

function safeText(v) {
  const s = (v ?? '').toString().trim()
  return s.length ? s : '—'
}

function normalizeText(s) {
  return (s ?? '').toString().trim().toLowerCase()
}

function normalizePhone(phone) {
  return (phone ?? '').toString().replace(/\D+/g, '')
}

function initials(fullName) {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '--'
  const a = parts[0][0] ?? ''
  const b = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (a + b).toUpperCase()
}

function hashString(str) {
  const s = (str ?? '').toString()
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function avatarBg(candidate) {
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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function rateToNumber(rate) {
  if (rate == null) return 0

  const asNumber = Number(rate)
  if (Number.isFinite(asNumber)) return clamp(Math.round(asNumber), 0, 5)

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

function isFiniteNumber(v) {
  return Number.isFinite(Number(v))
}

function personaSafe(score) {
  const n = Number(score)
  if (!Number.isFinite(n)) return 0
  return clamp(Math.round(n), 1, 100)
}

function getPersonaFitClass(score) {
  const safe = personaSafe(score)
  if (safe >= 70) return 'compatibility-level--good'
  if (safe >= 40) return 'compatibility-level--medium'
  return 'compatibility-level--bad'
}

function loadCandidates() {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function seedIfNeeded() {
  const existing = loadCandidates()
  if (existing.length) return existing
  localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_CANDIDATES))
  return DEFAULT_CANDIDATES
}

const allCandidates = ref([])

onMounted(() => {
  allCandidates.value = seedIfNeeded()
})

const filtered = computed(() => {
  const q = normalizeText(query.value)
  if (!q) return allCandidates.value

  return allCandidates.value.filter((c) => {
    const name = normalizeText(c.fullName)
    const email = normalizeText(c.email)
    const phone = normalizePhone(c.phone)
    const src = normalizeText(c.source)
    const job = normalizeText(c.jobPost)
    const campaign = normalizeText(c.campaign)
    return (
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(normalizePhone(q)) ||
      src.includes(q) ||
      job.includes(q) ||
      campaign.includes(q)
    )
  })
})

const total = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch([query, pageSize], () => {
  page.value = 1
})

watch([page, totalPages], () => {
  page.value = clamp(page.value, 1, totalPages.value)
})

const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.value.slice(start, end)
})

const selectedCount = computed(() => selectedIds.value.size)

function onUpdateSelectedKeys(nextKeys) {
  selectedKeysModel.value = nextKeys
}

function clearSelection() {
  selectedIds.value = new Set()
}

function onAddCandidate() {
  // sẽ nối sang modal/form ở bước tiếp theo
}

function onToggleAddMenu() {
  // TODO: mở menu dropdown (bước sau làm popup/menu)
}
</script>
