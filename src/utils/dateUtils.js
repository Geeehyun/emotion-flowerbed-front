/**
 * 날짜 관련 유틸리티 함수
 */

import { MONTH_OFFSET, PAD_LENGTH, PAD_CHAR } from '@/constants/dateConstants.js'

/**
 * 현재 날짜 정보 가져오기
 * @returns {{year: number, month: number, day: number}}
 */
export function getCurrentDate() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + MONTH_OFFSET,  // 1~12
    day: now.getDate()
  }
}

/**
 * 숫자를 2자리 문자열로 패딩
 * @param {number} num - 패딩할 숫자
 * @returns {string} - 2자리 문자열 (예: 1 → "01")
 */
export function padNumber(num) {
  return String(num).padStart(PAD_LENGTH, PAD_CHAR)
}

/**
 * 연도-월 포맷 (YYYY-MM)
 * @param {number} year - 연도
 * @param {number} month - 월 (1~12)
 * @returns {string} - "YYYY-MM" 형식
 */
export function formatYearMonth(year, month) {
  return `${year}-${padNumber(month)}`
}

/**
 * 전체 날짜 포맷 (YYYY-MM-DD)
 * @param {number} year - 연도
 * @param {number} month - 월 (1~12)
 * @param {number} day - 일
 * @returns {string} - "YYYY-MM-DD" 형식
 */
export function formatFullDate(year, month, day) {
  return `${year}-${padNumber(month)}-${padNumber(day)}`
}

/**
 * Date 객체를 ISO 날짜 문자열로 변환 (YYYY-MM-DD)
 * @param {Date} date - Date 객체
 * @returns {string} - "YYYY-MM-DD" 형식
 */
export function formatDateToISO(date) {
  return date.toISOString().split('T')[0]
}

/**
 * 날짜 문자열에서 일(day) 추출
 * @param {string} dateStr - "YYYY-MM-DD" 형식의 날짜 문자열
 * @returns {number} - 일(day)
 */
export function extractDay(dateStr) {
  return parseInt(dateStr.split('-')[2], 10)
}

/**
 * 특정 연도/월의 일 수 계산
 * @param {number} year - 연도
 * @param {number} month - 월 (1~12)
 * @returns {number} - 해당 월의 일 수
 */
export function getDaysInMonth(year, month) {
  // new Date(year, month, 0)는 이전 달의 마지막 날을 반환
  return new Date(year, month, 0).getDate()
}

/**
 * 날짜 범위 생성 (1일부터 마지막 일까지)
 * @param {number} year - 연도
 * @param {number} month - 월 (1~12)
 * @returns {number[]} - [1, 2, 3, ..., 마지막일]
 */
export function getMonthDays(year, month) {
  const days = getDaysInMonth(year, month)
  return Array.from({ length: days }, (_, i) => i + 1)
}
