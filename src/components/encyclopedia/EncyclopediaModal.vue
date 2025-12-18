<template>
  <BaseModal
    v-model="isOpen"
    max-width="900px"
    @close="$emit('close')"
  >
    <template #header>
      <div class="encyclopedia-header-container">
        <div class="encyclopedia-header-left">
          <h2 class="text-xl font-bold text-gray-800">감정 도감</h2>
          <p class="encyclopedia-subtitle">{{ acquiredCount }} / {{ totalCount }} 획득</p>
        </div>
        <button
          class="mood-meter-guide-btn"
          @click="openMoodMeterGuide"
          title="감정 무드미터란?"
        >
          <span class="guide-icon">💡</span>
          <span class="guide-text">무드미터란?</span>
        </button>
      </div>
    </template>

    <template #default>
        <!-- 선택한 꽃 상세 정보 (그리드 위로 이동) -->
        <div
          v-if="selectedEmotion && selectedEmotionData"
          class="encyclopedia-detail"
          :class="`detail-${selectedEmotionData.area}`"
        >
          <div class="detail-header">
            <h3 class="detail-title">
              {{ selectedEmotionData.flowerNameKr }}
              <span class="detail-name-en">({{ selectedEmotionData.flowerNameEn }})</span>
            </h3>
            <p class="detail-subtitle">{{ selectedEmotionData.emotionNameKr }}</p>
          </div>
          <div class="detail-body">
            <div class="detail-image">
              <img
                :src="selectedEmotionImage"
                :alt="selectedEmotionData.flowerNameKr"
                class="detail-flower-image"
                :class="{ silhouette: !isAcquired(selectedEmotion) }"
              />
            </div>
            <div class="detail-info">
              <!-- 획득한 경우: 모든 상세 정보 표시 -->
              <template v-if="isAcquired(selectedEmotion)">
                <!-- 꽃말 그룹 -->
                <div class="detail-section">
                  <div class="detail-item">
                    <span class="detail-label">💐 꽃말</span>
                    <span class="detail-value highlight">"{{ selectedEmotionData.flowerMeaning }}"</span>
                  </div>
                  <div class="detail-item" v-if="selectedEmotionData.flowerMeaningStory">
                    <span class="detail-label">📖 꽃말 유래</span>
                    <span class="detail-value story">{{ selectedEmotionData.flowerMeaningStory }}</span>
                  </div>
                </div>

                <!-- 기본 정보 그룹 -->
                <div class="detail-section">
                  <div class="detail-grid">
                    <div class="detail-item compact" v-if="selectedEmotionData.flowerColor">
                      <span class="detail-label">🎨 색상</span>
                      <span class="detail-value">{{ selectedEmotionData.flowerColor }}</span>
                    </div>
                    <div class="detail-item compact" v-if="selectedEmotionData.flowerOrigin">
                      <span class="detail-label">🌍 원산지</span>
                      <span class="detail-value">{{ selectedEmotionData.flowerOrigin }}</span>
                    </div>
                    <div class="detail-item compact" v-if="selectedEmotionData.flowerFragrance">
                      <span class="detail-label">👃 향기</span>
                      <span class="detail-value">{{ selectedEmotionData.flowerFragrance }}</span>
                    </div>
                  </div>
                </div>

                <!-- 재미있는 사실 -->
                <div class="detail-section" v-if="selectedEmotionData.flowerFunFact">
                  <div class="detail-item">
                    <span class="detail-label">💡 재미있는 사실</span>
                    <span class="detail-value story">{{ selectedEmotionData.flowerFunFact }}</span>
                  </div>
                </div>
              </template>

              <!-- 미획득한 경우: 기본 정보만 표시 -->
              <template v-else>
                <div class="detail-item">
                  <span class="detail-label">💐 꽃말</span>
                  <span class="detail-value highlight">"{{ selectedEmotionData.flowerMeaning }}"</span>
                </div>
                <div class="not-acquired-message">
                  이 감정의 일기를 작성하면 획득할 수 있어요!
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 영역 필터 -->
        <div class="area-filter-wrapper">
          <span class="filter-label-text">감정 영역</span>
          <div class="area-filter-container">
            <button
              v-for="filter in areaFilters"
              :key="filter.code"
              class="area-filter-chip"
              :class="{
                active: selectedAreaFilter === filter.code,
                [`chip-${filter.code}`]: true
              }"
              :style="{ '--chip-color': filter.color }"
              :title="filter.tooltip"
              @click="selectedAreaFilter = filter.code"
            >
            </button>
          </div>
        </div>

        <!-- 꽃 그리드 -->
        <div class="encyclopedia-grid">
          <div
            v-for="emotion in filteredAndSortedEmotions"
            :key="emotion.emotionCode"
            class="encyclopedia-card"
            :class="[
              `card-${emotion.area}`,
              {
                acquired: isAcquired(emotion.emotionCode),
                selected: selectedEmotion === emotion.emotionCode
              }
            ]"
            @click="$emit('select-emotion', emotion.emotionCode)"
          >
            <div class="card-image-container">
              <img
                :src="get3dImage(emotion.imageFile3d)"
                :alt="emotion.flowerNameKr"
                class="card-flower-image"
                :class="{ silhouette: !isAcquired(emotion.emotionCode) }"
              />
            </div>
            <div class="card-info">
              <div class="card-flower-name">{{ emotion.flowerNameKr }}</div>
              <div class="card-emotion-name">{{ emotion.emotionNameKr }}</div>
            </div>
            <div v-if="!isAcquired(emotion.emotionCode)" class="lock-icon">🔒</div>
          </div>
        </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import { getAreaInfo, AREA_DISPLAY_ORDER } from '@/utils/emotionAreaMapper'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  acquiredEmotions: {
    type: Set,
    required: true
  },
  allEmotions: {
    type: Array,
    required: true
  },
  selectedEmotion: {
    type: String,
    default: null
  },
  get3dImage: {
    type: Function,
    required: true
  },
  getRealisticImage: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'select-emotion', 'open-mood-meter-guide'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) emit('close')
  }
})

