<template>
  <header class="teacher-header">
    <!-- 햄버거 버튼 (모바일) -->
    <button @click="emit('open-mobile-menu')" class="teacher-mobile-menu-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <!-- 페이지 타이틀 -->
    <div class="teacher-header-title-section">
      <h1 class="teacher-page-title">{{ viewTitle }}</h1>
    </div>

    <!-- 헤더 액션 -->
    <div class="teacher-header-actions">
      <button @click="emit('open-moodmeter-modal')" class="teacher-moodmeter-info-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <span>감정 무드미터란?</span>
      </button>
      <span class="teacher-today-date">{{ todayDate }}</span>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  viewTitle: {
    type: String,
    required: true
  },
  todayDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['open-mobile-menu', 'open-moodmeter-modal'])
</script>
