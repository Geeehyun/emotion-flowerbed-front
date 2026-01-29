<template>
  <BaseModal
    v-model="isOpen"
    max-width="440px"
    @close="handleClose"
  >
    <template #header>
      <div class="signup-modal-header">
        <h2 class="signup-modal-title">회원가입</h2>
        <p class="signup-modal-subtitle">
          {{ stepSubtitle }}
        </p>
      </div>
    </template>

    <template #default>
      <!-- 1단계: 사용자 유형 선택 -->
      <div v-if="step === 1" class="signup-type-selection">
        <button
          type="button"
          class="signup-type-btn"
          @click="selectUserType('STUDENT')"
        >
          <span class="signup-type-icon">🎒</span>
          <span class="signup-type-label">학생</span>
          <span class="signup-type-desc">일기를 작성하고 감정 꽃을 키워요</span>
        </button>
        <button
          type="button"
          class="signup-type-btn"
          @click="selectUserType('TEACHER')"
        >
          <span class="signup-type-icon">📚</span>
          <span class="signup-type-label">선생님</span>
          <span class="signup-type-desc">학생들의 감정을 살펴볼 수 있어요</span>
        </button>
      </div>

      <!-- 2단계: 약관 동의 -->
      <div v-else-if="step === 2" class="signup-terms-section">
        <!-- 뒤로가기 버튼 -->
        <button type="button" class="signup-back-btn" @click="goBackToStep1">
          ← 유형 다시 선택
        </button>

        <!-- 전체 동의 -->
        <div class="terms-all-agree">
          <label class="terms-checkbox-label">
            <input
              type="checkbox"
              v-model="agreeAll"
              @change="handleAgreeAllChange"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text all">전체 동의</span>
          </label>
        </div>

        <!-- 이용약관 -->
        <div class="terms-item">
          <div class="terms-item-header">
            <label class="terms-checkbox-label">
              <input type="checkbox" v-model="agreements.terms" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">[필수] 이용약관 동의</span>
            </label>
            <button type="button" class="terms-toggle-btn" @click="toggleTermsView('terms')">
              {{ expandedTerms.terms ? '접기' : '보기' }}
            </button>
          </div>
          <div v-if="expandedTerms.terms" class="terms-content">
            <p class="terms-test-notice">※ 테스트용 예시 약관입니다. 실제 서비스 시 변경됩니다.</p>
            <h4>나의 감정 화단 이용약관</h4>
            <p><strong>제1조 (목적)</strong><br/>
            이 약관은 "나의 감정 화단" 서비스(이하 "서비스")의 이용조건 및 절차, 회원과 서비스 제공자의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.</p>
            <p><strong>제2조 (서비스의 내용)</strong><br/>
            1. 감정 일기 작성 및 저장 기능<br/>
            2. AI 기반 감정 분석 및 꽃 매칭 기능<br/>
            3. 감정 도감 및 통계 제공 기능<br/>
            4. 선생님의 학급 감정 현황 모니터링 기능</p>
            <p><strong>제3조 (회원의 의무)</strong><br/>
            1. 회원은 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.<br/>
            2. 회원은 서비스를 이용하여 얻은 정보를 서비스 제공자의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등의 방법으로 이용하거나 제3자에게 이용하게 해서는 안 됩니다.<br/>
            3. 회원은 서비스 이용과 관련하여 관계 법령, 이 약관의 규정, 이용안내 및 서비스 상에 공지한 주의사항을 준수해야 합니다.</p>
            <p><strong>제4조 (서비스 이용)</strong><br/>
            1. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다.<br/>
            2. 서비스 제공자는 시스템 점검, 증설 및 교체, 통신 두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
            <p><strong>제5조 (회원 탈퇴 및 자격 상실)</strong><br/>
            1. 회원은 언제든지 서비스 내 탈퇴 기능을 통해 탈퇴를 요청할 수 있으며, 서비스 제공자는 즉시 회원 탈퇴를 처리합니다.<br/>
            2. 회원이 약관을 위반한 경우, 서비스 제공자는 회원 자격을 제한 또는 정지시킬 수 있습니다.</p>
          </div>
        </div>

        <!-- 개인정보처리방침 -->
        <div class="terms-item">
          <div class="terms-item-header">
            <label class="terms-checkbox-label">
              <input type="checkbox" v-model="agreements.privacy" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">[필수] 개인정보처리방침 동의</span>
            </label>
            <button type="button" class="terms-toggle-btn" @click="toggleTermsView('privacy')">
              {{ expandedTerms.privacy ? '접기' : '보기' }}
            </button>
          </div>
          <div v-if="expandedTerms.privacy" class="terms-content">
            <p class="terms-test-notice">※ 테스트용 예시 약관입니다. 실제 서비스 시 변경됩니다.</p>
            <h4>개인정보처리방침</h4>
            <p><strong>1. 수집하는 개인정보 항목</strong><br/>
            - 필수항목: 아이디, 비밀번호, 이름, 학교명, 학년, 반<br/>
            - 자동수집항목: 서비스 이용 기록, 접속 로그</p>
            <p><strong>2. 개인정보의 수집 및 이용목적</strong><br/>
            - 회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별<br/>
            - 서비스 제공: 감정 일기 저장, 감정 분석 결과 제공, 학급 관리 기능 제공<br/>
            - 서비스 개선: 신규 서비스 개발 및 기존 서비스 개선</p>
            <p><strong>3. 개인정보의 보유 및 이용기간</strong><br/>
            - 회원 탈퇴 시까지 보유하며, 탈퇴 시 지체 없이 파기합니다.<br/>
            - 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
            <p><strong>4. 개인정보의 제3자 제공</strong><br/>
            - 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.<br/>
            - 단, 회원의 동의가 있거나 법령의 규정에 의한 경우는 예외로 합니다.</p>
            <p><strong>5. 개인정보의 파기절차 및 방법</strong><br/>
            - 전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제<br/>
            - 종이 문서: 분쇄기로 분쇄하거나 소각</p>
            <p><strong>6. 개인정보 보호책임자</strong><br/>
            - 성명: 홍길동<br/>
            - 연락처: privacy@example.com</p>
          </div>
        </div>

        <!-- 다음 버튼 -->
        <button
          type="button"
          class="signup-modal-btn"
          :disabled="!canProceedToStep3"
          @click="goToStep3"
        >
          다음
        </button>
      </div>

      <!-- 3단계: 정보 입력 -->
      <form v-else class="signup-modal-form" @submit.prevent="handleSubmit">
        <!-- 뒤로가기 버튼 -->
        <button type="button" class="signup-back-btn" @click="goBackToStep2">
          ← 이전 단계
        </button>

        <!-- 아이디 -->
        <div class="form-group">
          <label class="form-label">아이디</label>
          <div class="form-input-with-btn">
            <input
              v-model="signupForm.userId"
              type="text"
              class="form-input"
              placeholder="아이디를 입력하세요"
              required
              @input="resetDuplicateCheck"
            />
            <button
              type="button"
              class="duplicate-check-btn"
              :class="{ 'checked': isDuplicateChecked && !isDuplicate }"
              :disabled="!signupForm.userId || isCheckingDuplicate"
              @click="handleCheckDuplicate"
            >
              {{ isCheckingDuplicate ? '확인중...' : (isDuplicateChecked && !isDuplicate ? '확인완료' : '중복확인') }}
            </button>
          </div>
          <p v-if="duplicateMessage" class="form-message" :class="{ 'error': isDuplicate, 'success': !isDuplicate }">
            {{ duplicateMessage }}
          </p>
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input
            v-model="signupForm.password"
            type="password"
            class="form-input"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label class="form-label">비밀번호 확인</label>
          <input
            v-model="signupForm.passwordConfirm"
            type="password"
            class="form-input"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
          <p v-if="signupForm.passwordConfirm && !isPasswordMatch" class="form-message error">
            비밀번호가 일치하지 않습니다
          </p>
        </div>

        <!-- 이름 -->
        <div class="form-group">
          <label class="form-label">이름</label>
          <input
            v-model="signupForm.name"
            type="text"
            class="form-input"
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <!-- 학교 정보 (고정) -->
        <div class="form-group">
          <label class="form-label">학교</label>
          <input
            type="text"
            class="form-input disabled"
            :value="FIXED_SCHOOL.schoolNm"
            disabled
          />
        </div>

        <!-- 학년/반 -->
        <div class="form-group form-row">
          <div class="form-col">
            <label class="form-label">학년</label>
            <select v-model="signupForm.grade" class="form-select" required>
              <option value="" disabled>선택</option>
              <option v-for="g in 6" :key="g" :value="g">{{ g }}학년</option>
            </select>
          </div>
          <div class="form-col">
            <label class="form-label">반</label>
            <select v-model="signupForm.classNum" class="form-select" required>
              <option value="" disabled>선택</option>
              <option v-for="c in 20" :key="c" :value="c">{{ c }}반</option>
            </select>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- 가입 버튼 -->
        <button
          type="submit"
          class="signup-modal-btn"
          :disabled="!canSubmit || isLoading"
        >
          <span v-if="!isLoading">가입하기</span>
          <span v-else>가입 중...</span>
        </button>
      </form>
    </template>
  </BaseModal>

  <!-- 성공 알림 모달 -->
  <AlertModal
    v-model="showSuccessAlert"
    type="success"
    message="회원가입이 완료되었습니다! 로그인해주세요."
    @close="handleSuccessAlertClose"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import AlertModal from '@/components/common/modals/AlertModal.vue'
