<template>
  <BaseModal
    v-model="isOpen"
    max-width="900px"
    @close="handleClose"
  >
    <template #header>
      <div class="teacher-letter-modal-header">
        <div>
          <h2 class="teacher-letter-modal-title">{{ letter?.title }}</h2>
          <p class="teacher-letter-modal-subtitle">{{ letter?.period }}</p>
        </div>
      </div>
    </template>

    <template #default>
      <TeacherLetterDetailView
        v-if="letter"
        :letter="letter"
        :is-modal="true"
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import TeacherLetterDetailView from '@/components/teacher/views/TeacherLetterDetailView.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  letter: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.teacher-letter-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.teacher-letter-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #5D4E37;
  margin: 0 0 4px 0;
}

.teacher-letter-modal-subtitle {
  font-size: 14px;
  color: #8B7355;
  margin: 0;
}
</style>
