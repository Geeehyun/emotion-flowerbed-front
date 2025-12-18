/**
 * 꽃 이미지 경로 유틸리티
 *
 * 백엔드 API에서 제공하는 flowerDetail 데이터를 기반으로 이미지 경로를 생성합니다.
 */

/**
 * API flowerDetail에서 3D 이미지 경로 생성
 * @param {string} imageFile3d - 3D 이미지 파일명
 * @returns {string} - 이미지 URL
 */
export function get3dImageFromDetail(imageFile3d) {
  if (!imageFile3d) {
    return new URL(`../assets/images/flowers/3d/unknown.png`, import.meta.url).href
  }
  // 확장자를 .png로 강제 변경
  const fileName = imageFile3d.replace(/\.(jpg|jpeg|gif)$/i, '.png')
  return new URL(`../assets/images/flowers/3d/${fileName}`, import.meta.url).href
}

/**
 * API flowerDetail에서 3D 이미지 경로 생성
 * @param {string} imageFile3d - 3D 이미지 파일명
 * @returns {string} - 이미지 URL
 */
export function get3dPotImageFromDetail(imageFile3d) {
  if (!imageFile3d) {
    return new URL(`../assets/images/flowers/3d_pot/unknown.png`, import.meta.url).href
  }
  // 확장자를 .png로 강제 변경
  const fileName = imageFile3d.replace(/\.(jpg|jpeg|gif)$/i, '.png')
  return new URL(`../assets/images/flowers/3d_pot/${fileName}`, import.meta.url).href
}

/**
 * API flowerDetail에서 실사 이미지 경로 생성
 * @param {string} imageFileRealistic - 실사 이미지 파일명
 * @returns {string} - 이미지 URL
 */
export function getRealisticImageFromDetail(imageFileRealistic) {
  if (!imageFileRealistic) {
    return new URL(`../assets/images/flowers/realistic/unknown.png`, import.meta.url).href
  }
  // 확장자를 .png로 강제 변경
  const fileName = imageFileRealistic.replace(/\.(jpg|jpeg|gif)$/i, '.png')
  return new URL(`../assets/images/flowers/realistic/${fileName}`, import.meta.url).href
}

/**
 * 감정 데이터 배열에서 특정 감정 코드 찾기
 * @param {Array} allEmotions - 전체 감정 데이터 배열 (API에서 가져온 데이터)
 * @param {string} emotionCode - 감정 코드 (예: 'JOY')
 * @returns {object|null} - 감정 데이터 또는 null
 */
export function getEmotionData(allEmotions, emotionCode) {
  if (!allEmotions || !emotionCode) return null
  return allEmotions.find(e => e.emotionCode === emotionCode) || null
}

/**
 * 기본 unknown 감정 데이터
 * API 데이터 로드 실패 시 fallback으로 사용
 */
export const UNKNOWN_EMOTION = {
  emotionCode: 'UNKNOWN',
  emotionNameKr: '알 수 없음',
  emotionNameEn: 'Unknown',
  flowerNameKr: '알 수 없음',
  flowerNameEn: 'Unknown',
  flowerMeaning: '감정을 분석할 수 없어요',
  imageFile3d: 'unknown.png',
  imageFileRealistic: 'unknown.png',
  isPositive: true
}
