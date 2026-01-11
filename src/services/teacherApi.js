import axios from 'axios'
import { refreshAccessToken } from './authApi'
import { API_CONFIG } from '@/config/apiConfig.js'
import { STORAGE_KEYS } from '@/constants/storageKeys.js'
import { HTTP_STATUS } from '@/constants/httpStatus.js'

// Axios 인스턴스 생성
const apiClient = axios.create(API_CONFIG)

// 토큰 갱신 중인지 여부
let isRefreshing = false
// 토큰 갱신을 기다리는 요청들
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// 요청 인터셉터 (인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 (에러 처리 및 토큰 갱신)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고 토큰 갱신 요청이 아닌 경우
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

      if (!refreshToken) {
        // refresh token이 없으면 로그아웃
        handleLogout()
        return Promise.reject(error)
      }

      try {
        // 토큰 갱신 시도
        const data = await refreshAccessToken(refreshToken)

        // 새 토큰 저장
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
        }

        // 기존 요청들에 새 토큰 적용
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        processQueue(null, data.accessToken)

        // 원래 요청 재시도
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 토큰 갱신 실패 - 로그아웃
        processQueue(refreshError, null)
        handleLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 공통 에러 처리
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// 로그아웃 처리
const handleLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)

  // 인증 상태 업데이트
  if (window.setAuth) {
    window.setAuth(false)
  }
}

/**
 * 일별 감정 현황 조회
 * @param {string} date - 조회 날짜 (YYYY-MM-DD 형식, 선택적)
 * @returns {Promise} - 일별 감정 현황 데이터
 */
export async function getDailyEmotionStatus(date) {
  try {
    const params = date ? { date } : {}
    const response = await apiClient.get('/teachers/daily-emotion-status', { params })
    return response.data
  } catch (error) {
    console.error('일별 감정 현황 조회 실패:', error)
    throw new Error('감정 현황을 불러오는데 실패했습니다.')
  }
}

/**
 * 위험 학생 리스트 조회
 * @param {string} level - 위험 레벨 필터 (ALL, CAUTION, DANGER)
 * @returns {Promise} - 위험 학생 목록 데이터
 */
export async function getAtRiskStudents(level = 'ALL') {
  try {
    const response = await apiClient.get('/teachers/students/at-risk', {
      params: { level }
    })
    return response.data
  } catch (error) {
    console.error('위험 학생 리스트 조회 실패:', error)
    throw new Error('위험 학생 목록을 불러오는데 실패했습니다.')
  }
}

/**
 * 학생별 위험 히스토리 조회
 * @param {number} studentUserSn - 학생 일련번호
 * @returns {Promise} - 학생 위험 히스토리 데이터
 */
export async function getStudentRiskHistory(studentUserSn) {
  try {
    const response = await apiClient.get(`/teachers/students/${studentUserSn}/risk-history`)
    return response.data
  } catch (error) {
    console.error('위험 히스토리 조회 실패:', error)
    throw new Error('위험 히스토리를 불러오는데 실패했습니다.')
  }
}

/**
 * 위험 상태 해지
 * @param {number} studentUserSn - 학생 일련번호
 * @param {string} memo - 해지 사유
 * @returns {Promise} - 해지 결과
 */
export async function resolveDanger(studentUserSn, memo) {
  try {
    const response = await apiClient.post(
      `/teachers/students/${studentUserSn}/resolve-danger`,
      { memo }
    )
    return response.data
  } catch (error) {
    console.error('위험 해지 실패:', error)
    throw new Error('위험 상태 해지에 실패했습니다.')
  }
}

/**
 * 학생 목록 조회 (최근 감정 정보 포함)
 * @returns {Promise} - 학생 목록 데이터
 */
export async function getStudents() {
  try {
    const response = await apiClient.get('/teachers/students')
    return response.data
  } catch (error) {
    console.error('학생 목록 조회 실패:', error)
    throw new Error('학생 목록을 불러오는데 실패했습니다.')
  }
}

/**
 * 학생별 감정 레터 조회
 * @param {number} studentUserSn - 학생 일련번호
 * @returns {Promise} - 감정 레터 목록 데이터
 */
export async function getStudentWeeklyReports(studentUserSn) {
  try {
    const response = await apiClient.get(`/teachers/students/${studentUserSn}/weekly-reports`)
    return response.data
  } catch (error) {
    console.error('감정 레터 조회 실패:', error)
    throw new Error('감정 레터를 불러오는데 실패했습니다.')
  }
}

/**
 * 학생별 감정 레터 상세 조회
 * @param {number} studentUserSn - 학생 일련번호
 * @param {number} reportId - 리포트 ID
 * @returns {Promise} - 감정 레터 상세 데이터
 */
export async function getStudentWeeklyReportDetail(studentUserSn, reportId) {
  try {
    const response = await apiClient.get(`/teachers/students/${studentUserSn}/weekly-reports/${reportId}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('해당 학생의 감정 레터에 접근 권한이 없습니다.')
    } else if (error.response?.status === 404) {
      throw new Error('감정 레터를 찾을 수 없습니다.')
    }
    console.error('감정 레터 상세 조회 실패:', error)
    throw new Error('감정 레터를 불러오는데 실패했습니다.')
  }
}

/**
 * 학생별 월간 감정 조회
 * @param {number} studentUserSn - 학생 일련번호
 * @param {string} yearMonth - 조회할 년월 (YYYY-MM 형식)
 * @returns {Promise} - 월간 감정 데이터
 */
export async function getStudentMonthlyEmotions(studentUserSn, yearMonth) {
  try {
    const response = await apiClient.get(`/teachers/students/${studentUserSn}/monthly-emotions`, {
      params: { yearMonth }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('해당 학생의 감정 정보에 접근 권한이 없습니다.')
    } else if (error.response?.status === 404) {
      throw new Error('학생을 찾을 수 없습니다.')
    } else if (error.response?.status === 400) {
      throw new Error('날짜 형식이 올바르지 않습니다.')
    }
    console.error('월간 감정 조회 실패:', error)
    throw new Error('월간 감정을 불러오는데 실패했습니다.')
  }
}

/**
 * 학급 월별 감정 분포 조회
 * @param {string} yearMonth - 조회할 년월 (YYYY-MM 형식)
 * @returns {Promise} - 월별 감정 분포 데이터
 */
export async function getClassMonthlyEmotionDistribution(yearMonth) {
  try {
    const response = await apiClient.get('/teachers/class/monthly-emotion-distribution', {
      params: { yearMonth }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('날짜 형식이 올바르지 않습니다.')
    }
    console.error('학급 월별 감정 분포 조회 실패:', error)
    throw new Error('월별 감정 분포를 불러오는데 실패했습니다.')
  }
}

export default {
  getDailyEmotionStatus,
  getAtRiskStudents,
  getStudentRiskHistory,
  resolveDanger,
  getStudents,
  getStudentWeeklyReports,
  getStudentWeeklyReportDetail,
  getStudentMonthlyEmotions,
  getClassMonthlyEmotionDistribution
}