const acquiredCount = computed(() => props.acquiredEmotions.size)
const totalCount = computed(() => props.allEmotions.length)

const selectedEmotionData = computed(() => {
  if (!props.selectedEmotion) return null
  return props.allEmotions.find(e => e.emotionCode === props.selectedEmotion)
})

const selectedEmotionImage = computed(() => {
  if (!selectedEmotionData.value) return ''
  return props.getRealisticImage(selectedEmotionData.value.imageFileRealistic)
})

const isAcquired = (emotionCode) => {
  return props.acquiredEmotions.has(emotionCode)
}

// 영역 필터 상태
const selectedAreaFilter = ref('ALL')

// 필터 옵션 목록
const areaFilters = computed(() => {
  return [
    { code: 'ALL', label: '전체', tooltip: '모든 영역', color: '#FFFFFF' },
    { code: 'red', label: '빨강', tooltip: getAreaInfo('red').description, color: '#FF6B6B' },
    { code: 'yellow', label: '노랑', tooltip: getAreaInfo('yellow').description, color: '#FFC75F' },
    { code: 'blue', label: '파랑', tooltip: getAreaInfo('blue').description, color: '#5DADE2' },
    { code: 'green', label: '초록', tooltip: getAreaInfo('green').description, color: '#7ED957' }
  ]
})

// 영역 우선순위 맵 (정렬용)
const AREA_PRIORITY = {
  'red': 1,
  'yellow': 2,
  'blue': 3,
  'green': 4
}

// 필터링 및 정렬된 감정 목록
const filteredAndSortedEmotions = computed(() => {
  let emotions = props.allEmotions

  // 필터링
  if (selectedAreaFilter.value !== 'ALL') {
    emotions = emotions.filter(e => e.area === selectedAreaFilter.value)
  }

  // 영역별 정렬 (RED > YELLOW > BLUE > GREEN)
  return emotions.slice().sort((a, b) => {
    const priorityA = AREA_PRIORITY[a.area] || 999
    const priorityB = AREA_PRIORITY[b.area] || 999
    return priorityA - priorityB
  })
})

// 무드미터 가이드 열기
const openMoodMeterGuide = () => {
  emit('open-mood-meter-guide')
}
</script>
