<template>
  <aside class="teacher-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="teacher-sidebar-header">
      <div class="teacher-sidebar-logo">
        <img src="/logos/logo.png" alt="감정 화단 로고" class="teacher-logo-image">
        <span v-if="!isCollapsed" class="teacher-logo-text">감정 화단</span>
      </div>
      <button @click="emit('update:isCollapsed', !isCollapsed)" class="teacher-collapse-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>

    <nav class="teacher-sidebar-nav">
      <a
        @click="emit('update:currentView', 'dashboard')"
        :class="{ active: currentView === 'dashboard' }"
        class="teacher-nav-item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
        <span v-if="!isCollapsed">대시보드</span>
      </a>

      <a
        @click="emit('update:currentView', 'classMap')"
        :class="{ active: currentView === 'classMap' }"
        class="teacher-nav-item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <span v-if="!isCollapsed">학급 감정 화단</span>
      </a>

      <a
        @click="emit('update:currentView', 'studentMap')"
        :class="{ active: currentView === 'studentMap' }"
        class="teacher-nav-item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.499 5.221 69.17 69.17 0 0 1-2.192.943M8.119 16.489A15.495 15.495 0 0 1 12 15c2.31 0 4.438.784 6.131 2.1.43-.25.873-.49 1.334-.716-.98-1.78-2.68-3.09-4.715-3.633a6.002 6.002 0 0 0-5.5 0c-2.035.543-3.735 1.853-4.715 3.633.461.226.904.466 1.334.716a15.495 15.495 0 0 1 2.25-1.611Z" />
        </svg>
        <span v-if="!isCollapsed">학생별 상세 분석</span>
      </a>
    </nav>

    <!-- 사이드바 푸터 (계정정보) -->
    <div class="teacher-sidebar-footer">
      <!-- 확장 상태: 전체 정보 표시 -->
      <div v-if="!isCollapsed" class="teacher-user-profile">
        <div class="teacher-user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div class="teacher-user-info">
          <p class="teacher-user-name">{{ teacherInfo.name }} 선생님</p>
          <p class="teacher-user-school">{{ teacherInfo.schoolNm }}</p>
          <button @click="emit('logout')" class="teacher-logout-btn">로그아웃</button>
        </div>
      </div>

      <!-- 축약 상태: 아이콘만 표시 + 툴팁 -->
      <div v-else class="teacher-user-profile-collapsed">
        <button
          @click="emit('update:isUserTooltipOpen', !isUserTooltipOpen)"
          class="teacher-user-avatar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>

        <!-- 툴팁 -->
        <div v-if="isUserTooltipOpen" class="teacher-user-tooltip">
          <div class="teacher-tooltip-arrow"></div>
          <div class="teacher-tooltip-content">
            <div class="teacher-tooltip-user-info">
              <p class="teacher-tooltip-user-name">{{ teacherInfo.name }} 선생님</p>
              <p class="teacher-tooltip-user-school">{{ teacherInfo.schoolNm }}</p>
              <p class="teacher-tooltip-user-id">{{ teacherInfo.userId }}</p>
            </div>
            <button @click="emit('logout')" class="teacher-tooltip-logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  teacherInfo: {
    type: Object,
    required: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  currentView: {
    type: String,
    required: true
  },
  isUserTooltipOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isCollapsed', 'update:currentView', 'update:isUserTooltipOpen', 'logout'])
</script>
