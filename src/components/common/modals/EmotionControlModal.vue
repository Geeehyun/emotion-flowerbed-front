<template>
  <BaseModal
    v-model="isOpen"
    max-width="600px"
    custom-class="emotion-control-modal-overlay"
    @close="handleClose"
  >
    <template #header>
      <div class="emotion-control-header">
        <h2 class="text-xl font-bold text-gray-800">감정 가꾸기 가이드</h2>
        <p class="emotion-control-subtitle">
          감정 영역별로 추천하는 활동을 소개합니다
        </p>
      </div>
    </template>

    <template #default>
      <div class="emotion-control-content">
        <!-- 영역별 활동 목록 -->
        <div class="emotion-areas">
          <!-- 빨강 영역 -->
          <div v-if="redActivities.length > 0" class="emotion-area red-area">
            <h3 class="area-title">
              <span class="area-icon">🔥</span>
              <span class="area-name">빨강 영역</span>
              <span class="area-desc">불쾌하고 에너지가 높은 감정</span>
            </h3>
            <div class="area-activities">
              <div
                v-for="activity in redActivities"
                :key="activity.id"
                class="activity-card red"
              >
                <div class="activity-icon">
                  <img v-if="activity.iconImage" :src="activity.iconImage" :alt="activity.name" loading="lazy" />
                  <span v-else>{{ activity.icon }}</span>
                </div>
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>

          <!-- 노랑 영역 -->
          <div v-if="yellowActivities.length > 0" class="emotion-area yellow-area">
            <h3 class="area-title">
              <span class="area-icon">☀️</span>
              <span class="area-name">노랑 영역</span>
              <span class="area-desc">유쾌하고 에너지가 높은 감정</span>
            </h3>
            <div class="area-activities">
              <div
                v-for="activity in yellowActivities"
                :key="activity.id"
                class="activity-card yellow"
              >
                <div class="activity-icon">
                  <img v-if="activity.iconImage" :src="activity.iconImage" :alt="activity.name" loading="lazy" />
                  <span v-else>{{ activity.icon }}</span>
                </div>
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>

          <!-- 파랑 영역 -->
          <div v-if="blueActivities.length > 0" class="emotion-area blue-area">
            <h3 class="area-title">
              <span class="area-icon">💙</span>
              <span class="area-name">파랑 영역</span>
              <span class="area-desc">불쾌하고 에너지가 낮은 감정</span>
            </h3>
            <div class="area-activities">
              <div
                v-for="activity in blueActivities"
                :key="activity.id"
                class="activity-card blue"
              >
                <div class="activity-icon">
                  <img v-if="activity.iconImage" :src="activity.iconImage" :alt="activity.name" loading="lazy" />
                  <span v-else>{{ activity.icon }}</span>
                </div>
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>

          <!-- 초록 영역 -->
          <div v-if="greenActivities.length > 0" class="emotion-area green-area">
            <h3 class="area-title">
              <span class="area-icon">🌿</span>
              <span class="area-name">초록 영역</span>
              <span class="area-desc">유쾌하고 에너지가 낮은 감정</span>
            </h3>
            <div class="area-activities">
              <div
                v-for="activity in greenActivities"
                :key="activity.id"
                class="activity-card green"
              >
                <div class="activity-icon">
                  <img v-if="activity.iconImage" :src="activity.iconImage" :alt="activity.name" loading="lazy" />
                  <span v-else>{{ activity.icon }}</span>
                </div>
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import { AREA_EMOJIS } from '@/utils/emotionAreaMapper.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) emit('close')
  }
})

// 파일명으로 이미지 URL 가져오기
const getImageUrl = (filename) => {
  if (!filename) return null
  return `/emotion-control/${filename}`
}

// API 응답을 UI 형식으로 변환
const formattedActivities = computed(() => {
  return props.activities.map(item => ({
    id: item.code,
    name: item.codeName,
    icon: AREA_EMOJIS[item.extraValue1?.toLowerCase()] || '🌸',
    iconImage: getImageUrl(item.extraValue3),
    description: item.description,
    area: item.extraValue1, // red, yellow, blue, green
    days: parseInt(item.extraValue2) || 0 // 3 or 5
  }))
})

// 영역별 활동 목록
const redActivities = computed(() => {
  return formattedActivities.value.filter(a => a.area?.toLowerCase() === 'red')
})

const yellowActivities = computed(() => {
  return formattedActivities.value.filter(a => a.area?.toLowerCase() === 'yellow')
})

const blueActivities = computed(() => {
  return formattedActivities.value.filter(a => a.area?.toLowerCase() === 'blue')
})

const greenActivities = computed(() => {
  return formattedActivities.value.filter(a => a.area?.toLowerCase() === 'green')
})

const handleClose = () => {
  emit('close')
}
</script>