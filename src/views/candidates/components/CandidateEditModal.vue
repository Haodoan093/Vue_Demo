<script setup>
import { ref, watch } from 'vue'
import MsModal from '@/components/ms-modal/MsModal.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsTextArea from '@/components/ms-textarea/MsTextArea.vue'
import MsSelect from '@/components/ms-select/MsSelect.vue'

//#region Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  candidate: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
//#endregion

//#region Emits
const emit = defineEmits(['update:visible', 'submit', 'cancel'])
//#endregion

//#region State
const formData = ref({
  // Basic Info
  fullName: '',
  dob: '',
  gender: '',
  source: '',
  appliedDate: '',
  area: '',
  exploiter: '',
  collaborator: '',
  referrer: '',

  // Contact Info
  phone: '',
  email: '',
  address: '',
  skypeName: '',
  skypeId: '',
  facebook: '',
  zalo: '',
  otherLink: '',

  // Education
  educations: [{ eduLevel: '', school: '', major: '' }],

  // Work Experience
  recentWork: '',
  workExperiences: [],

  // Custom Fields
  customFields: [],
})

const showReferrerInput = ref(false)
const avatarImage = ref(null)
const fileInputRef = ref(null)
//#endregion

//#region Computed
const genderOptions = [
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
  { label: 'Khác', value: 'Khác' },
]

const areaOptions = [
  { label: 'Hà Nội', value: 'Hà Nội' },
  { label: 'TP.HCM', value: 'TP.HCM' },
  { label: 'Đà Nẵng', value: 'Đà Nẵng' },
]

const sourceOptions = [
  { label: 'Website công ty', value: 'Website công ty' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Group tuyển dụng', value: 'Group tuyển dụng' },
  { label: 'Giới thiệu nội bộ', value: 'Giới thiệu nội bộ' },
  { label: 'Hội chợ việc làm', value: 'Hội chợ việc làm' },
]

const exploiterOptions = [
  { label: 'Đinh Ngọc QTHT', value: 'Đinh Ngọc QTHT' },
  { label: 'HR - Minh', value: 'HR - Minh' },
  { label: 'HR - Lan', value: 'HR - Lan' },
  { label: 'HR - Hòa', value: 'HR - Hòa' },
]

const collaboratorOptions = [
  { label: 'CTV - 01', value: 'CTV - 01' },
  { label: 'CTV - 02', value: 'CTV - 02' },
]
//#endregion

//#region Methods
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addEducation = () => {
  formData.value.educations.push({ eduLevel: '', school: '', major: '' })
}

const addWorkExperience = () => {
  formData.value.workExperiences.push({
    workplace: '',
    workFrom: '',
    workTo: '',
    workTitle: '',
    workDescription: '',
  })
}

const handleConfirm = () => {
  emit('submit', {
    data: formData.value,
    avatarImage: avatarImage.value,
  })
}

const handleCancel = () => {
  resetForm()
  emit('update:visible', false)
  emit('cancel')
}

const resetForm = () => {
  if (props.candidate) {
    formData.value = {
      fullName: props.candidate.fullName || '',
      dob: props.candidate.dob || '',
      gender: props.candidate.gender || '',
      source: props.candidate.source || '',
      appliedDate: props.candidate.appliedDate || '',
      area: props.candidate.area || '',
      exploiter: props.candidate.exploiter || '',
      collaborator: props.candidate.collaborator || '',
      referrer: props.candidate.referrer || '',

      phone: props.candidate.phone || '',
      email: props.candidate.email || '',
      address: props.candidate.address || '',
      skypeName: props.candidate.skypeName || '',
      skypeId: props.candidate.skypeId || '',
      facebook: props.candidate.facebook || '',
      zalo: props.candidate.zalo || '',
      otherLink: props.candidate.otherLink || '',

      educations: props.candidate.educations
        ? JSON.parse(JSON.stringify(props.candidate.educations))
        : [{ eduLevel: '', school: '', major: '' }],
      recentWork: props.candidate.recentWork || '',
      workExperiences: props.candidate.workExperiences
        ? JSON.parse(JSON.stringify(props.candidate.workExperiences))
        : [],
      customFields: props.candidate.customFields
        ? JSON.parse(JSON.stringify(props.candidate.customFields))
        : [],
    }
    showReferrerInput.value = !!props.candidate.referrer
  } else {
    // Default empty state
    formData.value = {
      fullName: '',
      dob: '',
      gender: '',
      source: '',
      appliedDate: '',
      area: '',
      exploiter: '',
      collaborator: '',
      referrer: '',
      phone: '',
      email: '',
      address: '',
      skypeName: '',
      skypeId: '',
      facebook: '',
      zalo: '',
      otherLink: '',
      educations: [{ eduLevel: '', school: '', major: '' }],
      recentWork: '',
      workExperiences: [],
      customFields: [],
    }
    showReferrerInput.value = false
  }
  avatarImage.value = null
}
//#endregion

//#region Watchers
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  },
)

