import axios from 'axios';
import { refreshAccessToken } from './authApi';
import { API_CONFIG } from '@/config/apiConfig.js';
import { STORAGE_KEYS } from '@/constants/storageKeys.js';
import { HTTP_STATUS } from '@/constants/httpStatus.js';

// Axios 인스턴스 생성
const apiClient = axios.create(API_CONFIG);

// 토큰 갱신 중인지 여부
let isRefreshing = false;
// 토큰 갱신을 기다리는 요청들
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 요청 인터셉터 (인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 및 토큰 갱신)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 토큰 갱신 요청이 아닌 경우
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // refresh token이 없으면 로그아웃
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 시도
        const data = await refreshAccessToken(refreshToken);

        // 새 토큰 저장
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }

        // 기존 요청들에 새 토큰 적용
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);

        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 - 로그아웃
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 공통 에러 처리
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리
const handleLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

  // 인증 상태 업데이트
  if (window.setAuth) {
    window.setAuth(false);
  }
};

/**
 * 안 읽은 리포트 존재 여부 확인 (사이드바 N 뱃지용)
 * @returns {Promise<{hasUnread: boolean, hasNew: null}>}
 */
export async function checkUnreadReports() {
  try {
    const response = await apiClient.get('/weekly-reports/unread/exists');
    return response.data;
  } catch (error) {
    console.error('안 읽은 리포트 확인 실패:', error);
    throw new Error('안 읽은 리포트를 확인하는 중 문제가 발생했습니다.');
  }
}

/**
 * 새 리포트 존재 여부 확인 (알림 모달 1회 노출용)
 * @returns {Promise<{hasUnread: null, hasNew: boolean}>}
 */
export async function checkNewReports() {
  try {
    const response = await apiClient.get('/weekly-reports/new/exists');
    return response.data;
  } catch (error) {
    console.error('새 리포트 확인 실패:', error);
    throw new Error('새 리포트를 확인하는 중 문제가 발생했습니다.');
  }
}

/**
 * 주간 리포트 목록 조회
 * @param {string} status - 필터 조건 (all|read|unread)
 * @returns {Promise<Array>} - 리포트 목록
 */
export async function getWeeklyReportList(status = 'all') {
  try {
    const response = await apiClient.get('/weekly-reports/list', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('주간 리포트 목록 조회 실패:', error);
    throw new Error('주간 리포트 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 주간 리포트 상세 조회
 * @param {number} reportId - 리포트 ID
 * @returns {Promise<Object>} - 리포트 상세 정보
 */
export async function getWeeklyReportDetail(reportId) {
  try {
    const response = await apiClient.get(`/weekly-reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('해당 리포트에 접근 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      throw new Error('리포트를 찾을 수 없습니다.');
    }
    console.error('주간 리포트 상세 조회 실패:', error);
    throw new Error('주간 리포트를 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 주간 리포트 읽음 처리
 * @param {number} reportId - 리포트 ID
 * @returns {Promise<void>}
 */
export async function markReportAsRead(reportId) {
  try {
    await apiClient.put(`/weekly-reports/${reportId}/read`);
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('해당 리포트에 접근 권한이 없습니다.');
    }
    console.error('리포트 읽음 처리 실패:', error);
    throw new Error('리포트 읽음 처리 중 문제가 발생했습니다.');
  }
}

/**
 * 새 감정 레터 알림 확인 처리
 * @param {number} reportId - 리포트 ID
 * @returns {Promise<void>}
 */
export async function markNotificationAsSent(reportId) {
  try {
    await apiClient.put(`/weekly-reports/${reportId}/notification-sent`);
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('해당 리포트에 접근 권한이 없습니다.');
    }
    console.error('알림 확인 처리 실패:', error);
    throw new Error('알림 확인 처리 중 문제가 발생했습니다.');
  }
}

/**
 * 주간 리포트 데이터를 UI에 맞게 변환
 * @param {Object} reportData - API 응답 데이터
 * @returns {Object} - UI용 데이터
 */
export function transformWeeklyReportData(reportData) {
  // startDate ~ endDate로 7일 전체 배열 생성
  const startDate = new Date(reportData.startDate);
  const endDate = new Date(reportData.endDate);

  const weekFlowers = [];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    const dayOfWeek = dayNames[date.getDay()];
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

    // weeklyDiaryDetails에서 해당 날짜 찾기
    const diaryDetail = reportData.weeklyDiaryDetails?.find(d => d.diaryDate === dateStr);

    if (diaryDetail) {
      // 일기가 있는 날
      weekFlowers.push({
        date: monthDay,
        day: dayOfWeek,
        flowerKey: diaryDetail.imageFile3d.replace('.png', ''), // .png 제거
        emotionName: diaryDetail.emotionNameKr,
        emotionDescription: diaryDetail.emotionDescription || '',
        flowerName: diaryDetail.flowerNameKr,
        flowerMeaning: diaryDetail.flowerMeaning,
        diaryId: diaryDetail.diaryId,
        hasEntry: true
      });
    } else {
      // 일기가 없는 날
      weekFlowers.push({
        date: monthDay,
        day: dayOfWeek,
        hasEntry: false
      });
    }
  }

  // UI용 데이터 반환
  return {
    reportId: reportData.reportId,
    title: `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${Math.ceil(startDate.getDate() / 7)}주차 감정 레터`,
    period: `${reportData.startDate.replace(/-/g, '.')} - ${reportData.endDate.replace(/-/g, '.')}`,
    date: reportData.endDate.replace(/-/g, '.'),
    weekFlowers,
    studentReport: reportData.studentReport,
    studentEncouragement: reportData.studentEncouragement,
    emotions: reportData.emotionStats?.map(stat => ({
      name: stat.emotionNameKr,
      count: stat.count,
      color: stat.color
    })) || [],
    // 하이라이트 데이터 (백엔드에서 제공하는 풍부한 정보 활용)
    highlights: reportData.highlights || null,

    // 하이라이트 요약 (기존 호환성 유지)
    highlightsSummary: reportData.highlights ? {
      flowerOfTheWeek: reportData.highlights.flowerOfTheWeek,
      quickStats: reportData.highlights.quickStats,
      gardenDiversity: reportData.highlights.gardenDiversity
    } : null,

    // 마인드 가드닝
    mindGardeningTip: reportData.mindGardeningTip || null,

    // 금주의 키워드
    weekKeywords: reportData.weekKeywords || null
  };
}

/**
 * 발행 신청 가능한 주 목록 조회
 * @returns {Promise<Object>} - { dailyLimit, usedCount, remainingCount, weeks }
 */
export async function getGenerableWeeks() {
  try {
    const response = await apiClient.get('/weekly-reports/generable');
    return response.data;
  } catch (error) {
    console.error('발행 가능 주 목록 조회 실패:', error);
    throw new Error('발행 가능한 주 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 주간 리포트 발행 신청
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @returns {Promise<Object>} - 생성된 리포트 정보
 */
export async function generateWeeklyReport(startDate, endDate) {
  try {
    const response = await apiClient.post('/weekly-reports/generate', null, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('오늘의 레터 발행 횟수를 모두 사용했어요. 내일 다시 시도해주세요!');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || '발행 조건을 충족하지 못했습니다.');
    }
    console.error('주간 리포트 발행 실패:', error);
    throw new Error('주간 리포트 발행 중 문제가 발생했습니다.');
  }
}
