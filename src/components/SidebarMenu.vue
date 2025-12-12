<template>
  <div>
    <!-- 오버레이 (메뉴가 열렸을 때 배경 어둡게) -->
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="$emit('update:modelValue', false)"
      ></div>
    </transition>

    <!-- 사이드바 메뉴 -->
    <transition name="slide">
      <div
        v-if="modelValue"
        class="sidebar-container fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- 헤더 -->
        <div class="sidebar-header flex items-center justify-between p-5 border-b-2 border-gray-200">
          <h2 class="sidebar-title text-xl font-bold">메뉴</h2>
          <button
            @click="$emit('update:modelValue', false)"
            class="close-btn"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- 메뉴 목록 -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="handleMenuClick(item.id)"
            class="menu-item w-full px-6 py-4 flex items-center space-x-4 transition-all text-left mb-2"
            :class="{ 'active': item.active }"
          >
            <component :is="item.icon" class="menu-icon w-6 h-6" />
            <span class="text-lg menu-text">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto badge-text"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>

        <!-- 푸터 -->
        <div class="sidebar-footer p-5 border-t-2 border-gray-200 text-center text-sm footer-text">
          감정 화단 v1.0
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { menuItems as baseMenuItems } from '@/config/menuConfig.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  hasNewLetter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'menu-select'])

// hasNewLetter에 따라 동적으로 배지 추가
const menuItems = computed(() => {
  return baseMenuItems.map(item => {
    if (item.id === 'letter') {
      return {
        ...item,
        badge: props.hasNewLetter ? 'New' : item.badge
      }
    }
    return item
  })
})

const handleMenuClick = (menuId) => {
  emit('menu-select', menuId)
  emit('update:modelValue', false)
}
</script>
