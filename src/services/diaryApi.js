import axios from 'axios';

// API Base URL 설정
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30초 타임아웃
});

// 요청 인터셉터 (필요 시 인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 예: 로컬 스토리지에서 토큰 가져오기
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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

/**
 * 일기 감정 분석 요청 (테스트용 - 랜덤)
 * @param {number} diaryId - 일기 ID
 * @returns {Promise} - 감정 분석 결과
 */
export async function analyzeDiaryTest(diaryId) {
  try {
    const response = await apiClient.post(`/diaries/${diaryId}/analyze-test`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('일기 내용이 너무 길거나 잘못되었습니다.');
    } else if (error.response?.status === 429) {
      throw new Error('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response?.status === 500) {
      throw new Error('감정 분석에 실패했습니다. 다시 시도해주세요.');
    }
    throw new Error('일기 분석 중 문제가 발생했습니다.');
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
    if (error.response?.status === 400) {
      throw new Error('일기 내용이 너무 길거나 잘못되었습니다.');
    } else if (error.response?.status === 429) {
      throw new Error('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response?.status === 500) {
      throw new Error('감정 분석에 실패했습니다. 다시 시도해주세요.');
    }
    throw new Error('일기 분석 중 문제가 발생했습니다.');
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
    if (error.response?.status === 400) {
      throw new Error('일기 내용이 올바르지 않습니다.');
    }
    throw new Error('일기 작성 중 문제가 발생했습니다.');
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
    if (error.response?.status === 404) {
      throw new Error('일기를 찾을 수 없습니다.');
    }
    throw new Error('일기 수정 중 문제가 발생했습니다.');
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
    if (error.response?.status === 404) {
      throw new Error('일기를 찾을 수 없습니다.');
    }
    throw new Error('일기 삭제 중 문제가 발생했습니다.');
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
  deleteDiary
};
