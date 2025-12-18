<template>
  <BaseModal
    v-model="isOpen"
    max-width="600px"
    @close="handleClose"
  >
    <template #header>
      <div class="emotion-control-header">
        <h2 class="text-xl font-bold text-gray-800">나의 감정제어 활동</h2>
        <p class="emotion-control-subtitle">
          {{ isFirstTime ? '평소 감정을 다스릴 때 도움이 되는 활동을 선택해주세요' : '감정제어 활동을 수정할 수 있어요' }}
        </p>
      </div>
    </template>

    <template #default>
      <div class="emotion-control-content">
        <div class="activities-grid">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-card"
            :class="{ selected: selectedActivity === activity.id }"
            @click="selectActivity(activity.id)"
          >
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-name">{{ activity.name }}</div>
            <div class="activity-description">{{ activity.description }}</div>
            <div v-if="selectedActivity === activity.id" class="check-icon">✓</div>
          </div>
        </div>

        <div v-if="isFirstTime" class="first-time-notice">
          <p>💡 선택한 활동은 언제든지 변경할 수 있어요!</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="emotion-control-footer">
        <button
          v-if="!isFirstTime"
          class="cancel-btn"
          @click="handleClose"
        >
          취소
        </button>
        <button
          class="save-btn"
          :disabled="!selectedActivity"
          @click="handleSave"
        >
          {{ isFirstTime ? '시작하기' : '저장하기' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'

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

// 감정제어 활동 목록
const activities = [
  {
    id: 'butterfly-hug',
    name: '나비허그 하기',
    icon: '🦋',
    description: '양손을 교차하여 어깨를 토닥이며 마음을 진정시켜요'
  },
  {
    id: 'breathing',
    name: '쉼호흡 하기',
    icon: '🌬️',
    description: '천천히 깊게 숨을 들이마시고 내쉬며 안정을 찾아요'
  },
  {
    id: 'walking',
    name: '산책하기',
    icon: '🚶',
    description: '바깥 공기를 마시며 가볍게 걸으며 생각을 정리해요'
  },
  {
    id: 'drawing',
    name: '내 감정을 그림으로 그려보기',
    icon: '🎨',
    description: '감정을 색과 형태로 표현하며 마음을 표출해요'
  }
]

const selectedActivity = ref(props.initialActivity)

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

<!-- 스타일은 src/assets/styles/garden.css에 통합되어 있습니다 -->
