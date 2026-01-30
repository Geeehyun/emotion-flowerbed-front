import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api/v1'

/**
 * 인증 헤더 생성
 */
function getAuthHeader() {
  const accessToken = localStorage.getItem('accessToken')
  return {
    Authorization: `Bearer ${accessToken}`
  }
}

/**
 * 학생 설정 조회
 * @returns {Promise} - { themeColor: string, themeGardenBg: string }
 */
export async function getSettings() {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/settings`, {
      headers: getAuthHeader()
    })
    return response.data
  } catch (error) {
    console.error('설정 조회 실패:', error)
    throw new Error('설정을 불러오는데 실패했습니다.')
  }
}

/**
 * 학생 설정 수정
 * @param {object} settings - { themeColor?: string, themeGardenBg?: string }
 * @returns {Promise} - { themeColor: string, themeGardenBg: string }
 */
export async function updateSettings(settings) {
  try {
    const response = await axios.put(`${API_BASE_URL}/students/settings`, settings, {
      headers: getAuthHeader()
    })

    // localStorage의 userInfo도 업데이트
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (settings.themeColor) userInfo.themeColor = settings.themeColor
    if (settings.themeGardenBg) userInfo.themeGardenBg = settings.themeGardenBg
    localStorage.setItem('userInfo', JSON.stringify(userInfo))

    return response.data
  } catch (error) {
    console.error('설정 수정 실패:', error)
    throw new Error('설정 저장에 실패했습니다.')
  }
}

export default {
  getSettings,
  updateSettings
}