import { signup, checkDuplicate } from '@/services/authApi'

// 고정 학교 정보 (내부 테스트용)
const FIXED_SCHOOL = {
  schoolNm: '천재초등학교',
  schoolCode: '1234'
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'signup-success'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 단계 관리 (1: 유형선택, 2: 약관동의, 3: 정보입력)
const step = ref(1)

// 단계별 서브타이틀
const stepSubtitle = computed(() => {
  if (step.value === 1) return '가입 유형을 선택해주세요'
  if (step.value === 2) return '약관에 동의해주세요'
  return userTypeLabel.value + ' 정보를 입력해주세요'
})

// 폼 데이터
const signupForm = ref({
  userId: '',
  password: '',
  passwordConfirm: '',
  name: '',
  userTypeCd: '',
  grade: '',
  classNum: ''
})

// 약관 동의 상태
const agreements = ref({
  terms: false,
  privacy: false
})

// 전체 동의
const agreeAll = ref(false)

// 약관 펼침 상태
const expandedTerms = ref({
  terms: false,
  privacy: false
})

// 상태 관리
const isLoading = ref(false)
const errorMessage = ref('')
const showSuccessAlert = ref(false)

// 중복 확인 상태
const isCheckingDuplicate = ref(false)
const isDuplicateChecked = ref(false)
const isDuplicate = ref(false)
const duplicateMessage = ref('')

// 사용자 유형 라벨
const userTypeLabel = computed(() => {
  return signupForm.value.userTypeCd === 'STUDENT' ? '학생' : '선생님'
})

// 비밀번호 일치 여부
const isPasswordMatch = computed(() => {
  return signupForm.value.password === signupForm.value.passwordConfirm
})

// 3단계로 진행 가능 여부 (약관 모두 동의)
const canProceedToStep3 = computed(() => {
  return agreements.value.terms && agreements.value.privacy
})

// 제출 가능 여부
const canSubmit = computed(() => {
  return signupForm.value.userId &&
    signupForm.value.password &&
    signupForm.value.passwordConfirm &&
    isPasswordMatch.value &&
    signupForm.value.name &&
    signupForm.value.grade &&
    signupForm.value.classNum &&
    isDuplicateChecked.value &&
    !isDuplicate.value
})

// 개별 약관 체크 시 전체 동의 상태 업데이트
watch(agreements, (newVal) => {
  agreeAll.value = newVal.terms && newVal.privacy
}, { deep: true })

// 전체 동의 체크박스 핸들러
const handleAgreeAllChange = () => {
  agreements.value.terms = agreeAll.value
  agreements.value.privacy = agreeAll.value
}

// 약관 보기/접기 토글
const toggleTermsView = (type) => {
  expandedTerms.value[type] = !expandedTerms.value[type]
}

// 사용자 유형 선택 → 2단계로
const selectUserType = (type) => {
  signupForm.value.userTypeCd = type
  step.value = 2
}

// 2단계 → 1단계로 돌아가기
const goBackToStep1 = () => {
  step.value = 1
  resetAgreements()
}

// 2단계 → 3단계로
const goToStep3 = () => {
  if (canProceedToStep3.value) {
    step.value = 3
  }
}

// 3단계 → 2단계로 돌아가기
const goBackToStep2 = () => {
  step.value = 2
  resetForm()
}

// 약관 동의 초기화
const resetAgreements = () => {
  agreements.value = { terms: false, privacy: false }
  agreeAll.value = false
  expandedTerms.value = { terms: false, privacy: false }
}

// 중복 확인 초기화
const resetDuplicateCheck = () => {
  isDuplicateChecked.value = false
  isDuplicate.value = false
  duplicateMessage.value = ''
}

// 아이디 중복 확인
const handleCheckDuplicate = async () => {
  if (!signupForm.value.userId) return

  isCheckingDuplicate.value = true
  duplicateMessage.value = ''

  try {
    const result = await checkDuplicate(signupForm.value.userId)
    isDuplicateChecked.value = true
    isDuplicate.value = result.duplicate

    if (result.duplicate) {
      duplicateMessage.value = '이미 사용 중인 아이디입니다'
    } else {
      duplicateMessage.value = '사용 가능한 아이디입니다'
    }
  } catch (error) {
    duplicateMessage.value = error.message
    isDuplicate.value = true
  } finally {
    isCheckingDuplicate.value = false
  }
}

// 회원가입 제출
const handleSubmit = async () => {
  if (!canSubmit.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    // 학급코드 조합: 학년(1자리) + 반(2자리)
    const classCode = String(signupForm.value.grade) + String(signupForm.value.classNum).padStart(2, '0')

    const userData = {
      userId: signupForm.value.userId,
      password: signupForm.value.password,
      name: signupForm.value.name,
      userTypeCd: signupForm.value.userTypeCd,
      schoolCode: FIXED_SCHOOL.schoolCode,
      schoolNm: FIXED_SCHOOL.schoolNm,
      classCode: classCode
    }

    await signup(userData)

    // 성공 시
    emit('signup-success')
    showSuccessAlert.value = true

  } catch (error) {
    errorMessage.value = error.message || '회원가입에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 폼 초기화
const resetForm = () => {
  signupForm.value = {
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    userTypeCd: signupForm.value.userTypeCd,
    grade: '',
    classNum: ''
  }
  errorMessage.value = ''
  resetDuplicateCheck()
}

// 모달 닫기
const handleClose = () => {
  step.value = 1
  signupForm.value = {
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    userTypeCd: '',
    grade: '',
    classNum: ''
  }
  errorMessage.value = ''
  resetDuplicateCheck()
  resetAgreements()
  isLoading.value = false

  emit('update:modelValue', false)
  emit('close')
}

// 성공 알림 닫기
const handleSuccessAlertClose = () => {
  showSuccessAlert.value = false
  handleClose()
}
</script>
