<template>
  <div class="flower-skeleton" :class="skeletonClass">
    <!-- 꽃 실루엣 SVG -->
    <svg class="flower-silhouette" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 중앙 원 -->
      <circle cx="50" cy="50" r="12" class="flower-center"/>

      <!-- 상단 꽃잎 -->
      <ellipse cx="50" cy="25" rx="10" ry="18" class="flower-petal"/>

      <!-- 우측상단 꽃잎 (72도 회전) -->
      <ellipse cx="50" cy="25" rx="10" ry="18" transform="rotate(72 50 50)" class="flower-petal"/>

      <!-- 우측하단 꽃잎 (144도 회전) -->
      <ellipse cx="50" cy="25" rx="10" ry="18" transform="rotate(144 50 50)" class="flower-petal"/>

      <!-- 좌측하단 꽃잎 (216도 회전) -->
      <ellipse cx="50" cy="25" rx="10" ry="18" transform="rotate(216 50 50)" class="flower-petal"/>

      <!-- 좌측상단 꽃잎 (288도 회전) -->
      <ellipse cx="50" cy="25" rx="10" ry="18" transform="rotate(288 50 50)" class="flower-petal"/>
    </svg>

    <!-- Shimmer 효과 -->
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card', 'detail', 'watercolor'].includes(value)
  }
})

const skeletonClass = computed(() => {
  return `skeleton-${props.type}`
})
</script>
