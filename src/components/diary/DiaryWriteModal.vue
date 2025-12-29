<template>
  <div v-if="isOpen" class="modal active" @click="handleBackgroundClick">
    <div class="modal-content diary-write-modal">
      <div class="modal-header">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ date }}</h2>
          <p class="text-sm text-gray-500 mt-1">오늘 하루를 기록해보세요</p>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="modal-body">
        <form class="diary-form" @submit.prevent>
      <textarea
        :value="content"
        @input="$emit('update:content', $event.target.value)"
        placeholder="오늘은 어떤 하루였나요?&#10;당신의 이야기를 들려주세요...&#10;AI가 당신의 감정을 분석하여 어울리는 꽃을 심어드립니다"
        required
      ></textarea>
          <div class="flex justify-end gap-3">
            <button type="button" class="cancel-btn" @click="$emit('close')">취소</button>

            <!-- 테스트 버튼 (영역 선택 포함) -->
            <div class="test-btn-wrapper" @mouseenter="showAreaTooltip = true" @mouseleave="showAreaTooltip = false">
              <button
                type="button"
                class="save-btn test-btn"
                @click="handleTestSave(null)"
              >
                테스트 (랜덤)
              </button>

              <!-- 영역 선택 툴팁 -->
              <div v-if="showAreaTooltip" class="area-tooltip">
                <div class="area-tooltip-title">영역 선택 (선택사항)</div>
                <div class="area-options">
                  <button
                    type="button"
                    v-for="area in areas"
                    :key="area.code"
                    class="area-option"
                    :class="`area-${area.code}`"
                    @click="handleTestSave(area.code)"
                  >
                    <span class="area-color" :style="{ backgroundColor: area.color }"></span>
                    {{ area.name }}
                  </button>
                </div>
              </div>
            </div>

            <button type="button" class="save-btn" @click="$emit('save', false, null)">AI 분석</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'save', 'update:content'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 영역 선택 툴팁 표시 상태
const showAreaTooltip = ref(false)

// 무드미터 영역 목록
const areas = [
  { code: 'red', name: '빨강 (활동적)', color: '#EF5350' },
  { code: 'yellow', name: '노랑 (긍정적)', color: '#FFB74D' },
  { code: 'blue', name: '파랑 (차분한)', color: '#42A5F5' },
  { code: 'green', name: '초록 (평온한)', color: '#66BB6A' }
]

// 테스트 저장 핸들러
const handleTestSave = (areaCode) => {
  showAreaTooltip.value = false
  emit('save', true, areaCode)
}

const handleBackgroundClick = (event) => {
  if (event.target.classList.contains('modal')) {
    emit('close')
  }
}
</script>
