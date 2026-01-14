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
 * API 에러에서 사용자에게 표시할 메시지 추출
 * @param {Error} error - axios 에러 객체
 * @param {string} defaultMessage - 기본 메시지 (서버 메시지가 없을 때)
 * @returns {string} 사용자에게 표시할 에러 메시지
 */
const getErrorMessage = (error, defaultMessage = '처리 중 오류가 발생하였습니다. 지속적으로 발생 시 관리자에게 문의해주세요.') => {
  // 서버 응답에 message가 있으면 사용
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // 네트워크 에러 (서버 응답 없음)
  if (error.request && !error.response) {
    return '네트워크 연결을 확인해주세요.';
  }

  // 그 외의 경우 기본 메시지
  return defaultMessage;
};

/**
 * 일기 감정 분석 요청 (테스트용 - 랜덤)
 * @param {number} diaryId - 일기 ID
 * @returns {Promise} - 감정 분석 결과
 */
export async function analyzeDiaryTest(diaryId, area = null) {
  try {
    const url = area
      ? `/diaries/${diaryId}/analyze-test?area=${area}`
      : `/diaries/${diaryId}/analyze-test`;
    const response = await apiClient.post(url);
    return response.data;
  } catch (error) {
    // 서버 에러 메시지 또는 기본 메시지 사용
    const errorMessage = getErrorMessage(error);
    console.error('일기 분석(테스트) 에러:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      error
    });
    throw new Error(errorMessage);
  }
}

/**
 * 일기 감정 분석 요청 (Claude AI)
 * @param {number} diaryId - 일기 ID
 * @returns {Promise} - 감정 분석 결과
 */
export async function analyzeDiary(diaryId) {
  try {
    const response = await apiClient.post(`/diaries/${diaryId}/analyze`);
    return response.data;
  } catch (error) {
    // 서버 에러 메시지 또는 기본 메시지 사용
    const errorMessage = getErrorMessage(error);
    console.error('일기 분석(AI) 에러:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      error
    });
    throw new Error(errorMessage);
  }
}

/**
 * 월별 일기 목록 조회
 * @param {string} yearMonth - 조회할 년월 (YYYY-MM)
 * @returns {Promise} - 일기 목록
 */
export async function getDiaries(yearMonth) {
  try {
    const response = await apiClient.get('/diaries', {
      params: { yearMonth }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('일기를 찾을 수 없습니다.');
    }
    throw new Error('일기 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 일기 상세 조회
 * @param {number} diaryId - 일기 ID
 * @returns {Promise} - 일기 상세 정보
 */
export async function getDiaryDetail(diaryId) {
  try {
    const response = await apiClient.get(`/diaries/${diaryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('일기를 찾을 수 없습니다.');
    }
    throw new Error('일기를 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 일기 작성
 * @param {object} diaryData - 일기 데이터 { diaryDate: 'YYYY-MM-DD', content: '일기 내용' }
 * @returns {Promise} - 생성된 일기 정보
 */
export async function createDiary(diaryData) {
  try {
    const response = await apiClient.post('/diaries', diaryData);
    return response.data;
  } catch (error) {
    // 서버 에러 메시지 또는 기본 메시지 사용
    const errorMessage = getErrorMessage(error);
    console.error('일기 작성 에러:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      error
    });
    throw new Error(errorMessage);
  }
}

/**
 * 특정 날짜 일기 조회
 * @param {string} date - 날짜 (YYYY-MM-DD)
 * @returns {Promise} - 일기 정보
 */
export async function getDiaryByDate(date) {
  try {
    const response = await apiClient.get(`/diaries/date/${date}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // 일기가 없으면 null 반환
    }
    throw new Error('일기를 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 일기 수정
 * @param {number} diaryId - 일기 ID
 * @param {object} diaryData - 수정할 일기 데이터
 * @returns {Promise} - 수정된 일기 정보
 */
export async function updateDiary(diaryId, diaryData) {
  try {
    const response = await apiClient.put(`/diaries/${diaryId}`, diaryData);
    return response.data;
  } catch (error) {
    // 서버 에러 메시지 또는 기본 메시지 사용
    const errorMessage = getErrorMessage(error);
    console.error('일기 수정 에러:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      error
    });
    throw new Error(errorMessage);
  }
}

/**
 * 일기 삭제
 * @param {number} diaryId - 일기 ID
 * @returns {Promise}
 */
export async function deleteDiary(diaryId) {
  try {
    const response = await apiClient.delete(`/diaries/${diaryId}`);
    return response.data;
  } catch (error) {
    // 서버 에러 메시지 또는 기본 메시지 사용
    const errorMessage = getErrorMessage(error);
    console.error('일기 삭제 에러:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      error
    });
    throw new Error(errorMessage);
  }
}

/**
 * 내가 획득한 감정 목록 조회
 * @returns {Promise} - 획득한 감정 목록
 */
export async function getMyEmotions() {
  try {
    const response = await apiClient.get('/flowers/my-emotions');
    return response.data;
  } catch (error) {
    throw new Error('감정 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 전체 감정 목록 조회
 * @returns {Promise} - 전체 감정 목록
 */
export async function getAllEmotions() {
  try {
    const response = await apiClient.get('/flowers/all-emotions');
    return response.data;
  } catch (error) {
    throw new Error('전체 감정 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

export default {
  analyzeDiary,
  analyzeDiaryTest,
  getDiaries,
  getDiaryDetail,
  getDiaryByDate,
  createDiary,
  updateDiary,
  deleteDiary,
  getMyEmotions,
  getAllEmotions
};
