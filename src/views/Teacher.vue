<template>
  <div class="teacher-container">
    <!-- 모바일 풀페이지 메뉴 -->
    <div v-if="isMobileMenuOpen" class="teacher-mobile-menu-overlay" @click="isMobileMenuOpen = false">
      <div class="teacher-mobile-menu-content" @click.stop>
        <!-- 메뉴 헤더 -->
        <div class="teacher-mobile-menu-header">
          <div class="teacher-mobile-menu-logo">
            <img src="/logos/logo.png" alt="감정 화단 로고" class="teacher-logo-image">
            <span class="teacher-logo-text">감정 화단</span>
          </div>
          <button @click="isMobileMenuOpen = false" class="teacher-mobile-menu-close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 메뉴 네비게이션 -->
        <nav class="teacher-mobile-menu-nav">
          <a
            @click="currentView = 'dashboard'; isMobileMenuOpen = false"
            :class="{ active: currentView === 'dashboard' }"
            class="teacher-mobile-nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
            <span>대시보드</span>
          </a>

          <a
            @click="currentView = 'classMap'; isMobileMenuOpen = false"
            :class="{ active: currentView === 'classMap' }"
            class="teacher-mobile-nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span>학급 감정 화단</span>
          </a>

          <a
            @click="currentView = 'studentMap'; isMobileMenuOpen = false"
            :class="{ active: currentView === 'studentMap' }"
            class="teacher-mobile-nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.499 5.221 69.17 69.17 0 0 1-2.192.943M8.119 16.489A15.495 15.495 0 0 1 12 15c2.31 0 4.438.784 6.131 2.1.43-.25.873-.49 1.334-.716-.98-1.78-2.68-3.09-4.715-3.633a6.002 6.002 0 0 0-5.5 0c-2.035.543-3.735 1.853-4.715 3.633.461.226.904.466 1.334.716a15.495 15.495 0 0 1 2.25-1.611Z" />
            </svg>
            <span>학생별 상세 분석</span>
          </a>
        </nav>

        <!-- 사용자 정보 (모바일) -->
        <div class="teacher-mobile-menu-footer">
          <div class="teacher-mobile-user-profile">
            <div class="teacher-mobile-user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div class="teacher-mobile-user-info">
              <p class="teacher-mobile-user-name">{{ teacherInfo.name }} 선생님</p>
              <p class="teacher-mobile-user-school">{{ teacherInfo.schoolNm }}</p>
            </div>
          </div>
          <button @click="handleLogout" class="teacher-mobile-logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 사이드바 -->
    <aside class="teacher-sidebar" :class="{ collapsed: isCollapsed }">
      <div class="teacher-sidebar-header">
        <div class="teacher-sidebar-logo">
          <img src="/logos/logo.png" alt="감정 화단 로고" class="teacher-logo-image">
          <span v-if="!isCollapsed" class="teacher-logo-text">감정 화단</span>
        </div>
        <button @click="isCollapsed = !isCollapsed" class="teacher-collapse-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <nav class="teacher-sidebar-nav">
        <a
          @click="currentView = 'dashboard'"
          :class="{ active: currentView === 'dashboard' }"
          class="teacher-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          <span v-if="!isCollapsed">대시보드</span>
        </a>

        <a
          @click="currentView = 'classMap'"
          :class="{ active: currentView === 'classMap' }"
          class="teacher-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span v-if="!isCollapsed">학급 감정 화단</span>
        </a>

        <a
          @click="currentView = 'studentMap'"
          :class="{ active: currentView === 'studentMap' }"
          class="teacher-nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.499 5.221 69.17 69.17 0 0 1-2.192.943M8.119 16.489A15.495 15.495 0 0 1 12 15c2.31 0 4.438.784 6.131 2.1.43-.25.873-.49 1.334-.716-.98-1.78-2.68-3.09-4.715-3.633a6.002 6.002 0 0 0-5.5 0c-2.035.543-3.735 1.853-4.715 3.633.461.226.904.466 1.334.716a15.495 15.495 0 0 1 2.25-1.611Z" />
          </svg>
          <span v-if="!isCollapsed">학생별 상세 분석</span>
        </a>
      </nav>

      <!-- 사이드바 푸터 (계정정보) -->
      <div class="teacher-sidebar-footer">
        <!-- 확장 상태: 전체 정보 표시 -->
        <div v-if="!isCollapsed" class="teacher-user-profile">
          <div class="teacher-user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div class="teacher-user-info">
            <p class="teacher-user-name">{{ teacherInfo.name }} 선생님</p>
            <p class="teacher-user-school">{{ teacherInfo.schoolNm }}</p>
            <button @click="handleLogout" class="teacher-logout-btn">로그아웃</button>
          </div>
        </div>

        <!-- 축약 상태: 아이콘만 표시 + 툴팁 -->
        <div v-else class="teacher-user-profile-collapsed">
          <button
            @click="isUserTooltipOpen = !isUserTooltipOpen"
            class="teacher-user-avatar-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>

          <!-- 툴팁 -->
          <div v-if="isUserTooltipOpen" class="teacher-user-tooltip">
            <div class="teacher-tooltip-arrow"></div>
            <div class="teacher-tooltip-content">
              <div class="teacher-tooltip-user-info">
                <p class="teacher-tooltip-user-name">{{ teacherInfo.name }} 선생님</p>
                <p class="teacher-tooltip-user-school">{{ teacherInfo.schoolNm }}</p>
                <p class="teacher-tooltip-user-id">{{ teacherInfo.userId }}</p>
              </div>
              <button @click="handleLogout" class="teacher-tooltip-logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 메인 컨텐츠 -->
    <main class="teacher-main">
      <!-- 위험 신호 경고 바 -->
      <div v-if="dangerStudents.length > 0" class="teacher-danger-alert-bar">
        <div class="teacher-danger-alert-content">
          <div class="teacher-danger-alert-icon"></div>
          <span class="teacher-danger-alert-label">위험 신호 감지:</span>
          <span>심리적 위기 가능성이 있는 학생이 {{ dangerStudents.length }}명 있습니다.</span>
        </div>
        <button @click="currentView = 'studentMap'" class="teacher-danger-alert-btn">
          확인하기
        </button>
      </div>

      <!-- 헤더 -->
      <header class="teacher-header">
        <!-- 햄버거 버튼 (모바일) -->
        <button @click="isMobileMenuOpen = true" class="teacher-mobile-menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- 페이지 타이틀 -->
        <div class="teacher-header-title-section">
          <h1 class="teacher-page-title">{{ viewTitle }}</h1>
          <!-- <p class="teacher-page-subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p> -->
        </div>

        <!-- 헤더 액션 -->
        <div class="teacher-header-actions">
          <button @click="isMoodMeterModalOpen = true" class="teacher-moodmeter-info-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span>감정 무드미터란?</span>
          </button>
          <span class="teacher-today-date">{{ todayDate }}</span>
        </div>
      </header>

      <!-- 컨텐츠 영역 -->
      <div class="teacher-content">
        <!-- 대시보드 뷰 -->
        <div v-if="currentView === 'dashboard'" class="teacher-dashboard-view">
          <!-- 학급 감정 분포 -->
          <section class="teacher-emotion-distribution-section">
            <div class="teacher-section-card">
              <div class="teacher-section-header-row">
                <h2 class="teacher-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.635m3.61 3.61a16.005 16.005 0 01-4.764-4.615m4.602 4.617a16.006 16.006 0 00-1.615 3.396m-4.616-4.616a16.005 16.005 0 014.615-4.617m0 0a3.001 3.001 0 00-4.453-4.453m0 0a15.996 15.996 0 01-3.4 1.62m3.4-1.62a15.994 15.994 0 00-4.764 4.635" />
                  </svg>
                  학급 감정 분포 현황
                </h2>
                <div class="teacher-date-selector">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-calendar-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <input
                    type="date"
                    v-model="selectedDate"
                    @change="handleDateChange"
                    class="teacher-date-input"
                  />
                </div>
              </div>

              <!-- 로딩 상태 -->
              <div v-if="isLoading" class="teacher-distribution-empty-state">
                <div class="teacher-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-loading-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <p class="teacher-empty-message">데이터를 불러오는 중입니다...</p>
              </div>

              <!-- 에러 상태 -->
              <div v-else-if="errorMessage" class="teacher-distribution-empty-state">
                <div class="teacher-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-error-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <p class="teacher-empty-message teacher-error-message">{{ errorMessage }}</p>
                <button @click="handleDateChange" class="teacher-retry-btn">다시 시도</button>
              </div>

              <!-- 데이터 없음 -->
              <div v-else-if="totalStudents === 0" class="teacher-distribution-empty-state">
                <div class="teacher-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p class="teacher-empty-message">조회할 데이터가 없습니다</p>
                <p class="teacher-empty-description">선택한 날짜에 제출된 감정 일기가 없습니다</p>
              </div>

              <!-- 데이터 있음 -->
              <div v-else class="teacher-distribution-content">
                <div class="teacher-chart-wrapper">
                  <div class="teacher-chart-container">
                    <canvas ref="emotionChartCanvas"></canvas>
                  </div>
                  <div class="teacher-chart-total-text">
                    <span class="teacher-total-count">{{ totalStudents }}<span class="teacher-count-unit">명</span></span>
                  </div>
                </div>
                <div class="teacher-zone-stats">
                  <div class="teacher-zone-stat-item teacher-red-zone">
                    <h4>빨강 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('red') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('red') }}%)</span></div>
                    <div v-if="getZoneStudents('red').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">빨강 영역 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('red')" :key="student.id">
                            <span class="student-name">{{ student.name }}</span>
                            <span v-if="student.coreEmotionNameKr" class="student-emotion">{{ student.coreEmotionNameKr }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="teacher-zone-stat-item teacher-yellow-zone">
                    <h4>노랑 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('yellow') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('yellow') }}%)</span></div>
                    <div v-if="getZoneStudents('yellow').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">노랑 영역 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('yellow')" :key="student.id">
                            <span class="student-name">{{ student.name }}</span>
                            <span v-if="student.coreEmotionNameKr" class="student-emotion">{{ student.coreEmotionNameKr }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="teacher-zone-stat-item teacher-blue-zone">
                    <h4>파랑 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('blue') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('blue') }}%)</span></div>
                    <div v-if="getZoneStudents('blue').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">파랑 영역 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('blue')" :key="student.id">
                            <span class="student-name">{{ student.name }}</span>
                            <span v-if="student.coreEmotionNameKr" class="student-emotion">{{ student.coreEmotionNameKr }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="teacher-zone-stat-item teacher-green-zone">
                    <h4>초록 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('green') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('green') }}%)</span></div>
                    <div v-if="getZoneStudents('green').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">초록 영역 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('green')" :key="student.id">
                            <span class="student-name">{{ student.name }}</span>
                            <span v-if="student.coreEmotionNameKr" class="student-emotion">{{ student.coreEmotionNameKr }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="teacher-zone-stat-item teacher-gray-zone">
                    <h4>미제출</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('none') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('none') }}%)</span></div>
                    <div v-if="getZoneStudents('none').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">미제출 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('none')" :key="student.id">
                            {{ student.name }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="teacher-zone-stat-item teacher-unanalyzed-zone">
                    <h4>분석불가</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('unanalyzed') }}<span class="teacher-stat-percent">명 ({{ getZonePercent('unanalyzed') }}%)</span></div>
                    <div v-if="getZoneStudents('unanalyzed').length > 0" class="teacher-zone-tooltip">
                      <div class="teacher-zone-tooltip-arrow"></div>
                      <div class="teacher-zone-tooltip-content">
                        <p class="teacher-zone-tooltip-title">분석불가 학생</p>
                        <ul class="teacher-zone-tooltip-list">
                          <li v-for="student in getZoneStudents('unanalyzed')" :key="student.id">
                            {{ student.name }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="teacher-dashboard-grid">
            <!-- 집중 케어 필요 -->
            <section class="teacher-attention-section">
              <h3 class="teacher-attention-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                </svg>
                집중 케어 필요
              </h3>

              <!-- 케어 필요 학생 없음 -->
              <div v-if="dangerStudents.length === 0 && attentionStudents.length === 0" class="teacher-attention-empty-state">
                <div class="teacher-attention-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="teacher-attention-empty-message">집중 케어 필요 학생이 없습니다</p>
              </div>

              <!-- 위험 학생 -->
              <div v-for="student in dangerStudents" :key="student.id" class="teacher-attention-card teacher-danger-card">
                <div class="teacher-attention-card-content">
                  <div class="teacher-attention-header">
                    <span class="teacher-student-name">{{ student.name }}</span>
                    <span class="teacher-danger-badge">위험</span>
                  </div>
                  <p class="teacher-danger-signal">"{{ student.dangerSignal }}"</p>
                </div>
                <button @click="openStudentDetail(student)" class="teacher-detail-btn teacher-danger-btn">
                  분석 보기
                </button>
              </div>

              <!-- 주의 학생 -->
              <div v-for="student in attentionStudents" :key="student.id" class="teacher-attention-card teacher-attention-card-warning">
                <div class="teacher-attention-card-content">
                  <div class="teacher-attention-header">
                    <span class="teacher-student-name">{{ student.name }}</span>
                    <span class="teacher-attention-badge">주의</span>
                  </div>
                  <p class="teacher-attention-reason">{{ student.attentionReason }}</p>
                </div>
                <button @click="openStudentDetail(student)" class="teacher-detail-btn">
                  살펴보기
                </button>
              </div>
            </section>

            <!-- AI 어시스턴트 -->
            <section class="teacher-ai-assistant-section">
              <h3 class="teacher-ai-assistant-title">AI 선생님 어시스턴트</h3>
              <div class="teacher-ai-analysis-card">
                <p class="teacher-ai-analysis-text">
                  전체 학생의 <strong>87%</strong>가 일기를 제출했습니다. 제출된 일기 중에는 <strong class="teacher-highlight-yellow">노랑 영역</strong>의 비율이 높습니다.
                </p>
              </div>
              <div class="teacher-ai-recommendation-card">
                <p class="teacher-recommendation-label">오늘의 추천 활동</p>
                <div class="teacher-recommendation-content">
                  <span class="teacher-activity-name">차분한 명상 음악 3분 듣기</span>
                  <button class="teacher-play-btn">플레이</button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- 학급 감정 화단 뷰 -->
        <div v-else-if="currentView === 'classMap'" class="teacher-classmap-view">
          <div class="teacher-classmap-header">
            <h2 class="teacher-classmap-title">학급 감정 흐름 (최근 1개월)</h2>
            <div class="teacher-legend-group">
              <div class="teacher-legend-item">
                <div class="teacher-legend-color teacher-red-legend"></div>
                <span>빨강</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color teacher-yellow-legend"></div>
                <span>노랑</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color teacher-blue-legend"></div>
                <span>파랑</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color teacher-green-legend"></div>
                <span>초록</span>
              </div>
            </div>
          </div>

          <div class="teacher-trend-chart-container">
            <div class="teacher-chart-placeholder-trend">
              <p class="teacher-chart-note">📊 Chart.js 연동 예정</p>
            </div>
          </div>

          <div class="teacher-tip-card">
            <h3 class="teacher-tip-card-title">💡 교사를 위한 사회정서교육 팁</h3>
            <p class="teacher-tip-card-content">
              "화내지 마" 대신 "에너지가 뜨겁구나, 잠시 식혀볼까?"라며 심호흡을 유도하세요.
              억지로 기운을 내게 하기보다, 충분히 쉬고 충전할 시간을 주세요.
            </p>
          </div>
        </div>

        <!-- 학생별 상세 분석 뷰 -->
        <div v-else-if="currentView === 'studentMap'" class="teacher-studentmap-view">
          <div class="teacher-student-analysis-container">
            <!-- 학생 목록 (좌측) -->
            <div class="teacher-student-list-panel">
              <div class="teacher-student-list-header">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-search-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="학생 이름 검색..." class="teacher-student-search-input">
              </div>
              <div class="teacher-student-list-body">
                <!-- 로딩 상태 -->
                <div v-if="isLoading" class="teacher-empty-state">
                  <p>학생 목록을 불러오는 중...</p>
                </div>

                <!-- 에러 상태 -->
                <div v-else-if="errorMessage" class="teacher-empty-state">
                  <p style="color: #D32F2F;">{{ errorMessage }}</p>
                  <button @click="loadDailyEmotionStatus()" style="margin-top: 12px; padding: 8px 16px; border-radius: 8px; background: #F8F3E8; border: 1px solid #D4C4B0; cursor: pointer;">
                    다시 시도
                  </button>
                </div>

                <!-- 학생 목록 -->
                <div
                  v-else
                  v-for="student in filteredStudents"
                  :key="student.id"
                  @click="selectStudent(student)"
                  :class="{ active: selectedStudent?.id === student.id }"
                  class="teacher-student-list-item"
                >
                  <div class="teacher-student-item-info">
                    <div class="teacher-student-avatar" :class="getStudentStatusClass(student)">
                      {{ student.name[0] }}
                    </div>
                    <div>
                      <p class="teacher-student-item-name">{{ student.name }}</p>
                      <p class="teacher-student-item-meta">최근 레터: {{ student.lastLetterDate }}</p>
                    </div>
                  </div>
                  <span v-if="student.status !== 'normal'" class="teacher-student-status-dot" :class="student.status"></span>
                </div>
              </div>
            </div>

            <!-- 레터 리스트 또는 상세 (우측) -->
            <div class="teacher-student-detail-panel">
              <!-- 학생 미선택 상태 -->
              <div v-if="!selectedStudent" class="teacher-empty-state">
                <div class="teacher-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3>학생을 선택하세요</h3>
                <p>좌측 목록에서 학생을 선택하면 감정 레터를 확인할 수 있습니다</p>
              </div>

              <!-- 레터 리스트 (학생 선택됨, 레터 미선택) -->
              <div v-else-if="!selectedLetter" class="teacher-letter-list-view">
                <div class="teacher-letter-list-header">
                  <h2>{{ selectedStudent.name }} 학생의 감정 레터</h2>
                  <p>주간 감정 분석 리포트입니다</p>
                </div>
                <div class="teacher-letter-list-body">
                  <div
                    v-for="letter in selectedStudent.letters"
                    :key="letter.id"
                    @click="selectLetter(letter)"
                    class="teacher-letter-list-item"
                  >
                    <div class="teacher-letter-item-icon">📬</div>
                    <div class="teacher-letter-item-info">
                      <h3 class="teacher-letter-item-title">{{ letter.title }}</h3>
                      <p class="teacher-letter-item-period">{{ letter.period }}</p>
                      <div class="teacher-letter-item-emotions">
                        <span v-for="emotion in letter.emotions" :key="emotion.name" class="teacher-emotion-badge" :style="{ backgroundColor: emotion.color }">
                          {{ emotion.name }}
                        </span>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-letter-item-arrow">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 레터 상세 + TIP (레터 선택됨) -->
              <div v-else class="teacher-letter-detail-view">
                <button @click="selectedLetter = null" class="teacher-back-to-list-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  목록으로
                </button>
                <div class="teacher-letter-detail-content">
                  <h2>{{ selectedLetter.title }}</h2>
                  <p class="teacher-letter-detail-period">{{ selectedLetter.period }}</p>
                  <p class="teacher-dev-note">📝 레터 상세 내용 개발 중...</p>

                  <div class="teacher-tip-section">
                    <h3>💡 선생님을 위한 TIP</h3>
                    <p class="teacher-dev-note">📝 개발 중...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 감정 무드미터 안내 모달 -->
    <MoodMeterInfoModal v-model="isMoodMeterModalOpen" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { logout } from '@/services/authApi.js'
import { getDailyEmotionStatus } from '@/services/teacherApi.js'
import MoodMeterInfoModal from '@/components/teacher/MoodMeterInfoModal.vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

// Chart.js 등록
Chart.register(ArcElement, Tooltip, Legend)

// 선생님 정보 로드
const getUserInfo = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error)
    return {}
  }
}

