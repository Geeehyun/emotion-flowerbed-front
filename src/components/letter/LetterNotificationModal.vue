<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal letter-notification-modal" @click="handleBackgroundClick">
      <div class="letter-notification-content">
        <!-- 우체통 이미지 -->
        <div class="letterbox-animation flex justify-around">
          <img src="@/assets/images/letterbox.png" alt="우체통" class="letterbox-img" loading="lazy" />
        </div>

        <!-- 메시지 -->
        <h2 class="letter-title">새로운 감정 레터가 도착했어요!</h2>
        <p class="letter-message">
          당신의 감정 여정을 담은<br />
          특별한 레터가 도착했습니다.
        </p>

        <!-- 버튼 -->
        <div class="letter-buttons">
          <button class="letter-btn primary" @click="handleConfirm">
            확인하기
          </button>
          <button class="letter-btn secondary" @click="handleClose">
            나중에 보기
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const handleBackgroundClick = (e) => {
  if (e.target.classList.contains('modal')) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}
</script>
