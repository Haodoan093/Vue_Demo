<script setup>
import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import MsModal from '@/components/ms-modal/MsModal.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsTextArea from '@/components/ms-textarea/MsTextArea.vue'
import MsSelect from '@/components/ms-select/MsSelect.vue'
import MsDatePicker from '@/components/ms-datepicker/MsDatePicker.vue'

//#region Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value),
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

//#region Validation Schema
const validationSchema = yup.object({
  fullName: yup
    .string()
    .required('Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  appliedDate: yup.string().required('Ngày ứng tuyển là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').nullable(),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, 'Số điện thoại chỉ chứa số')
    .nullable(),
})

const {
  handleSubmit,
  errors,
  resetForm: resetValidation,
  setFieldValue,
} = useForm({
  validationSchema,
  initialValues: {
    fullName: '',
    dob: '',
    gender: '',
    area: '',
    phone: '',
    email: '',
    address: '',
    appliedDate: '',
    source: '',
    exploiter: '',
    collaborator: '',
    referrer: '',
    recentWork: '',
  },
})

// Define validated fields
const { value: fullName } = useField('fullName')
const { value: dob } = useField('dob')
const { value: gender } = useField('gender')
const { value: area } = useField('area')
const { value: phone } = useField('phone')
const { value: email } = useField('email')
const { value: address } = useField('address')
const { value: appliedDate } = useField('appliedDate')
const { value: source } = useField('source')
const { value: exploiter } = useField('exploiter')
const { value: collaborator } = useField('collaborator')
const { value: referrer } = useField('referrer')
const { value: recentWork } = useField('recentWork')
//#endregion

//#region State
const educations = ref([{ eduLevel: '', school: '', major: '' }])
const workExperiences = ref([
  { workplace: '', workFrom: '', workTo: '', workTitle: '', workDescription: '' },
])
const quickAddRefToTalentPool = ref(false)
const showReferrerInput = ref(false)

const cvFile = ref(null)
const avatarImage = ref(null)
const expandedEducations = ref([true])
const expandedWorkExperiences = ref([true])
//#endregion

//#region Computed
const modalTitle = computed(() => {
  return props.mode === 'add' ? 'Thêm ứng viên' : 'Chỉnh sửa ứng viên'
})

const confirmText = computed(() => {
  return props.mode === 'add' ? 'Lưu' : 'Cập nhật'
})

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
const handleCVUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    cvFile.value = file
  }
}

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
  educations.value.push({ eduLevel: '', school: '', major: '' })
  expandedEducations.value.push(true)
}

const addWorkExperience = () => {
  workExperiences.value.push({
    workplace: '',
    workFrom: '',
    workTo: '',
    workTitle: '',
    workDescription: '',
  })
  expandedWorkExperiences.value.push(true)
}

const handleConfirm = handleSubmit((values) => {
  emit('submit', {
    mode: props.mode,
    data: {
      ...values,
      educations: educations.value,
      workExperiences: workExperiences.value,
      quickAddRefToTalentPool: quickAddRefToTalentPool.value,
    },
    cvFile: cvFile.value,
    avatarImage: avatarImage.value,
  })
})

const handleCancel = () => {
  resetForm()
  emit('update:visible', false)
  emit('cancel')
}

const resetForm = () => {
  if (props.mode === 'edit' && props.candidate) {
    setFieldValue('fullName', props.candidate.fullName || '')
    setFieldValue('dob', props.candidate.dob || '')
    setFieldValue('gender', props.candidate.gender || '')
    setFieldValue('area', props.candidate.area || '')
    setFieldValue('phone', props.candidate.phone || '')
    setFieldValue('email', props.candidate.email || '')
    setFieldValue('address', props.candidate.address || '')
    setFieldValue('appliedDate', props.candidate.appliedDate || '')
    setFieldValue('source', props.candidate.source || '')
    setFieldValue('exploiter', props.candidate.exploiter || '')
    setFieldValue('collaborator', props.candidate.collaborator || '')
    setFieldValue('referrer', props.candidate.referrer || '')
    setFieldValue('recentWork', props.candidate.recentWork || '')

    educations.value = props.candidate.educations
      ? JSON.parse(JSON.stringify(props.candidate.educations))
      : [{ eduLevel: '', school: '', major: '' }]
    workExperiences.value = props.candidate.workExperiences
      ? JSON.parse(JSON.stringify(props.candidate.workExperiences))
      : [{ workplace: '', workFrom: '', workTo: '', workTitle: '', workDescription: '' }]
    quickAddRefToTalentPool.value = props.candidate.quickAddRefToTalentPool || false
    showReferrerInput.value = !!props.candidate.referrer
  } else {
    resetValidation()
    educations.value = [{ eduLevel: '', school: '', major: '' }]
    workExperiences.value = [
      { workplace: '', workFrom: '', workTo: '', workTitle: '', workDescription: '' },
    ]
    quickAddRefToTalentPool.value = false
    showReferrerInput.value = false
  }
  cvFile.value = null
  avatarImage.value = null
  expandedEducations.value = [true]
  expandedWorkExperiences.value = [true]
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
    if (props.mode === 'edit') {
      resetForm()
    }
  },
)
//#endregion
</script>

