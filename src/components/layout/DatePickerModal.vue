<template>
  <div v-if="modelValue" class="modal active" @click="handleBackgroundClick">
    <div class="date-picker-content">
      <div class="date-picker-header">
        <h2 class="text-xl font-bold text-gray-800">날짜 선택</h2>
        <button class="close-btn" @click="$emit('close')">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="date-picker-body">
        <!-- 연도/월 선택 - 컴팩트 뷰 -->
        <div class="date-compact-section">
          <label class="date-label">연도 · 월</label>
          <div class="date-selector-row">
            <!-- 연도 선택 -->
            <div class="year-selector">
              <button class="nav-arrow" @click="$emit('change-year', -1)">◀</button>
              <div class="selected-value">{{ year }}년</div>
              <button class="nav-arrow" @click="$emit('change-year', 1)">▶</button>
            </div>

            <!-- 월 선택 -->
            <div class="month-selector">
              <button class="nav-arrow" @click="$emit('change-month', -1)">◀</button>
              <div class="selected-value">{{ month }}월</div>
              <button class="nav-arrow" @click="$emit('change-month', 1)">▶</button>
            </div>
          </div>
        </div>

        <!-- 일 선택 (일기 작성 모드일 때만) - 캘린더 형식 -->
        <div class="date-section calendar-section" v-if="isWriteMode">
          <label class="date-label">일</label>
          <div class="calendar-grid">
            <button
              v-for="dayNum in daysInMonth"
              :key="dayNum"
              type="button"
              class="calendar-day-btn"
              :class="{ active: dayNum === day }"
              @click="$emit('select-day', dayNum)"
            >
              {{ dayNum }}
            </button>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <button class="confirm-date-btn" @click="$emit('confirm')">
          {{ isWriteMode ? '일기 작성' : '확인' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    default: null
  },
  isWriteMode: {
    type: Boolean,
    default: false
  },
  daysInMonth: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm', 'change-year', 'change-month', 'select-day'])

const handleBackgroundClick = (event) => {
  if (event.target.classList.contains('modal')) {
    emit('close')
  }
}
</script>
