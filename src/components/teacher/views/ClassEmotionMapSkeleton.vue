<template>
  <div class="teacher-classmap-skeleton">
    <!-- 요약 정보 스켈레톤 -->
    <div class="teacher-skeleton-summary">
      <div class="teacher-skeleton-summary-card">
        <div class="teacher-skeleton-line skeleton-summary-title"></div>
        <div class="teacher-skeleton-summary-items">
          <div class="teacher-skeleton-summary-item">
            <div class="teacher-skeleton-line skeleton-label"></div>
            <div class="teacher-skeleton-line skeleton-value"></div>
          </div>
          <div class="teacher-skeleton-summary-item">
            <div class="teacher-skeleton-line skeleton-label"></div>
            <div class="teacher-skeleton-line skeleton-value"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 그래프형 스켈레톤 -->
    <div v-if="viewType === 'chart'" class="teacher-skeleton-chart-view">
      <div class="teacher-skeleton-chart-container">
        <div class="teacher-skeleton-shimmer"></div>
      </div>
    </div>

    <!-- 달력형 스켈레톤 -->
    <div v-else class="teacher-skeleton-calendar-view">
      <div class="teacher-skeleton-calendar-grid">
        <!-- 요일 헤더 -->
        <div v-for="i in 7" :key="'header-' + i" class="teacher-skeleton-weekday"></div>

        <!-- 날짜 셀 -->
        <div
          v-for="i in 35"
          :key="'day-' + i"
          class="teacher-skeleton-calendar-day"
        >
          <div class="teacher-skeleton-day-number"></div>
          <div class="teacher-skeleton-day-bar"></div>
        </div>
      </div>
    </div>

    <!-- 키워드 영역 스켈레톤 -->
    <div class="teacher-skeleton-keywords">
      <div class="teacher-skeleton-line skeleton-keywords-title"></div>
      <div class="teacher-skeleton-keywords-grid">
        <div v-for="i in 4" :key="i" class="teacher-skeleton-keyword-card">
          <div class="teacher-skeleton-keyword-header">
            <div class="teacher-skeleton-keyword-icon"></div>
            <div class="teacher-skeleton-keyword-info">
              <div class="teacher-skeleton-line skeleton-keyword-name"></div>
              <div class="teacher-skeleton-line skeleton-keyword-desc"></div>
            </div>
          </div>
          <div class="teacher-skeleton-keyword-tags">
            <div class="teacher-skeleton-tag"></div>
            <div class="teacher-skeleton-tag"></div>
            <div class="teacher-skeleton-tag"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  viewType: {
    type: String,
    default: 'chart' // 'chart' or 'calendar'
  }
})
</script>