const teacherInfo = ref(getUserInfo())

// 상태
const currentView = ref('dashboard')
const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isUserTooltipOpen = ref(false)
const isMoodMeterModalOpen = ref(false)
const selectedStudent = ref(null)
const selectedLetter = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const emotionChartCanvas = ref(null)
let emotionChart = null

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 날짜 선택
const selectedDate = ref(getTodayDateString())

// 감정 현황 데이터
const currentDate = ref(null) // 현재 조회 중인 날짜
const emotionData = ref(null) // 전체 감정 현황 데이터
const students = ref([])

// area 값 기반으로 학생 상태 결정
const determineStatus = (area) => {
  if (area === 'red') {
    return 'danger'
  } else if (area === 'yellow' || area === 'unanalyzed') {
    return 'attention'
  } else {
    // green, blue, none
    return 'normal'
  }
}

// 감정 영역별 위험 신호/주의 사유 설정
const getDangerSignal = (student) => {
  if (student.area === 'red') {
    return `핵심 감정: ${student.coreEmotion || '분석 중'}`
  }
  return ''
}

const getAttentionReason = (student) => {
  if (student.area === 'yellow') {
    return `핵심 감정: ${student.coreEmotion || '분석 중'}`
  } else if (student.area === 'unanalyzed') {
    return '감정 분석 대기 중'
  }
  return ''
}

