<template>
  <div v-if="modelValue" class="modal active" @click="handleBackgroundClick">
    <div class="encyclopedia-content">
      <div class="encyclopedia-header">
        <h2 class="text-xl font-bold text-gray-800">감정 도감</h2>
        <p class="encyclopedia-subtitle">{{ acquiredCount }} / {{ totalCount }} 획득</p>
        <button class="close-btn" @click="$emit('close')">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="encyclopedia-body">
        <!-- 선택한 꽃 상세 정보 (그리드 위로 이동) -->
        <div
          v-if="selectedEmotion && selectedEmotionData"
          class="encyclopedia-detail"
          :class="{
            'detail-positive': selectedEmotionData.isPositive,
            'detail-negative': !selectedEmotionData.isPositive
          }"
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

        <!-- 꽃 그리드 -->
        <div class="encyclopedia-grid">
          <div
            v-for="emotion in allEmotions"
            :key="emotion.emotionCode"
            class="encyclopedia-card"
            :class="{
              acquired: isAcquired(emotion.emotionCode),
              selected: selectedEmotion === emotion.emotionCode,
              positive: emotion.isPositive,
              negative: !emotion.isPositive
            }"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

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

const emit = defineEmits(['close', 'select-emotion'])

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

const handleBackgroundClick = (event) => {
  if (event.target.classList.contains('modal')) {
    emit('close')
  }
}
</script>
