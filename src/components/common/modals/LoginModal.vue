<template>
  <BaseModal
    v-model="isOpen"
    max-width="440px"
    @close="handleClose"
  >
    <template #header>
      <div class="login-modal-header">
        <h2 class="login-modal-title">로그인</h2>
        <p class="login-modal-subtitle">나의 감정 화단에 오신 것을 환영해요</p>
      </div>
    </template>

    <template #default>
      <form class="login-modal-form" @submit.prevent="handleSubmit">
        <div class="test-login-btn-area">
          <button type="button" class="test-login-btn" data-id="chunjae2" data-password="1234" @click="handleTestLogin" :disabled="isLoading">
            이천재 (학생)
          </button>
          <button type="button" class="test-login-btn" data-id="teacher1" data-password="1234" @click="handleTestLogin" :disabled="isLoading">
            이교육 (선생님)
          </button>
        </div>
        

        <div class="form-group">
          <label class="form-label">아이디</label>
          <input
            v-model="loginForm.userId"
            type="text"
            class="form-input"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input
            v-model="loginForm.password"
            type="password"
            class="form-input"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-modal-btn" :disabled="isLoading">
          <span v-if="!isLoading">로그인하기</span>
          <span v-else>로그인 중...</span>
        </button>

      </form>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import { login } from '@/services/authApi'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const loginForm = ref({
  userId: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // 로그인 API 호출
    const data = await login(loginForm.value)

    // 토큰 저장
    localStorage.setItem('accessToken', data.accessToken)
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }

    // userType 저장
    if (data.userType) {
      localStorage.setItem('userType', data.userType)
    }

    // 인증 상태 업데이트
    window.setAuth(true)

    // 모달 닫기
    handleClose()

  } catch (error) {
    errorMessage.value = error.message || '로그인에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleTestLogin = (event) => {
  const target = event.target;
  const id = target.dataset.id;
  const password = target.dataset.password;
  console.log(id, password);
  // 환경변수에서 테스트 계정 정보 가져오기
  loginForm.value.userId = id;
  loginForm.value.password = password;
  handleSubmit()
}

const handleClose = () => {
  // 폼 초기화
  loginForm.value = {
    userId: '',
    password: ''
  }
  errorMessage.value = ''
  isLoading.value = false

  emit('update:modelValue', false)
  emit('close')
}
</script>
