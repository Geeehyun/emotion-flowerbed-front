<template>
  <component :is="currentView" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Landing from './views/Landing.vue'
import Garden from './views/Garden.vue'

// JWT 토큰 확인
const isAuthenticated = ref(false)

const currentView = computed(() => {
  return isAuthenticated.value ? Garden : Landing
})

// 토큰 체크
const checkAuth = () => {
  const token = localStorage.getItem('accessToken')
  isAuthenticated.value = !!token
}

onMounted(() => {
  checkAuth()
})

// 전역에서 인증 상태 변경 가능하도록
window.setAuth = (value) => {
  isAuthenticated.value = value
}
</script>
