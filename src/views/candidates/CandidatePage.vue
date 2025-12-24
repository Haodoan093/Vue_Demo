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
                    <template v-if="selectedCount === 0">
                      <div
                        class="toolbar-grid-default d-flex align-items-center justify-content-between"
                        style="width: 100%"
                      >
                        <CandidateToolBar
                          :query="query"
                          @update:query="query = $event"
                          @filter="onFilter"
                          @export="onExport"
                          @history="onHistory"
                          @settings="onSettings"
                        />
                      </div>
                    </template>

                    <template v-else>
                      <CandidateSelectionBar
                        :selected-count="selectedCount"
                        @clear="clearSelection"
                        @send-email="onSendEmail"
                        @manage-tags="onManageTags"
                        @create-job="onCreateJob"
                        @add-campaign="onAddCampaign"
                        @delete="onDeleteCandidates"
                        @more="onMoreActions"
                      />
                    </template>
                  </div>
                </div>

                <CandidateTable
                  :rows="pageItems"
                  :columns="columns"
                  :selected-keys="selectedKeysModel"
                  :total="total"
                  :page="page"
                  :page-size="pageSize"
                  @update:selected-keys="onUpdateSelectedKeys"
                  @update:page="page = $event"
                  @update:page-size="pageSize = $event"
                  @edit="onEditCandidate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Candidate Add Modal -->
    <CandidateModal
      :visible="candidateModalVisible"
      mode="add"
      :loading="modalLoading"
      @update:visible="candidateModalVisible = $event"
      @submit="onCandidateModalSubmit"
      @cancel="candidateModalVisible = false"
    />

    <!-- Candidate Edit Modal -->
    <CandidateEditModal
      :visible="candidateEditModalVisible"
      :candidate="currentCandidate"
      :loading="modalLoading"
      @update:visible="candidateEditModalVisible = $event"
      @submit="onCandidateEditModalSubmit"
      @cancel="candidateEditModalVisible = false"
    />

    <!-- Delete Confirm Modal -->
    <DeleteConfirmModal
      :visible="deleteModalVisible"
      :count="selectedCount"
      :loading="modalLoading"
      @update:visible="deleteModalVisible = $event"
      @confirm="onDeleteConfirm"
      @cancel="deleteModalVisible = false"
    />
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { DEFAULT_CANDIDATES } from '@/data/defaultCandidates'
import MsSplitButton from '@/components/ms-button/MsSplitButton.vue'
import CandidateToolBar from './components/CandidateToolBar.vue'
import CandidateSelectionBar from './components/CandidateSelectionBar.vue'
import CandidateTable from './components/CandidateTable.vue'
import CandidateModal from './components/CandidateModal.vue'
import CandidateEditModal from './components/CandidateEditModal.vue'
import DeleteConfirmModal from './components/DeleteConfirmModal.vue'

const LS_KEY = 'misa_candidates'

const query = ref('')
const page = ref(1)
const pageSize = ref(25)

const selectedIds = ref(new Set())

// Modal state
const candidateModalVisible = ref(false)
const candidateEditModalVisible = ref(false)
const deleteModalVisible = ref(false)
const candidateModalMode = ref('add')
const currentCandidate = ref(null)
const modalLoading = ref(false)

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

function normalizeText(s) {
  return (s ?? '').toString().trim().toLowerCase()
}

function normalizePhone(phone) {
  return (phone ?? '').toString().replace(/\D+/g, '')
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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
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
  candidateModalMode.value = 'add'
  currentCandidate.value = null
  candidateModalVisible.value = true
}

function onToggleAddMenu() {
  console.log('Toggle add menu - TODO: open dropdown menu')
}

function onFilter() {
  console.log('Filter clicked')
}

function onExport() {
  console.log('Export clicked')
}

function onHistory() {
  console.log('History clicked')
}

function onSettings() {
  console.log('Settings clicked')
}

function onSendEmail() {
  console.log('Send email to', selectedCount.value, 'candidates')
}

function onManageTags() {
  console.log('Manage tags for', selectedCount.value, 'candidates')
}

function onCreateJob() {
  console.log('Create job for', selectedCount.value, 'candidates')
}

function onAddCampaign() {
  console.log('Add campaign for', selectedCount.value, 'candidates')
}

function onDeleteCandidates() {
  deleteModalVisible.value = true
}

function onMoreActions() {
  console.log('More actions for', selectedCount.value, 'candidates')
}

function onEditCandidate(candidate) {
  currentCandidate.value = { ...candidate }
  candidateEditModalVisible.value = true
}

/**
 * Xử lý submit form thêm/chỉnh sửa ứng viên
 * @param {Object} formData - Dữ liệu form
 * @createdBy: dchao - 24.12.2025
 */
function onCandidateModalSubmit(formData) {
  modalLoading.value = true

  // Simulate API call
  setTimeout(() => {
    const allCandidates = loadCandidates()

    // Add new candidate
    const newCandidate = {
      id: Math.max(0, ...allCandidates.map((c) => c.id || 0)) + 1,
      ...formData,
      appliedDate: new Date().toISOString().split('T')[0],
      source: 'Manual',
      rate: 0,
      personaFit: 0,
    }
    allCandidates.push(newCandidate)

    // Save to localStorage
    localStorage.setItem(LS_KEY, JSON.stringify(allCandidates))
    allCandidates.value = allCandidates

    // Close modal
    candidateModalVisible.value = false
    modalLoading.value = false
  }, 500)
}

function onCandidateEditModalSubmit({ data }) {
  modalLoading.value = true
  setTimeout(() => {
    const allCandidates = loadCandidates()
    const idx = allCandidates.findIndex((c) => c.id === currentCandidate.value.id)

    if (idx !== -1) {
      allCandidates[idx] = { ...allCandidates[idx], ...data }

      // Save to localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(allCandidates))
      allCandidates.value = allCandidates
    }

    candidateEditModalVisible.value = false
    modalLoading.value = false
  }, 500)
}

/**
 * Xử lý xác nhận xóa ứng viên
 * @createdBy: dchao - 24.12.2025
 */
function onDeleteConfirm() {
  modalLoading.value = true

  // Simulate API call
  setTimeout(() => {
    const allCandidates = loadCandidates()
    const selectedArray = Array.from(selectedIds.value)

    // Remove selected candidates
    const filtered = allCandidates.filter((c) => !selectedArray.includes(String(c.id)))
    localStorage.setItem(LS_KEY, JSON.stringify(filtered))
    allCandidates.value = filtered

    // Clear selection and close modal
    clearSelection()
    deleteModalVisible.value = false
    modalLoading.value = false
  }, 500)
}
</script>
