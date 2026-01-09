import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api/v1'

/**
 * 일별 감정 현황 조회
 * @param {string} date - 조회 날짜 (YYYY-MM-DD 형식, 선택적)
 * @returns {Promise} - 일별 감정 현황 데이터
 */
export async function getDailyEmotionStatus(date) {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const params = date ? { date } : {}
    const response = await axios.get(`${API_BASE_URL}/teachers/daily-emotion-status`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params
    })
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students/at-risk`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students/${studentUserSn}/risk-history`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.post(
      `${API_BASE_URL}/teachers/students/${studentUserSn}/resolve-danger`,
      { memo },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students/${studentUserSn}/weekly-reports`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students/${studentUserSn}/weekly-reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
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
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }

    const response = await axios.get(`${API_BASE_URL}/teachers/students/${studentUserSn}/monthly-emotions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
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

export default {
  getDailyEmotionStatus,
  getAtRiskStudents,
  getStudentRiskHistory,
  resolveDanger,
  getStudents,
  getStudentWeeklyReports,
  getStudentWeeklyReportDetail,
  getStudentMonthlyEmotions
}
