import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api/v1'

/**
 * 로그인
 * @param {object} credentials - { userId: string, password: string }
 * @returns {Promise} - { accessToken: string, refreshToken: string, userType: string }
 * userType: 'STUDENT' | 'TEACHER'
 */
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
    const data = response.data

    // API 응답의 userTypeCd를 userType으로 변환
    return {
      ...data,
      userType: data.userTypeCd
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('아이디 또는 비밀번호가 잘못되었습니다.')
    }
    throw new Error('로그인에 실패했습니다.')
  }
}

/**
 * 토큰 갱신
 * @param {string} refreshToken - Refresh Token
 * @returns {Promise} - { accessToken: string, refreshToken: string }
 */
export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    })
    return response.data
  } catch (error) {
    throw new Error('토큰 갱신에 실패했습니다.')
  }
}

/**
 * 로그아웃
 * @returns {Promise}
 */
export async function logout() {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  } catch (error) {
    console.error('로그아웃 요청 실패:', error)
  } finally {
    // 로컬 스토리지 정리
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export default {
  login,
  refreshAccessToken,
  logout
}
