import axios from 'axios';

// API Base URL 설정
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api/v1';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// 요청 인터셉터 (인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 감정 조절 활동 전체 목록 조회
 * @returns {Promise} - 전체 감정 조절 활동 목록
 */
export async function getEmotionControlActivities() {
  try {
    const response = await apiClient.get('/codes/EMOTION_CONTROL');
    return response.data;
  } catch (error) {
    console.error('감정 조절 활동 목록 조회 실패:', error);
    throw new Error('감정 조절 활동 목록을 불러오는 중 문제가 발생했습니다.');
  }
}

/**
 * 특정 영역/일수별 감정 조절 활동 조회
 * @param {string} area - 영역 (red, yellow, blue, green)
 * @param {number} days - 연속 일수 (3 or 5)
 * @returns {Promise} - 해당 활동 정보
 */
export async function getEmotionControlTip(area, days) {
  try {
    const code = `${area.toUpperCase()}_${days}`;
    const response = await apiClient.get(`/codes/EMOTION_CONTROL/${code}`);
    return response.data;
  } catch (error) {
    console.error(`감정 조절 팁 조회 실패 (${area}_${days}):`, error);
    throw new Error('감정 조절 팁을 불러오는 중 문제가 발생했습니다.');
  }
}

export default {
  getEmotionControlActivities,
  getEmotionControlTip
};
