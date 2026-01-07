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

export default {
  getDailyEmotionStatus
}