watch(
  () => props.candidate,
  () => {
    resetForm()
  },
)
//#endregion
</script>

<template>
  <MsModal
    :visible="visible"
    title="Chỉnh sửa thông tin ứng viên"
    size="large"
    ok-text="Lưu"
    :loading="loading"
    @update:visible="$emit('update:visible', $event)"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="candidate-modal-content">
      <!-- Form Container -->
      <div class="form-container">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar-uploader">
            <div v-if="!avatarImage" class="avatar-uploader__circle">
              <label
                for="avatar-upload-edit"
                style="
                  cursor: pointer;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                Ảnh
              </label>
              <input
                ref="fileInputRef"
                type="file"
                style="display: none"
                accept="image/*"
                @change="handleAvatarUpload"
              />
            </div>
            <img v-else :src="avatarImage" alt="Avatar" class="avatar-uploader__image" />
            <button class="btn-edit-avatar" @click="fileInputRef.click()">
              <i class="fa fa-pencil"></i>
            </button>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="form-fields">
          <!-- Basic Info Section -->
          <div class="form-row form-row--full">
            <label class="form-label">Họ và tên <span class="req">*</span></label>
            <MsInput v-model="formData.fullName" placeholder="Nhập họ và tên" />
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Ngày sinh</label>
              <MsInput v-model="formData.dob" type="date" placeholder="dd/MM/yyyy" />
            </div>

            <div class="form-row">
              <label class="form-label">Giới tính</label>
              <MsSelect
                v-model="formData.gender"
                placeholder="Chọn giới tính"
                :options="genderOptions"
              />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Nguồn ứng viên</label>
              <MsSelect
                v-model="formData.source"
                placeholder="Chọn nguồn ứng viên"
                :options="sourceOptions"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Ngày ứng tuyển <span class="req">*</span></label>
              <MsInput v-model="formData.appliedDate" type="date" required />
            </div>
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Khu vực</label>
            <div class="input-with-more">
              <MsSelect v-model="formData.area" placeholder="Chọn giá trị" :options="areaOptions" />
              <button type="button" class="more-btn" aria-label="more">…</button>
            </div>
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Nhân sự khai thác</label>
            <MsSelect
              v-model="formData.exploiter"
              placeholder="Chọn nhân sự khai thác ứng viên"
              :options="exploiterOptions"
            />
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Cộng tác viên</label>
            <MsSelect
              v-model="formData.collaborator"
              placeholder="Chọn cộng tác viên"
              :options="collaboratorOptions"
            />
          </div>

          <div class="form-row form-row--full" v-if="!showReferrerInput">
            <button type="button" class="btn-link-add" @click="showReferrerInput = true">
              <span class="icon-plus">+</span> Thêm người giới thiệu
            </button>
          </div>

          <div class="form-row form-row--full" v-else>
            <label class="form-label">Người giới thiệu</label>
            <MsInput v-model="formData.referrer" placeholder="Nhập người giới thiệu" />
          </div>
        </div>
      </div>

      <!-- Contact Info Section -->
      <div class="section-title">THÔNG TIN LIÊN HỆ</div>

      <div class="contact-info-grid">
        <!-- Phone -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-phone"></i> Số điện thoại</div>
          <div class="contact-input">
            <MsInput v-model="formData.phone" />
            <button type="button" class="btn-link-add-small">
              <span class="icon-plus">+</span> Thêm số điện thoại
            </button>
          </div>
        </div>

        <!-- Email -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-envelope"></i> Email</div>
          <div class="contact-input">
            <MsInput v-model="formData.email" />
            <button type="button" class="btn-link-add-small">
              <span class="icon-plus">+</span> Thêm email
            </button>
          </div>
        </div>

        <!-- Address -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-map-marker"></i> Địa chỉ</div>
          <div class="contact-input">
            <MsInput v-model="formData.address" />
          </div>
        </div>

        <!-- Skype -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-skype"></i> Skype</div>
          <div class="contact-input contact-input--two">
            <MsInput v-model="formData.skypeName" placeholder="Tên hiển thị" />
            <MsInput v-model="formData.skypeId" placeholder="live:" />
          </div>
        </div>

        <!-- Facebook -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-facebook-square"></i> Facebook</div>
          <div class="contact-input">
            <MsInput v-model="formData.facebook" />
          </div>
        </div>

        <!-- Zalo -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-comment"></i> Zalo</div>
          <div class="contact-input">
            <MsInput v-model="formData.zalo" />
          </div>
        </div>

        <!-- Other Link -->
        <div class="contact-row">
          <div class="contact-icon"><i class="fa fa-link"></i> Liên kết khác</div>
          <div class="contact-input">
            <MsInput v-model="formData.otherLink" />
            <button type="button" class="btn-link-add-small">
              <span class="icon-plus">+</span> Thêm đường dẫn
            </button>
          </div>
        </div>
      </div>

      <!-- Education Section -->
      <div class="section-title">HỌC VẤN</div>

      <div v-for="(edu, eduIdx) in formData.educations" :key="eduIdx" class="education-item">
        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Trình độ đào tạo</label>
          <div class="input-with-actions">
            <MsInput v-model="edu.eduLevel" placeholder="Nhập trình độ đào tạo" />
            <button type="button" class="action-plus" aria-label="add">
              <span class="icon-plus-blue">+</span>
            </button>
            <button type="button" class="action-caret" aria-label="toggle">▾</button>
          </div>
        </div>

        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Nơi đào tạo</label>
          <div class="input-with-actions">
            <MsInput v-model="edu.school" placeholder="Nhập nơi đào tạo" />
            <button type="button" class="action-plus" aria-label="add">
              <span class="icon-plus-blue">+</span>
            </button>
            <button type="button" class="action-caret" aria-label="toggle">▾</button>
          </div>
        </div>

        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Chuyên ngành</label>
          <div class="input-with-actions">
            <MsInput v-model="edu.major" placeholder="Công nghệ thông tin" />
            <button type="button" class="action-plus" aria-label="add">
              <span class="icon-plus-blue">+</span>
            </button>
            <button type="button" class="action-caret" aria-label="toggle">▾</button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <button type="button" class="btn-link-add" @click="addEducation">
          <span class="icon-plus">+</span> Thêm học vấn
        </button>
      </div>

      <!-- Work Experience Section -->
      <div class="section-title">KINH NGHIỆM LÀM VIỆC</div>

      <div class="form-row form-row--full form-row--inline">
        <label class="form-label form-label--dot">Nơi làm việc gần đây</label>
        <MsInput v-model="formData.recentWork" />
      </div>

      <div class="form-row" style="margin-top: 16px; margin-bottom: 16px">
        <button type="button" class="btn-link-add" @click="addWorkExperience">
          <span class="icon-plus">+</span> Thêm kinh nghiệm làm việc
        </button>
      </div>

      <div v-for="(work, workIdx) in formData.workExperiences" :key="workIdx" class="work-item">
        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Nơi làm việc</label>
          <MsInput v-model="work.workplace" placeholder="Nhập nơi làm việc" />
        </div>

        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Thời gian</label>
          <div class="form-row__two">
            <MsInput v-model="work.workFrom" type="month" placeholder="MM/yyyy" />
            <span class="dash">-</span>
            <MsInput v-model="work.workTo" type="month" placeholder="MM/yyyy" />
          </div>
        </div>

        <div class="form-row form-row--full form-row--inline">
          <label class="form-label form-label--dot">Vị trí công việc</label>
          <MsInput v-model="work.workTitle" placeholder="Nhập vị trí công việc" />
        </div>

        <div class="form-row form-row--full form-row--inline" style="align-items: flex-start">
          <label class="form-label form-label--dot" style="margin-top: 8px">Mô tả công việc</label>
          <MsTextArea v-model="work.workDescription" placeholder="Nhập mô tả công việc" />
        </div>
      </div>

      <!-- Custom Fields Section -->
      <div class="section-title">TRƯỜNG TÙY CHỈNH</div>
      <div class="form-row">
        <button type="button" class="btn-link-add">
          <span class="icon-plus">+</span> Thêm trường tùy chỉnh
        </button>
      </div>
    </div>
  </MsModal>
