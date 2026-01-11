<template>
  <div class="teacher-student-list-skeleton">
    <div
      v-for="i in count"
      :key="i"
      class="teacher-skeleton-student-item"
    >
      <!-- 아바타 영역 -->
      <div class="teacher-skeleton-avatar">
        <div class="teacher-skeleton-shimmer"></div>
      </div>

      <!-- 텍스트 영역 -->
      <div class="teacher-skeleton-text-area">
        <div class="teacher-skeleton-line skeleton-name"></div>
        <div class="teacher-skeleton-line skeleton-emotion"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 5
  }
})
</script>
