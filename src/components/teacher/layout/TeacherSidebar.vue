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
        v-for="menuItem in menuItems"
        :key="menuItem.id"
        @click="emit('update:currentView', menuItem.view)"
        :class="{ active: currentView === menuItem.view }"
        class="teacher-nav-item"
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
        <span v-if="!isCollapsed">{{ menuItem.label }}</span>
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
import { teacherMenuItems } from '@/config/teacherMenuConfig.js'

const menuItems = teacherMenuItems

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
