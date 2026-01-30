<template>
  <div>
    <!-- 오버레이 -->
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-50 z-[10002]"
        @click="$emit('update:modelValue', false)"
      ></div>
    </transition>

    <!-- 설정 모달 -->
    <transition name="slide-up">
      <div
        v-if="modelValue"
        class="theme-modal fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[10003] p-6 pb-8"
      >
        <!-- 핸들 바 -->
        <div class="flex justify-center mb-4">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <!-- 헤더 -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="theme-modal-title text-xl font-bold text-gray-800">테마 설정</h2>
          <button
            @click="$emit('update:modelValue', false)"
            class="text-gray-500 hover:text-gray-700 p-1"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- 화단 배경 선택 -->
        <div class="mb-6">
          <h3 class="theme-section-title text-sm font-semibold text-gray-600 mb-3">화단 배경</h3>
          <div class="flex gap-3">
            <button
              v-for="bg in gardenBackgrounds"
              :key="bg.id"
              @click="selectGardenBg(bg.id)"
              class="garden-bg-option relative rounded-xl overflow-hidden border-3 transition-all"
              :class="state.gardenBgId === bg.id ? 'border-amber-500 shadow-lg' : 'border-gray-200'"
            >
              <img
                :src="bg.src"
                :alt="bg.name"
                class="w-24 h-20 object-cover"
              />
              <!-- 선택 표시 -->
              <div
                v-if="state.gardenBgId === bg.id"
                class="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <CheckIcon class="w-3 h-3 text-white" />
              </div>
            </button>
          </div>
        </div>

        <!-- 색상 선택 -->
        <div>
          <h3 class="theme-section-title text-sm font-semibold text-gray-600 mb-3">색상</h3>
          <div class="flex gap-4">
            <button
              v-for="color in themeColors"
              :key="color.id"
              @click="selectColor(color.id)"
              class="color-option relative w-12 h-12 rounded-full transition-all"
              :style="{ backgroundColor: color.dotBase }"
              :class="state.colorId === color.id ? 'ring-3 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'"
            >
              <!-- 선택 표시 -->
              <div
                v-if="state.colorId === color.id"
                class="absolute inset-0 flex items-center justify-center"
              >
                <CheckIcon class="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useTheme, themeColors, gardenBackgrounds } from '@/composables/useTheme.js'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'garden-bg-change'])

const { state, setColor, setGardenBg } = useTheme()

const selectColor = (colorId) => {
  setColor(colorId)
}

const selectGardenBg = (bgId) => {
  setGardenBg(bgId)
  emit('garden-bg-change', bgId)
}
</script>

<style scoped>
.theme-modal {
  max-height: 60vh;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

.theme-modal-title {
  font-family: var(--font-body);
}

.theme-section-title {
  font-family: var(--font-body);
}

.garden-bg-option {
  border-width: 3px;
}

.color-option {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
