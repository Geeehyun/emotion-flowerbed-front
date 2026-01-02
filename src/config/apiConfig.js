/**
 * API 공통 설정
 * - 모든 API 파일에서 공통으로 사용하는 설정값
 */

/**
 * API Base URL
 * - 환경변수에서 가져오거나 기본값 사용
 */
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api/v1'

/**
 * API 타임아웃 (밀리초)
 * - 30초
 */
export const API_TIMEOUT = 30000

/**
 * API 공통 헤더
 */
export const API_HEADERS = {
  'Content-Type': 'application/json'
}

/**
 * Axios 기본 설정 객체
 */
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
  timeout: API_TIMEOUT
}
