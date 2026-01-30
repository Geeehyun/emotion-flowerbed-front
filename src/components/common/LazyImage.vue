<template>
  <div class="lazy-image-wrapper">
    <!-- 실제 이미지 (항상 렌더링) -->
    <img
      v-if="!hasError"
      :src="src"
      :alt="alt"
      :class="[imageClass, { 'image-loaded': !isLoading }]"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 에러 시 fallback 이미지 -->
    <img
      v-else
      :src="fallbackSrc"
      :alt="alt"
      :class="[imageClass, 'unknown-flower', 'fallback-image']"
    />

    <!-- 스켈레톤 (로딩 중) - 이미지 위에 오버레이 -->
    <FlowerSkeleton
      v-if="isLoading && !hasError"
      :type="skeletonType"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
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

// 에러 시 fallback 이미지 경로
const fallbackSrc = computed(() => {
  // src 경로에서 폴더 타입 파악 (/flowers/3d/, /flowers/3d_pot/, /flowers/realistic/)
  if (props.src.includes('/3d_pot/')) {
    return '/flowers/3d_pot/unknown.png'
  } else if (props.src.includes('/realistic/')) {
    return '/flowers/realistic/unknown.png'
  } else if (props.src.includes('/3d/')) {
    return '/flowers/3d/unknown.png'
  }
  // 기본값
  return '/flowers/3d/unknown.png'
})

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
