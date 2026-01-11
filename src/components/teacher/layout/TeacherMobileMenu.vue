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
          v-for="menuItem in menuItems"
          :key="menuItem.id"
          @click="handleNavClick(menuItem.view)"
          :class="{ active: currentView === menuItem.view }"
          class="teacher-mobile-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path
              v-for="(path, index) in menuItem.icon.paths"
              :key="index"
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="path"
            />
          </svg>
          <span>{{ menuItem.label }}</span>
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
import { teacherMenuItems } from '@/config/teacherMenuConfig.js'

const menuItems = teacherMenuItems

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
