<template>
  <div v-if="modelValue" class="modal active image-preview-modal">
    <div class="image-preview-content">
      <div class="image-preview-header">
        <h3 class="text-lg font-bold text-gray-800">이미지 미리보기</h3>
        <button class="close-btn" @click="$emit('close')">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="image-preview-body">
        <img :src="imageUrl" alt="꽃 이미지 미리보기" class="preview-image" loading="lazy" />

        <!-- 캡쳐 옵션 -->
        <div class="capture-options">
          <label class="option-label">
            <input
              type="checkbox"
              :checked="includeDetails"
              @change="$emit('update:includeDetails', $event.target.checked)"
            />
            <span>포스트잇과 상세설명 포함</span>
          </label>
        </div>

        <div class="image-preview-info">
          <p class="text-sm text-gray-600">
            <strong>iPhone 사용자:</strong> 이미지를 길게 눌러 저장하세요
          </p>
          <p class="text-sm text-gray-600">
            <strong>데스크톱/안드로이드:</strong> 아래 버튼으로 다운로드하세요
          </p>
        </div>
        <button class="download-btn" @click="$emit('download')">
          <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
          이미지 다운로드
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  includeDetails: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'download', 'update:includeDetails'])
</script>
