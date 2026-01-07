<template>
  <div class="teacher-container">
    <!-- 모바일 풀페이지 메뉴 -->
    <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="isMobileMenuOpen = false">
      <div class="mobile-menu-content" @click.stop>
        <!-- 메뉴 헤더 -->
        <div class="mobile-menu-header">
          <div class="mobile-menu-logo">
            <img src="/logos/logo.png" alt="감정 화단 로고" class="logo-image">
            <span class="logo-text">감정 화단</span>
          </div>
          <button @click="isMobileMenuOpen = false" class="mobile-menu-close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 메뉴 네비게이션 -->
        <nav class="mobile-menu-nav">
          <a
            @click="currentView = 'dashboard'; isMobileMenuOpen = false"
            :class="{ active: currentView === 'dashboard' }"
            class="mobile-nav-item"
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
            class="mobile-nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span>학급 감정 화단</span>
          </a>

          <a
            @click="currentView = 'studentMap'; isMobileMenuOpen = false"
            :class="{ active: currentView === 'studentMap' }"
            class="mobile-nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.499 5.221 69.17 69.17 0 0 1-2.192.943M8.119 16.489A15.495 15.495 0 0 1 12 15c2.31 0 4.438.784 6.131 2.1.43-.25.873-.49 1.334-.716-.98-1.78-2.68-3.09-4.715-3.633a6.002 6.002 0 0 0-5.5 0c-2.035.543-3.735 1.853-4.715 3.633.461.226.904.466 1.334.716a15.495 15.495 0 0 1 2.25-1.611Z" />
            </svg>
            <span>학생별 상세 분석</span>
          </a>
        </nav>

        <!-- 사용자 정보 (모바일) -->
        <div class="mobile-menu-footer">
          <div class="mobile-user-profile">
            <div class="mobile-user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div class="mobile-user-info">
              <p class="mobile-user-name">{{ teacherInfo.name }} 선생님</p>
              <p class="mobile-user-school">{{ teacherInfo.schoolNm }}</p>
            </div>
          </div>
          <button @click="handleLogout" class="mobile-logout-btn">
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
        <div class="sidebar-logo">
          <img src="/logos/logo.png" alt="감정 화단 로고" class="logo-image">
          <span v-if="!isCollapsed" class="logo-text">감정 화단</span>
        </div>
        <button @click="isCollapsed = !isCollapsed" class="collapse-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a
          @click="currentView = 'dashboard'"
          :class="{ active: currentView === 'dashboard' }"
          class="nav-item"
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
          class="nav-item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span v-if="!isCollapsed">학급 감정 화단</span>
        </a>

        <a
          @click="currentView = 'studentMap'"
          :class="{ active: currentView === 'studentMap' }"
          class="nav-item"
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
        <div v-if="!isCollapsed" class="user-profile">
          <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div class="user-info">
            <p class="user-name">{{ teacherInfo.name }} 선생님</p>
            <p class="user-school">{{ teacherInfo.schoolNm }}</p>
            <button @click="handleLogout" class="logout-btn">로그아웃</button>
          </div>
        </div>

        <!-- 축약 상태: 아이콘만 표시 + 툴팁 -->
        <div v-else class="user-profile-collapsed">
          <button
            @click="isUserTooltipOpen = !isUserTooltipOpen"
            class="user-avatar-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>

          <!-- 툴팁 -->
          <div v-if="isUserTooltipOpen" class="user-tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">
              <div class="tooltip-user-info">
                <p class="tooltip-user-name">{{ teacherInfo.name }} 선생님</p>
                <p class="tooltip-user-school">{{ teacherInfo.schoolNm }}</p>
                <p class="tooltip-user-id">{{ teacherInfo.userId }}</p>
              </div>
              <button @click="handleLogout" class="tooltip-logout-btn">
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
      <div v-if="dangerStudents.length > 0" class="danger-alert-bar">
        <div class="danger-alert-content">
          <div class="danger-alert-icon"></div>
          <span class="danger-alert-label">위험 신호 감지:</span>
          <span>심리적 위기 가능성이 있는 학생이 {{ dangerStudents.length }}명 있습니다.</span>
        </div>
        <button @click="currentView = 'studentMap'" class="danger-alert-btn">
          확인하기
        </button>
      </div>

      <!-- 헤더 -->
      <header class="teacher-header">
        <!-- 햄버거 버튼 (모바일) -->
        <button @click="isMobileMenuOpen = true" class="mobile-menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- 페이지 타이틀 -->
        <div class="header-title-section">
          <h1 class="teacher-page-title">{{ viewTitle }}</h1>
          <p class="teacher-page-subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p>
        </div>

        <!-- 헤더 액션 -->
        <div class="header-actions">
          <span class="today-date">{{ todayDate }}</span>
          <button class="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span class="notification-badge"></span>
          </button>
        </div>
      </header>

      <!-- 컨텐츠 영역 -->
      <div class="teacher-content">
        <!-- 대시보드 뷰 -->
        <div v-if="currentView === 'dashboard'" class="dashboard-view">
          <!-- 학급 감정 분포 -->
          <section class="emotion-distribution-section">
            <div class="section-card">
              <h2 class="teacher-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.635m3.61 3.61a16.005 16.005 0 01-4.764-4.615m4.602 4.617a16.006 16.006 0 00-1.615 3.396m-4.616-4.616a16.005 16.005 0 014.615-4.617m0 0a3.001 3.001 0 00-4.453-4.453m0 0a15.996 15.996 0 01-3.4 1.62m3.4-1.62a15.994 15.994 0 00-4.764 4.635" />
                </svg>
                오늘의 학급 감정 분포
              </h2>
              <div class="distribution-content">
                <div class="chart-placeholder">
                  <div class="chart-circle">
                    <span class="total-count">{{ totalStudents }}<span class="count-unit">명</span></span>
                  </div>
                </div>
                <div class="zone-stats">
                  <div class="zone-stat-item red-zone">
                    <h4>빨강 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('red') }}<span class="stat-percent">명 ({{ getZonePercent('red') }}%)</span></div>
                  </div>
                  <div class="zone-stat-item yellow-zone">
                    <h4>노랑 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('yellow') }}<span class="stat-percent">명 ({{ getZonePercent('yellow') }}%)</span></div>
                  </div>
                  <div class="zone-stat-item blue-zone">
                    <h4>파랑 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('blue') }}<span class="stat-percent">명 ({{ getZonePercent('blue') }}%)</span></div>
                  </div>
                  <div class="zone-stat-item green-zone">
                    <h4>초록 영역</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('green') }}<span class="stat-percent">명 ({{ getZonePercent('green') }}%)</span></div>
                  </div>
                  <div class="zone-stat-item gray-zone">
                    <h4>미제출</h4>
                    <div class="teacher-stat-value">{{ getZoneCount('gray') }}<span class="stat-percent">명 ({{ getZonePercent('gray') }}%)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="dashboard-grid">
            <!-- 집중 케어 필요 -->
            <section class="attention-section">
              <h3 class="attention-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                </svg>
                집중 케어 필요
              </h3>

              <!-- 위험 학생 -->
              <div v-for="student in dangerStudents" :key="student.id" class="attention-card danger-card">
                <div class="attention-card-content">
                  <div class="attention-header">
                    <span class="student-name">{{ student.name }}</span>
                    <span class="danger-badge">위험</span>
                  </div>
                  <p class="danger-signal">"{{ student.dangerSignal }}"</p>
                </div>
                <button @click="openStudentDetail(student)" class="detail-btn danger-btn">
                  분석 보기
                </button>
              </div>

              <!-- 주의 학생 -->
              <div v-for="student in attentionStudents" :key="student.id" class="attention-card attention-card-warning">
                <div class="attention-card-content">
                  <div class="attention-header">
                    <span class="student-name">{{ student.name }}</span>
                    <span class="attention-badge">주의</span>
                  </div>
                  <p class="attention-reason">{{ student.attentionReason }}</p>
                </div>
                <button @click="openStudentDetail(student)" class="detail-btn">
                  살펴보기
                </button>
              </div>
            </section>

            <!-- AI 어시스턴트 -->
            <section class="ai-assistant-section">
              <h3 class="ai-assistant-title">AI 선생님 어시스턴트</h3>
              <div class="ai-analysis-card">
                <p class="ai-analysis-text">
                  전체 학생의 <strong>87%</strong>가 일기를 제출했습니다. 제출된 일기 중에는 <strong class="highlight-yellow">노랑 영역</strong>의 비율이 높습니다.
                </p>
              </div>
              <div class="ai-recommendation-card">
                <p class="recommendation-label">오늘의 추천 활동</p>
                <div class="recommendation-content">
                  <span class="teacher-activity-name">차분한 명상 음악 3분 듣기</span>
                  <button class="play-btn">플레이</button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- 학급 감정 화단 뷰 -->
        <div v-else-if="currentView === 'classMap'" class="classmap-view">
          <div class="classmap-header">
            <h2 class="classmap-title">학급 감정 흐름 (최근 1개월)</h2>
            <div class="teacher-legend-group">
              <div class="teacher-legend-item">
                <div class="teacher-legend-color red-legend"></div>
                <span>빨강</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color yellow-legend"></div>
                <span>노랑</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color blue-legend"></div>
                <span>파랑</span>
              </div>
              <div class="teacher-legend-item">
                <div class="teacher-legend-color green-legend"></div>
                <span>초록</span>
              </div>
            </div>
          </div>

          <div class="trend-chart-container">
            <div class="chart-placeholder-trend">
              <p class="chart-note">📊 Chart.js 연동 예정</p>
            </div>
          </div>

          <div class="teacher-tip-card">
            <h3 class="tip-card-title">💡 교사를 위한 사회정서교육 팁</h3>
            <p class="tip-card-content">
              "화내지 마" 대신 "에너지가 뜨겁구나, 잠시 식혀볼까?"라며 심호흡을 유도하세요.
              억지로 기운을 내게 하기보다, 충분히 쉬고 충전할 시간을 주세요.
            </p>
          </div>
        </div>

        <!-- 학생별 상세 분석 뷰 -->
        <div v-else-if="currentView === 'studentMap'" class="studentmap-view">
          <div class="student-analysis-container">
            <!-- 학생 목록 (좌측) -->
            <div class="student-list-panel">
              <div class="student-list-header">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="학생 이름 검색..." class="student-search-input">
              </div>
              <div class="student-list-body">
                <div
                  v-for="student in filteredStudents"
                  :key="student.id"
                  @click="selectStudent(student)"
                  :class="{ active: selectedStudent?.id === student.id }"
                  class="student-list-item"
                >
                  <div class="student-item-info">
                    <div class="student-avatar" :class="getStudentStatusClass(student)">
                      {{ student.name[0] }}
                    </div>
                    <div>
                      <p class="student-item-name">{{ student.name }}</p>
                      <p class="student-item-meta">최근 레터: {{ student.lastLetterDate }}</p>
                    </div>
                  </div>
                  <span v-if="student.status !== 'normal'" class="student-status-dot" :class="student.status"></span>
                </div>
              </div>
            </div>

            <!-- 레터 리스트 또는 상세 (우측) -->
            <div class="student-detail-panel">
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
              <div v-else-if="!selectedLetter" class="letter-list-view">
                <div class="letter-list-header">
                  <h2>{{ selectedStudent.name }} 학생의 감정 레터</h2>
                  <p>주간 감정 분석 리포트입니다</p>
                </div>
                <div class="letter-list-body">
                  <div
                    v-for="letter in selectedStudent.letters"
                    :key="letter.id"
                    @click="selectLetter(letter)"
                    class="letter-list-item"
                  >
                    <div class="letter-item-icon">📬</div>
                    <div class="letter-item-info">
                      <h3 class="letter-item-title">{{ letter.title }}</h3>
                      <p class="letter-item-period">{{ letter.period }}</p>
                      <div class="letter-item-emotions">
                        <span v-for="emotion in letter.emotions" :key="emotion.name" class="emotion-badge" :style="{ backgroundColor: emotion.color }">
                          {{ emotion.name }}
                        </span>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="letter-item-arrow">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 레터 상세 + TIP (레터 선택됨) -->
              <div v-else class="letter-detail-view">
                <button @click="selectedLetter = null" class="teacher-back-to-list-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  목록으로
                </button>
                <div class="teacher-letter-detail-content">
                  <h2>{{ selectedLetter.title }}</h2>
                  <p class="teacher-letter-detail-period">{{ selectedLetter.period }}</p>
                  <p class="dev-note">📝 레터 상세 내용 개발 중...</p>

                  <div class="teacher-tip-section">
                    <h3>💡 선생님을 위한 TIP</h3>
                    <p class="dev-note">📝 개발 중...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { logout } from '@/services/authApi.js'

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
const selectedStudent = ref(null)
const selectedLetter = ref(null)
const searchQuery = ref('')

