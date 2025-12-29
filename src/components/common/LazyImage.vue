<template>
  <div class="lazy-image-wrapper">
    <!-- 실제 이미지 (항상 렌더링) -->
    <img
      :src="src"
      :alt="alt"
      :class="[imageClass, { 'image-loaded': !isLoading && !hasError }]"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 스켈레톤 (로딩 중) - 이미지 위에 오버레이 -->
    <FlowerSkeleton
      v-if="isLoading"
      :type="skeletonType"
    />

    <!-- 에러 시 fallback -->
    <div v-if="hasError" class="image-error">
      <div class="error-icon">🌸</div>
      <div class="error-text">이미지를 불러올 수 없습니다</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FlowerSkeleton from './FlowerSkeleton.vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: ''
  },
  skeletonType: {
    type: String,
    default: 'default'
  }
})

const isLoading = ref(true)
const hasError = ref(false)

const handleLoad = () => {
  isLoading.value = false
  hasError.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}

// src가 변경되면 다시 로딩 상태로
watch(() => props.src, () => {
  isLoading.value = true
  hasError.value = false
})
</script>