<template>
  <MsModal
    :visible="visible"
    :title="modalTitle"
    size="large"
    :ok-text="confirmText"
    :loading="loading"
    @update:visible="$emit('update:visible', $event)"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="candidate-modal-content">
      <!-- CV Dropzone -->
      <div class="cv-dropzone">
        <div class="cv-dropzone__text">
          <label for="cv-upload" style="cursor: pointer"
            >Kéo thả hoặc bấm vào đây để tải CV lên</label
          >
          <input
            id="cv-upload"
            type="file"
            style="display: none"
            accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
            @change="handleCVUpload"
          />
        </div>
        <div class="cv-dropzone__hint">
          Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng &lt; 15 Mb)
        </div>
        <div v-if="cvFile" class="cv-dropzone__file">✓ {{ cvFile.name }}</div>
      </div>

      <!-- Form Container - Single Column with avatar at top -->
      <div class="form-container">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar-uploader">
            <div v-if="!avatarImage" class="avatar-uploader__circle">
              <label
                for="avatar-upload"
                style="
                  cursor: pointer;
                  width: 63px;
                  height: 63px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                Ảnh
              </label>
              <input
                id="avatar-upload"
                type="file"
                style="display: none"
                accept="image/*"
                @change="handleAvatarUpload"
              />
            </div>
            <img v-else :src="avatarImage" alt="Avatar" class="avatar-uploader__image" />
          </div>
        </div>

        <!-- Form Fields -->
        <div class="form-fields">
          <!-- Basic Info Section -->
          <div class="form-row form-row--full">
            <label class="form-label">Họ và tên <span class="req">*</span></label>
            <MsInput v-model="fullName" placeholder="Nhập họ và tên" :error="!!errors.fullName" />
            <span v-if="errors.fullName" class="form-error">{{ errors.fullName }}</span>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Ngày sinh</label>
              <MsDatePicker v-model="dob" placeholder="dd/MM/yyyy" />
            </div>

            <div class="form-row">
              <label class="form-label">Giới tính</label>
              <MsSelect v-model="gender" placeholder="Chọn giới tính" :options="genderOptions" />
            </div>
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Khu vực</label>
            <div class="input-with-more">
              <MsSelect v-model="area" placeholder="Chọn giá trị" :options="areaOptions" />
              <button type="button" class="more-btn" aria-label="more">…</button>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Số điện thoại</label>
              <MsInput v-model="phone" placeholder="Nhập số điện thoại" :error="!!errors.phone" />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-row">
              <label class="form-label">Email</label>
              <MsInput v-model="email" placeholder="Nhập Email" :error="!!errors.email" />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Địa chỉ</label>
            <MsInput v-model="address" placeholder="Nhập địa chỉ" />
          </div>

          <!-- Education Section -->
          <div class="section-title">HỌC VẤN</div>

          <div v-for="(edu, eduIdx) in educations" :key="eduIdx" class="education-item">
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
                <MsInput v-model="edu.major" placeholder="Nhập chuyên ngành" />
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

          <!-- Application Info -->
          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Ngày ứng tuyển <span class="req">*</span></label>
              <MsDatePicker
                v-model="appliedDate"
                placeholder="dd/MM/yyyy"
                :error="!!errors.appliedDate"
              />
              <span v-if="errors.appliedDate" class="form-error">{{ errors.appliedDate }}</span>
            </div>

            <div class="form-row">
              <label class="form-label">Nguồn ứng viên</label>
              <MsSelect
                v-model="source"
                placeholder="Chọn nguồn ứng viên"
                :options="sourceOptions"
              />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Nhân sự khai thác</label>
              <MsSelect
                v-model="exploiter"
                placeholder="Chọn nhân sự khai thác"
                :options="exploiterOptions"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Cộng tác viên</label>
              <MsSelect
                v-model="collaborator"
                placeholder="Chọn cộng tác viên"
                :options="collaboratorOptions"
              />
            </div>
          </div>

          <!-- References Section -->
          <div class="form-row form-row--full">
            <label class="form-checkbox">
              <input v-model="quickAddRefToTalentPool" type="checkbox" />
              <span>Thêm nhanh người tham chiếu vào kho ứng viên</span>
            </label>
          </div>

          <div class="form-row form-row--full" v-if="!showReferrerInput">
            <button type="button" class="btn-link-add" @click="showReferrerInput = true">
              <span class="icon-plus">+</span> Thêm người giới thiệu
            </button>
          </div>

          <div class="form-row form-row--full" v-else>
            <label class="form-label">Người giới thiệu</label>
            <MsInput v-model="referrer" placeholder="Nhập người giới thiệu" />
          </div>

          <div class="form-row form-row--full">
            <label class="form-label">Nơi làm việc gần đây</label>
            <MsInput v-model="recentWork" placeholder="Nhập nơi làm việc gần đây" />
          </div>

          <!-- Work Experience Section -->
          <div class="form-row form-row--full" v-if="workExperiences.length === 0">
            <button type="button" class="btn-link-add" @click="addWorkExperience">
              <span class="icon-plus">+</span> Thêm kinh nghiệm làm việc
            </button>
          </div>

          <div v-else>
            <div v-for="(work, workIdx) in workExperiences" :key="workIdx" class="work-item">
              <div class="form-row form-row--full">
                <label class="form-label">Nơi làm việc</label>
                <MsInput v-model="work.workplace" placeholder="Nhập nơi làm việc" />
              </div>

              <div class="form-row form-row--full">
                <label class="form-label">Thời gian</label>
                <div class="form-row__two">
                  <MsDatePicker v-model="work.workFrom" placeholder="dd/MM/yyyy" />
                  <span class="dash">-</span>
                  <MsDatePicker v-model="work.workTo" placeholder="dd/MM/yyyy" />
                </div>
              </div>

              <div class="form-row form-row--full">
                <label class="form-label">Vị trí công việc</label>
                <MsInput v-model="work.workTitle" placeholder="Nhập vị trí công việc" />
              </div>

              <div class="form-row form-row--full">
                <label class="form-label">Mô tả công việc</label>
                <MsTextArea v-model="work.workDescription" placeholder="Nhập mô tả công việc" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MsModal>