// API에서 받은 학생 데이터를 화면용 데이터로 변환
const mapStudentData = (apiStudent) => {
  return {
    id: apiStudent.userSn,
    name: apiStudent.name,
    area: apiStudent.area,
    coreEmotion: apiStudent.coreEmotion,
    coreEmotionNameKr: apiStudent.coreEmotionNameKr,
    isAnalyzed: apiStudent.isAnalyzed,
    status: determineStatus(apiStudent.area),
    dangerSignal: getDangerSignal(apiStudent),
    attentionReason: getAttentionReason(apiStudent),
    lastLetterDate: '-', // TODO: 추후 레터 API 추가 시 업데이트
    letters: [] // TODO: 추후 레터 API 추가 시 업데이트
  }
}

// 일별 감정 현황 로드
const loadDailyEmotionStatus = async (date = null) => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const data = await getDailyEmotionStatus(date)

    emotionData.value = data
    currentDate.value = data.date
    students.value = data.students.map(mapStudentData)
  } catch (error) {
    console.error('감정 현황 로드 실패:', error)
    errorMessage.value = error.message || '감정 현황을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 날짜 선택 변경 핸들러
const handleDateChange = () => {
  loadDailyEmotionStatus(selectedDate.value)
}

// 대시보드 통계 데이터 (API에서 받은 데이터 사용)
const totalStudents = computed(() => {
  return emotionData.value?.totalCount || 0
})

const zoneDistribution = computed(() => {
  if (!emotionData.value?.area) {
    return {
      red: 0,
      yellow: 0,
      blue: 0,
      green: 0,
      none: 0,
      unanalyzed: 0
    }
  }

  // API의 area 데이터를 그대로 사용
  // API: red, green, blue, yellow, unanalyzed, none
  // 화면: red, yellow, blue, green, none(미제출), unanalyzed(분석불가)
  return {
    red: emotionData.value.area.red || 0,
    yellow: emotionData.value.area.yellow || 0,
    blue: emotionData.value.area.blue || 0,
    green: emotionData.value.area.green || 0,
    none: emotionData.value.area.none || 0, // 미제출
    unanalyzed: emotionData.value.area.unanalyzed || 0 // 분석불가
  }
})

// 감정 분포 차트 생성
const createEmotionChart = () => {
  if (!emotionChartCanvas.value) return

  // 기존 차트가 있으면 삭제
  if (emotionChart) {
    emotionChart.destroy()
  }

  const ctx = emotionChartCanvas.value.getContext('2d')

  const data = {
    labels: ['빨강 영역', '노랑 영역', '파랑 영역', '초록 영역', '미제출', '분석불가'],
    datasets: [{
      data: [
        zoneDistribution.value.red,
        zoneDistribution.value.yellow,
        zoneDistribution.value.blue,
        zoneDistribution.value.green,
        zoneDistribution.value.none,
        zoneDistribution.value.unanalyzed
      ],
      backgroundColor: [
        '#EF5350', // 빨강
        '#FFD54F', // 노랑
        '#42A5F5', // 파랑
        '#66BB6A', // 초록
        '#BDBDBD', // 회색 (미제출)
        '#9E9E9E'  // 어두운 회색 (분석불가)
      ],
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = totalStudents.value
            const percent = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${value}명 (${percent}%)`
          }
        }
      }
    }
  }

  emotionChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  })
}

// 차트 업데이트
const updateEmotionChart = () => {
  if (!emotionChart) {
    createEmotionChart()
    return
  }

  emotionChart.data.datasets[0].data = [
    zoneDistribution.value.red,
    zoneDistribution.value.yellow,
    zoneDistribution.value.blue,
    zoneDistribution.value.green,
    zoneDistribution.value.none,
    zoneDistribution.value.unanalyzed
  ]
  emotionChart.update()
}

// zoneDistribution 변경 감지하여 차트 업데이트
watch(zoneDistribution, () => {
  updateEmotionChart()
}, { deep: true })

// emotionData 변경 감지하여 차트 재생성
watch(emotionData, async (newData) => {
  if (newData && newData.totalCount > 0) {
    await nextTick()
    createEmotionChart()
  }
}, { deep: true })

// 컴포넌트 마운트 시 선택된 날짜(오늘)의 감정 현황 로드
onMounted(async () => {
  await loadDailyEmotionStatus(selectedDate.value)
  await nextTick()
  createEmotionChart()
})

// 오늘 날짜
const todayDate = new Date().toLocaleDateString('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

// Computed
const viewTitle = computed(() => {
  switch (currentView.value) {
    case 'dashboard':
      return '오늘의 학급 현황'
    case 'classMap':
      return '학급 감정 화단'
    case 'studentMap':
      return '학생별 상세 분석'
    default:
      return ''
  }
})

const pageSubtitle = computed(() => {
  if (currentView.value === 'dashboard') {
    const { schoolNm, classCode } = teacherInfo.value
    const classInfo = schoolNm && classCode ? `${schoolNm} ${classCode}반 | ` : ''
    return `${classInfo}모든 감정은 소중합니다. 아이들의 감정화단을 확인해보세요.`
  }
  return ''
})

const dangerStudents = computed(() => {
  return students.value.filter(s => s.status === 'danger')
})

const attentionStudents = computed(() => {
  return students.value.filter(s => s.status === 'attention')
})

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  return students.value.filter(s => s.name.includes(searchQuery.value))
})

// 메서드
const selectStudent = (student) => {
  selectedStudent.value = student
  selectedLetter.value = null
}

const selectLetter = (letter) => {
  selectedLetter.value = letter
}

const getStudentStatusClass = (student) => {
  const statusMap = {
    danger: 'status-danger',
    attention: 'status-attention',
    normal: 'status-normal'
  }
  return statusMap[student.status] || 'status-normal'
}

const getZoneCount = (zone) => {
  return zoneDistribution.value[zone] || 0
}

const getZonePercent = (zone) => {
  const count = getZoneCount(zone)
  const total = totalStudents.value
  return total > 0 ? Math.round((count / total) * 100) : 0
}

// 각 영역별 학생 목록 반환
const getZoneStudents = (zone) => {
  return students.value.filter(s => s.area === zone)
}

const openStudentDetail = (student) => {
  selectedStudent.value = student
  currentView.value = 'studentMap'
}

const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('userType')
    window.setAuth(false)
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>

<style>
@import '@/assets/styles/teacher.css';
</style>
