<template>
  <component :is="currentView" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Landing from './views/Landing.vue'
import Garden from './views/Garden.vue'
import Teacher from './views/Teacher.vue'

// JWT 토큰 확인
const isAuthenticated = ref(false)
const userType = ref(null)

const currentView = computed(() => {
  if (!isAuthenticated.value) {
    return Landing
  }

  // 인증된 경우 userType에 따라 화면 분기
  if (userType.value === 'TEACHER') {
    return Teacher
  }

  // 기본값은 학생 화면 (Garden)
  return Garden
})

// 토큰 체크
const checkAuth = () => {
  const token = localStorage.getItem('accessToken')
  const storedUserType = localStorage.getItem('userType')

  isAuthenticated.value = !!token
  userType.value = storedUserType
}

onMounted(() => {
  checkAuth()
})

// 전역에서 인증 상태 변경 가능하도록
window.setAuth = (value) => {
  isAuthenticated.value = value
  if (!value) {
    userType.value = null
  } else {
    // 인증 상태가 true로 변경되면 userType 다시 체크
    checkAuth()
  }
}
</script>
