<template>
  <div class="landing-container">

    <div class="landing-content">
      <!-- 로고 영역 -->
      <div class="logo-section">
        <h1 class="service-title">나의 감정 화단</h1>
        <p class="service-subtitle">My Emotion Flowerbed</p>
        <div class="logo-placeholder">
          <img src="/logos/logo.png" alt="나의 감정 화단 로고" class="logo-image" loading="lazy" />
        </div>
      </div>

      <!-- 서비스 소개 -->
      <!-- <div class="intro-section">
        <p class="intro-text">
          매일의 감정을 기록하고<br />
          아름다운 꽃으로 피워내는<br />
          특별한 감정 일기장
        </p>
      </div> -->

      <!-- 버튼 영역 -->
      <div class="action-section">
        <button class="login-btn" @click="showLogin = true">
          <span class="btn-text">로그인하고 시작하기</span>
        </button>

        <button class="signup-btn" @click="showSignup = true">
          <span class="btn-text">회원가입</span>
        </button>
      </div>

      <!-- 소개 링크 -->
      <div class="landing-footer">
        <span class="about-link" @click="showAbout = true">나의 감정 화단이란?</span>
      </div>
    </div>

    <!-- 로그인 모달 -->
    <LoginModal v-model="showLogin" />

    <!-- 회원가입 모달 -->
    <SignupModal v-model="showSignup" />

    <!-- 소개 모달 -->
    <AboutModal v-model="showAbout" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginModal from '@/components/common/modals/LoginModal.vue'
import SignupModal from '@/components/common/modals/SignupModal.vue'
import AboutModal from '@/components/landing/AboutModal.vue'
import '@/assets/styles/garden.css'

const showLogin = ref(false)
const showSignup = ref(false)
const showAbout = ref(false)
</script>
