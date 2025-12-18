<template>
  <div v-if="isOpen" class="modal active" @click="handleBackgroundClick">
    <div class="modal-content diary-write-modal">
      <div class="modal-header">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ date }}</h2>
          <p class="text-sm text-gray-500 mt-1">오늘 하루를 기록해보세요</p>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="modal-body">
        <form class="diary-form" @submit.prevent>
      <textarea
        :value="content"
        @input="$emit('update:content', $event.target.value)"
        placeholder="오늘은 어떤 하루였나요?&#10;당신의 이야기를 들려주세요...&#10;AI가 당신의 감정을 분석하여 어울리는 꽃을 심어드립니다 🌸"
        required
      ></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" class="cancel-btn" @click="$emit('close')">취소</button>
            <button type="button" class="save-btn test-btn" @click="$emit('save', true)">테스트 (랜덤)</button>
            <button type="button" class="save-btn" @click="$emit('save', false)">AI 분석</button>
          </div>
        </form>
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
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'save', 'update:content'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleBackgroundClick = (event) => {
  if (event.target.classList.contains('modal')) {
    emit('close')
  }
}
</script>