</template>

<style scoped>
.candidate-modal-content {
  padding: 16px 0;
}

/* Form Error Message */
.form-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

/* CV Dropzone */
.cv-dropzone {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  margin-bottom: 20px;

  cursor: pointer;
  transition: all 0.3s ease;
}

.cv-dropzone:hover {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.cv-dropzone__text {
  color: #0050b3;
  font-weight: 500;
  margin-bottom: 8px;
}

.cv-dropzone__text a {
  color: #0050b3;
  text-decoration: none;
  cursor: pointer;
}

.cv-dropzone__hint {
  color: #8c8c8c;
  font-size: 12px;
  margin-bottom: 8px;
}

.cv-dropzone__file {
  color: #52c41a;
  font-size: 12px;
  margin-top: 8px;
}

/* Form Container */
.form-container {
  display: grid;
  grid-template-columns: auto 1fr;

  margin-bottom: 16px;
}

.form-left {
  display: flex;
  justify-content: center;
}

.form-right {
  flex: 1;
}

/* Avatar Uploader */
.avatar-uploader {
  position: relative;
  width: 80px;
}

.avatar-uploader__circle {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  /* background-color: #f5f5f5; */
  border: 1px dashed #d9d9d9;
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
  background-color: #fff;
  color: #1890ff;
}

.avatar-uploader__image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #fff;
}

/* Form Fields Layout */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Form Rows - Default: Label Above */
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
  grid-template-columns: 120px 1fr;
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
  margin-right: 4px;
  color: #8c8c8c;
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
.action-caret,
.action-delete {
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

.action-delete {
  color: #ff4d4f;
}
.action-delete:hover {
  background-color: #fff1f0;
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
  padding-bottom: 8px; /* Align dots */
  font-weight: bold;
  font-size: 16px;
}

.more-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* Form Checkbox */
.form-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #1f1f1f;
  margin-top: 8px;
}

.form-checkbox input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

/* Section Title */
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 16px 0 8px 0;
  text-transform: uppercase;
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

/* Button Remove */
.btn-remove {
  background: none;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-remove:hover {
  background-color: #fff1f0;
  border-color: #d9363e;
  color: #d9363e;
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

  .form-row--inline {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