</template>

<style scoped>
.candidate-modal-content {
  padding: 16px 0;
}

/* Form Container */
.form-container {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* Avatar Uploader */
.avatar-uploader {
  position: relative;
  width: 63px;
  height: 63px;
}

.avatar-uploader__circle {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  border: 2px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-uploader__circle:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.avatar-uploader__image {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #d9d9d9;
}

.btn-edit-avatar {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #595959;
  font-size: 12px;
}

/* Form Fields Layout */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Form Rows */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Grid for side-by-side fields */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Inline Rows for Education/Work (Label Left) */
.form-row--inline {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row__two {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row__two > :nth-child(1),
.form-row__two > :nth-child(3) {
  flex: 1;
}

.dash {
  color: #8c8c8c;
}

/* Modal Width Override */
:deep(.ms-modal--large .ms-modal__card) {
  width: 560px !important;
  max-width: calc(100vw - 32px);
}

/* Form Label */
.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #1f1f1f;
  white-space: nowrap;
}

.form-label--dot::before {
  content: '•';
  margin-right: 8px;
  color: #000;
  font-size: 16px;
  line-height: 1;
  vertical-align: middle;
}
.form-label--dot::after {
  content: none;
}

.req {
  color: #ff4d4f;
  margin-left: 2px;
}

/* Input with actions */
.input-with-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-with-actions > :first-child {
  flex: 1;
}

.action-plus,
.action-caret {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-plus {
  color: #1890ff;
}
.action-plus:hover {
  background-color: #e6f7ff;
}

.action-caret {
  color: #595959;
}
.action-caret:hover {
  background-color: #f5f5f5;
}

.icon-plus-blue {
  font-weight: bold;
  font-size: 16px;
}

/* Input with more */
.input-with-more {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-more > :first-child {
  flex: 1;
}

.more-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #595959;
  transition: all 0.3s ease;
  padding-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
}

.more-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* Section Title */
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 24px 0 16px 0;
  text-transform: uppercase;
}

/* Contact Info Grid */
.contact-info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 12px;
}

.contact-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1f1f1f;
  font-weight: 500;
}

.contact-icon i {
  width: 16px;
  text-align: center;
  color: #595959;
}

.contact-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-input--two {
  flex-direction: row;
  gap: 8px;
}
.contact-input--two > * {
  flex: 1;
}

.btn-link-add-small {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 0;
  width: fit-content;
  margin-top: 2px;
}

/* Education Item */
.education-item {
  margin-bottom: 8px;
}

/* Work Item */
.work-item {
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.work-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Link Add Button */
.btn-link-add {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  padding: 0;
  width: fit-content;
  margin-top: 4px;
}

.btn-link-add:hover {
  text-decoration: underline;
}

.icon-plus {
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
}

/* Responsive */
@media (max-width: 600px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  .avatar-uploader {
    justify-content: flex-start;
    margin-bottom: 12px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-row--inline,
  .contact-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
