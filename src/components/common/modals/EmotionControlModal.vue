<template>
  <BaseModal
    v-model="isOpen"
    max-width="600px"
    custom-class="emotion-control-modal-overlay"
    @close="handleClose"
  >
    <template #header>
      <div class="emotion-control-header">
        <h2 class="text-xl font-bold text-gray-800">감정 가꾸기</h2>
        <p class="emotion-control-subtitle">
          {{ isFirstTime ? '평소 감정을 다스릴 때 도움이 되는 활동을 선택해주세요' : '감정제어 활동을 수정할 수 있어요' }}
        </p>
      </div>
    </template>

    <template #default>
      <div class="emotion-control-content">
        <!-- 로딩 중 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">로딩 중...</div>
        </div>

        <!-- 에러 메시지 -->
        <div v-else-if="loadError" class="error-container">
          <div class="error-icon">😢</div>
          <div class="error-message">활동 목록을 불러올 수 없습니다.</div>
          <button class="retry-btn" @click="loadActivities">다시 시도</button>
        </div>

        <!-- 활동 목록 -->
        <div v-else class="activities-grid">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-card"
            :class="{ selected: selectedActivity === activity.id }"
            @click="selectActivity(activity.id)"
          >
            <div class="activity-icon">
              <img v-if="activity.iconImage" :src="activity.iconImage" :alt="activity.name" loading="lazy" />
              <span v-else>{{ activity.icon }}</span>
            </div>
            <div class="activity-name">{{ activity.name }}</div>
            <div class="activity-description">{{ activity.description }}</div>
            <div v-if="selectedActivity === activity.id" class="check-icon">✓</div>
          </div>
        </div>

        <div v-if="isFirstTime && !isLoading && !loadError" class="first-time-notice">
          <p>💡 선택한 활동은 언제든지 변경할 수 있어요!</p>
        </div>
      </div>
    </template>

  </BaseModal>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import { getEmotionControlActivities } from '@/services/codeApi'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  isFirstTime: {
    type: Boolean,
    default: false
  },
  initialActivity: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) emit('close')
  }
})

// 감정제어 활동 목록 (DB에서 로드)
const activities = ref([])
const isLoading = ref(true)

const selectedActivity = ref(props.initialActivity)
const loadError = ref(false)

// assets 폴더의 모든 이미지를 자동으로 로드
const images = import.meta.glob('@/assets/images/emtion-control/*', { eager: true })

// 파일명으로 이미지 URL 가져오기
const getImageUrl = (filename) => {
  if (!filename) return null
  const key = `/src/assets/images/emtion-control/${filename}`
  return images[key]?.default || null
}

// 활동 목록 로드
const loadActivities = async () => {
  try {
    isLoading.value = true
    loadError.value = false
    const response = await getEmotionControlActivities()

    // API 응답을 활동 목록 형식으로 변환
    // extraValue1: area (red, yellow, blue, green)
    // extraValue2: days (3, 5)
    // extraValue3: image filename
    activities.value = response.map(item => {
      // 영역별 이모지 매핑
      const areaIcons = {
        red: '🔥',
        yellow: '☀️',
        blue: '💙',
        green: '🌿'
      }

      return {
        id: item.code,
        name: item.codeName,
        icon: areaIcons[item.extraValue1?.toLowerCase()] || '🌸',
        iconImage: getImageUrl(item.extraValue3),
        description: item.description,
        area: item.extraValue1, // red, yellow, blue, green
        days: parseInt(item.extraValue2) || 0 // 3 or 5
      }
    })
  } catch (error) {
    console.error('활동 목록 로드 실패:', error)
    loadError.value = true
    activities.value = []
  } finally {
    isLoading.value = false
  }
}

// 모달 열릴 때 활동 목록 로드
watch(() => props.modelValue, (newVal) => {
  if (newVal && activities.value.length === 0) {
    loadActivities()
  }
})

// 컴포넌트 마운트 시 로드
onMounted(() => {
  if (props.modelValue) {
    loadActivities()
  }
})

// props 변경 시 selectedActivity 업데이트
watch(() => props.initialActivity, (newVal) => {
  selectedActivity.value = newVal
})

const selectActivity = (activityId) => {
  selectedActivity.value = activityId
}

const handleSave = () => {
  if (!selectedActivity.value) return

  const activity = activities.find(a => a.id === selectedActivity.value)
  emit('save', {
    id: selectedActivity.value,
    name: activity.name,
    icon: activity.icon
  })

  // 최초 등록이 아닐 때만 바로 닫기 (최초 등록은 부모에서 닫기)
  if (!props.isFirstTime) {
    emit('close')
  }
}

const handleClose = () => {
  // 최초 등록일 때는 취소 버튼이 없고, 선택하지 않으면 닫을 수 없음
  if (props.isFirstTime && !selectedActivity.value) {
    return
  }
  emit('close')
}
</script>