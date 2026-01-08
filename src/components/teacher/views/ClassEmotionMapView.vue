<template>
  <div class="teacher-classmap-view">
    <div class="teacher-classmap-header">
      <h2 class="teacher-classmap-title">학급 감정 흐름 (최근 1개월)</h2>
      <div class="teacher-legend-group">
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-red-legend"></div>
          <span>빨강</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-yellow-legend"></div>
          <span>노랑</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-blue-legend"></div>
          <span>파랑</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-green-legend"></div>
          <span>초록</span>
        </div>
      </div>
    </div>

    <div class="teacher-trend-chart-container">
      <div class="teacher-chart-placeholder-trend">
        <p class="teacher-chart-note">📊 Chart.js 연동 예정</p>
      </div>
    </div>

    <div class="teacher-tip-card">
      <h3 class="teacher-tip-card-title">💡 교사를 위한 사회정서교육 팁</h3>
      <p class="teacher-tip-card-content">
        "화내지 마" 대신 "에너지가 뜨겁구나, 잠시 식혀볼까?"라며 심호흡을 유도하세요.
        억지로 기운을 내게 하기보다, 충분히 쉬고 충전할 시간을 주세요.
      </p>
    </div>
  </div>
</template>

<script setup>
// 현재는 정적 컨텐츠만 표시, 추후 차트 API 연동 예정
</script>
