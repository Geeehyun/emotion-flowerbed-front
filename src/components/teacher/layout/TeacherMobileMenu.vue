<template>
  <div v-if="isOpen" class="teacher-mobile-menu-overlay" @click="emit('update:isOpen', false)">
    <div class="teacher-mobile-menu-content" @click.stop>
      <!-- 메뉴 헤더 -->
      <div class="teacher-mobile-menu-header">
        <div class="teacher-mobile-menu-logo">
          <img src="/logos/logo.png" alt="감정 화단 로고" class="teacher-logo-image">
          <span class="teacher-logo-text">감정 화단</span>
        </div>
        <button @click="emit('update:isOpen', false)" class="teacher-mobile-menu-close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 메뉴 네비게이션 -->
      <nav class="teacher-mobile-menu-nav">
        <a
          @click="handleNavClick('dashboard')"
          :class="{ active: currentView === 'dashboard' }"
          class="teacher-mobile-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          <span>대시보드</span>
        </a>

        <a
          @click="handleNavClick('classMap')"
          :class="{ active: currentView === 'classMap' }"
          class="teacher-mobile-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span>학급 감정 화단</span>
        </a>

        <a
          @click="handleNavClick('studentMap')"
          :class="{ active: currentView === 'studentMap' }"
          class="teacher-mobile-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.499 5.221 69.17 69.17 0 0 1-2.192.943M8.119 16.489A15.495 15.495 0 0 1 12 15c2.31 0 4.438.784 6.131 2.1.43-.25.873-.49 1.334-.716-.98-1.78-2.68-3.09-4.715-3.633a6.002 6.002 0 0 0-5.5 0c-2.035.543-3.735 1.853-4.715 3.633.461.226.904.466 1.334.716a15.495 15.495 0 0 1 2.25-1.611Z" />
          </svg>
          <span>학생별 상세 분석</span>
        </a>
      </nav>

      <!-- 사용자 정보 (모바일) -->
      <div class="teacher-mobile-menu-footer">
        <div class="teacher-mobile-user-profile">
          <div class="teacher-mobile-user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div class="teacher-mobile-user-info">
            <p class="teacher-mobile-user-name">{{ teacherInfo.name }} 선생님</p>
            <p class="teacher-mobile-user-school">{{ teacherInfo.schoolNm }}</p>
          </div>
        </div>
        <button @click="emit('logout')" class="teacher-mobile-logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentView: {
    type: String,
    required: true
  },
  teacherInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:isOpen', 'update:currentView', 'logout'])

const handleNavClick = (view) => {
  emit('update:currentView', view)
  emit('update:isOpen', false)
}
</script>
