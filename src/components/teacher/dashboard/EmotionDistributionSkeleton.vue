<template>
  <div class="teacher-distribution-skeleton">
    <!-- 차트 영역 스켈레톤 -->
    <div class="teacher-skeleton-chart-wrapper">
      <div class="teacher-skeleton-chart-circle">
        <div class="teacher-skeleton-shimmer"></div>
      </div>
    </div>

    <!-- 영역 통계 스켈레톤 -->
    <div class="teacher-skeleton-zone-stats">
      <div
        v-for="i in 4"
        :key="i"
        class="teacher-skeleton-zone-item"
      >
        <div class="teacher-skeleton-line skeleton-title"></div>
        <div class="teacher-skeleton-line skeleton-value"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
