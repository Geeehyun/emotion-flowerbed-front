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

    // 사용자 정보를 localStorage에 저장
    const userInfo = {
      userSn: data.userSn,
      userId: data.userId,
      name: data.name,
      userTypeCd: data.userTypeCd,
      schoolCode: data.schoolCode,
      schoolNm: data.schoolNm,
      classCode: data.classCode,
      themeColor: data.themeColor || 'yellow',
      themeGardenBg: data.themeGardenBg || 'default'
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))

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
    localStorage.removeItem('userInfo')
  }
}

/**
 * 회원가입
 * @param {object} userData - { userId, password, name, userTypeCd, schoolCode, schoolNm, classCode }
 * @returns {Promise} - { userSn, userId, name, userTypeCd }
 */
export async function signup(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData)
    return response.data
  } catch (error) {
    if (error.response?.status === 400) {
      const code = error.response.data?.code
      if (code === 'DUPLICATE_USER_ID') {
        throw new Error('이미 사용 중인 아이디입니다.')
      }
      throw new Error(error.response.data?.message || '입력 값을 확인해주세요.')
    }
    throw new Error('회원가입에 실패했습니다.')
  }
}

/**
 * 아이디 중복 확인
 * @param {string} userId - 확인할 아이디
 * @returns {Promise} - { userId, isDuplicate }
 */
export async function checkDuplicate(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/check-duplicate`, {
      params: { userId }
    })
    return response.data
  } catch (error) {
    throw new Error('중복 확인에 실패했습니다.')
  }
}

/**
 * 내 정보 조회
 * @returns {Promise} - { userSn, userId, name, userTypeCd, schoolCode, schoolNm, classCode, themeColor, themeGardenBg }
 */
export async function getMyInfo() {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // userInfo를 localStorage에 저장
    const data = response.data
    const userInfo = {
      userSn: data.userSn,
      userId: data.userId,
      name: data.name,
      userTypeCd: data.userTypeCd,
      schoolCode: data.schoolCode,
      schoolNm: data.schoolNm,
      classCode: data.classCode,
      themeColor: data.themeColor || 'yellow',
      themeGardenBg: data.themeGardenBg || 'default'
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))

    return data
  } catch (error) {
    throw new Error('사용자 정보 조회에 실패했습니다.')
  }
}

export default {
  login,
  refreshAccessToken,
  logout,
  signup,
  checkDuplicate,
  getMyInfo
}
