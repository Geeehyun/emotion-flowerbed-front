/**
 * 날짜 관련 상수
 */

// JavaScript Date의 월은 0부터 시작하므로 1을 더해야 함
export const MONTH_OFFSET = 1

// 월 범위
export const MIN_MONTH = 1
export const MAX_MONTH = 12

// 연도 선택 범위
export const YEAR_RANGE_PAST = 5
export const YEAR_RANGE_FUTURE = 5

// 연도 제한 범위
export const YEAR_LIMIT_PAST = 10
export const YEAR_LIMIT_FUTURE = 10

// 날짜 시작 인덱스 (일자는 1일부터 시작)
export const DAY_START_INDEX = 1

// 날짜 포맷 상수
export const DATE_FORMAT = {
  YEAR_MONTH: 'YYYY-MM',
  FULL_DATE: 'YYYY-MM-DD',
  DISPLAY: 'YYYY.MM.DD'
}

// padStart 파라미터
export const PAD_LENGTH = 2
export const PAD_CHAR = '0'
