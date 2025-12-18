<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal active" :class="customClass" @click="handleBackgroundClick">
      <div class="base-modal-content" :style="{ maxWidth: maxWidth }">
        <!-- 헤더 -->
        <div class="base-modal-header">
          <slot name="header">
            <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
          </slot>
          <button @click="handleClose" class="close-btn">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- 본문 -->
        <div class="base-modal-body">
          <slot></slot>
        </div>

        <!-- 푸터 (선택사항) -->
        <div v-if="$slots.footer" class="base-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '600px'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleBackgroundClick = (e) => {
  if (e.target.classList.contains('modal')) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>
