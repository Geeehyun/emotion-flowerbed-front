<template>
  <div class="landing-container">
    <!-- 움직이는 물방울 배경 -->
    <div class="polka-dot-bg">
      <div class="dots-layer dots-layer-1"></div>
      <div class="dots-layer dots-layer-2"></div>
      <div class="dots-layer dots-layer-3"></div>
      <div class="dots-layer dots-layer-4"></div>
    </div>

    <div class="landing-content">
      <!-- 로고 영역 -->
      <div class="logo-section">
        <div class="logo-placeholder">
          <!-- <div class="logo-icon">🌸</div> -->
        </div>
        <h1 class="service-title">나의 감정 화단</h1>
        <p class="service-subtitle">My Emotion Garden</p>
      </div>

      <!-- 서비스 소개 -->
      <div class="intro-section">
        <p class="intro-text">
          매일의 감정을 기록하고<br />
          아름다운 꽃으로 피워내는<br />
          특별한 감정 일기장
        </p>
      </div>

      <!-- 버튼 영역 -->
      <div class="action-section">
        <button class="login-btn" @click="showLogin = true">
          <span class="btn-icon">🌿</span>
          <span class="btn-text">로그인하고 시작하기</span>
        </button>

        <button class="about-btn" @click="showAbout = true">
          <span class="btn-text">나의 감정 화단이란?</span>
        </button>
      </div>

      <!-- 푸터 -->
      <div class="landing-footer">
        <p class="footer-text">감정을 꽃으로 피워보세요 🌺</p>
      </div>
    </div>

    <!-- 로그인 모달 -->
    <LoginModal v-model="showLogin" />

    <!-- 소개 모달 -->
    <AboutModal v-model="showAbout" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginModal from '@/components/common/modals/LoginModal.vue'
import AboutModal from '@/components/landing/AboutModal.vue'
import '@/assets/styles/garden.css'

const showLogin = ref(false)
const showAbout = ref(false)
</script>
