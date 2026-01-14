<template>
  <div class="teacher-attention-skeleton">
    <!-- 스켈레톤 카드들 -->
    <div
      v-for="i in 3"
      :key="i"
      class="teacher-skeleton-attention-card"
    >
      <div class="teacher-skeleton-line skeleton-name"></div>
      <div class="teacher-skeleton-line skeleton-reason"></div>
      <div class="teacher-skeleton-line skeleton-meta"></div>
      <div class="teacher-skeleton-shimmer"></div>
    </div>
  </div>
</template>

<script setup>
</script>