// Mock 데이터
const students = ref([
  {
    id: 1,
    name: '김민준',
    status: 'danger',
    dangerSignal: '무기력감 지속, "사라지고 싶다" 표현',
    attentionReason: '',
    lastLetterDate: '2일 전',
    letters: [
      {
        id: 1,
        title: '2026년 1월 1주차 감정 레터',
        period: '2026.01.01 - 01.05',
        emotions: [
          { name: '슬픔', color: '#3b82f6' },
          { name: '우울', color: '#3b82f6' }
        ]
      },
      {
        id: 2,
        title: '2025년 12월 4주차 감정 레터',
        period: '2025.12.25 - 12.31',
        emotions: [
          { name: '불안', color: '#ef4444' },
          { name: '걱정', color: '#ef4444' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '이서연',
    status: 'attention',
    dangerSignal: '',
    attentionReason: '최근 "불안/긴장" 감정 빈도 급증',
    lastLetterDate: '1일 전',
    letters: [
      {
        id: 3,
        title: '2026년 1월 1주차 감정 레터',
        period: '2026.01.01 - 01.05',
        emotions: [
          { name: '긴장', color: '#ef4444' },
          { name: '기대', color: '#facc15' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '박지수',
    status: 'normal',
    dangerSignal: '',
    attentionReason: '',
    lastLetterDate: '3일 전',
    letters: [
      {
        id: 4,
        title: '2026년 1월 1주차 감정 레터',
        period: '2026.01.01 - 01.05',
        emotions: [
          { name: '신남', color: '#facc15' },
          { name: '기쁨', color: '#facc15' }
        ]
      }
    ]
  }
])

// 대시보드 통계 데이터
const totalStudents = 30
const zoneDistribution = {
  red: 5,
  yellow: 12,
  blue: 4,
  green: 5,
  gray: 4
}

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
  return zoneDistribution[zone] || 0
}

const getZonePercent = (zone) => {
  const count = getZoneCount(zone)
  return Math.round((count / totalStudents) * 100)
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
