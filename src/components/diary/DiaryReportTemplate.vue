<template>
  <div class="diary-report-template">
    <!-- 헤더 -->
    <div class="report-header">
      <h1 class="report-title">{{ flowerName }} - {{ emotionName }}</h1>
      <p class="report-date">{{ diary?.date }}</p>
    </div>

    <!-- 꽃 이미지 -->
    <div class="report-flower-image">
      <img :src="realisticImage" :alt="flowerName" crossorigin="anonymous" />
    </div>

    <!-- 꽃 정보 -->
    <div class="report-section">
      <h2 class="section-title">🌸 꽃 정보</h2>

      <div class="info-item">
        <div class="info-label">이름</div>
        <div class="info-value">{{ flowerName }}</div>
      </div>

      <div class="info-item" v-if="flowerDetail?.flowerNameEn">
        <div class="info-label">학명</div>
        <div class="info-value">{{ flowerDetail.flowerNameEn }}</div>
      </div>

      <div class="info-item" v-if="flowerDetail?.flowerMeaning">
        <div class="info-label">꽃말</div>
        <div class="info-value">"{{ flowerDetail.flowerMeaning }}"</div>
      </div>

      <div class="info-item" v-if="flowerDetail?.flowerColor">
        <div class="info-label">색상</div>
        <div class="info-value">{{ flowerDetail.flowerColor }}</div>
        <div class="color-palette" v-if="flowerDetail.flowerColorCodes">
          <div
            v-for="(color, index) in flowerDetail.flowerColorCodes.split(',')"
            :key="index"
            class="color-chip"
            :style="{ backgroundColor: color.trim() }"
          ></div>
        </div>
      </div>

      <div class="info-item" v-if="flowerDetail?.flowerOrigin">
        <div class="info-label">원산지</div>
        <div class="info-value">{{ flowerDetail.flowerOrigin }}</div>
      </div>

      <div class="info-item" v-if="flowerDetail?.flowerFragrance">
        <div class="info-label">향기</div>
        <div class="info-value">{{ flowerDetail.flowerFragrance }}</div>
      </div>

      <div class="info-item story" v-if="flowerDetail?.flowerMeaningStory">
        <div class="info-label">꽃말 유래</div>
        <div class="info-value">{{ flowerDetail.flowerMeaningStory }}</div>
      </div>

      <div class="info-item story" v-if="flowerDetail?.flowerFunFact">
        <div class="info-label">재미있는 사실</div>
        <div class="info-value">{{ flowerDetail.flowerFunFact }}</div>
      </div>
    </div>

    <!-- 감정 분석 정보 -->
    <div class="report-section">
      <h2 class="section-title">💭 감정 분석 정보</h2>

      <!-- 일기 요약 -->
      <div class="info-item" v-if="diary?.summary">
        <div class="info-label">일기 요약</div>
        <div class="info-value">{{ diary.summary }}</div>
      </div>

      <!-- 감정 분포 차트 -->
      <div class="info-item chart-item" v-if="diary?.emotions && diary.emotions.length > 0">
        <div class="info-label">감정 분포</div>
        <div class="emotion-chart-container">
          <div
            v-for="emotion in diary.emotions"
            :key="emotion.emotion"
            class="emotion-bar-row"
          >
            <div class="emotion-label">
              {{ emotion.emotionNameKr || emotion.emotion }}
              <span v-if="emotion.emotion === flowerDetail?.emotionCode">⭐</span>
            </div>
            <div class="emotion-bar-wrapper">
              <div
                class="emotion-bar"
                :style="{
                  width: `${emotion.percent}%`,
                  backgroundColor: emotion.color
                }"
              ></div>
              <span class="emotion-percent">{{ emotion.percent }}%</span>
            </div>
            <div class="emotion-bar-description" v-if="emotion.emotionDescription">
              {{ emotion.emotionDescription }}
            </div>
          </div>
        </div>
      </div>

      <!-- 대표 감정 -->
      <div class="info-item">
        <div class="info-label">대표 감정</div>
        <div class="info-value highlight">
          <p class="highlight-content">
            {{ emotionName }}
          </p>
        </div>
      </div>

      <!-- 대표 감정 선정 이유 -->
      <div class="info-item" v-if="diary?.reason">
        <div class="info-label">선정 이유</div>
        <div class="info-value">{{ diary.reason }}</div>
      </div>
    </div>

    <!-- 푸터 -->
    <div class="report-footer">
      <p>감정 화단</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  diary: {
    type: Object,
    required: true
  },
  flowerDetail: {
    type: Object,
    default: null
  },
  realisticImage: {
    type: String,
    required: true
  },
  emotionName: {
    type: String,
    required: true
  }
})

const flowerName = computed(() => {
  return props.flowerDetail?.flowerNameKr || '알 수 없음'
})
</script>

<style scoped>
.diary-report-template {
  width: 800px;
  background: #FFF9E8;
  padding: 40px;
  font-family: 'LeeSeoyun', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  box-sizing: border-box;
}

/* 헤더 */
.report-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px dashed #E8CD8E;
}

.report-title {
  font-size: 32px;
  font-weight: bold;
  color: #8B6F47;
  margin: 0 0 10px 0;
}

.report-date {
  font-size: 18px;
  color: #8B7355;
  margin: 0;
}

/* 꽃 이미지 */
.report-flower-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  overflow: hidden;
}

.report-flower-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 섹션 */
.report-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(232, 205, 142, 0.3);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #8B6F47;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #E8CD8E;
}

/* 정보 아이템 */
.info-item {
  margin-bottom: 16px;
}

.info-item.story {
  margin-bottom: 20px;
}

.info-item.chart-item {
  margin-bottom: 0;
}

.info-label {
  font-size: 16px;
  font-weight: bold;
  color: #8B6F47;
  margin-bottom: 6px;
}

.info-value {
  font-size: 18px;
  color: #5D4E37;
  line-height: 1.6;
}

.info-value.highlight {
  background: rgba(232, 205, 142, 0.3);
  border-radius: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-value.highlight .highlight-content {
  line-height: 0;
  text-align: center;
  padding: 20px 0 40px 0;
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  color: #8B6F47;
}

/* 색상 칩 */
.color-palette {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.color-chip {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid rgba(139, 111, 71, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 감정 차트 */
.emotion-chart-container {
  margin-top: 12px;
}

.emotion-bar-row {
  margin-bottom: 12px;
}

.emotion-label {
  font-size: 16px;
  color: #5D4E37;
  margin-bottom: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.emotion-bar-description {
  margin-top: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: #6B5B45;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  border-left: 3px solid #E8CD8E;
}

.emotion-bar-wrapper {
  position: relative;
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(232, 205, 142, 0.3);
}

.emotion-bar {
  height: 100%;
  border-radius: 16px;
  transition: width 0.3s ease;
}

.emotion-percent {
  position: absolute;
  right: 12px;
  top: 25%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #5D4E37;
}

/* 푸터 */
.report-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px dashed #E8CD8E;
  color: #8B7355;
  font-size: 16px;
}

.report-footer p {
  margin: 0;
}
</style>
