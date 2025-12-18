/**
 * 감정 무드미터 영역 정보
 *
 * 무드미터의 4가지 영역 정보를 제공
 * - red: 높은 에너지 + 불쾌한 감정 (화남, 짜증, 불안, 긴장)
 * - yellow: 높은 에너지 + 즐거운 감정 (행복, 신남, 기쁨, 설렘)
 * - blue: 낮은 에너지 + 불쾌한 감정 (슬픔, 우울, 지침, 외로움)
 * - green: 낮은 에너지 + 즐거운 감정 (평온, 편안, 여유, 만족)
 *
 * 참고: 각 감정의 area 정보는 백엔드 API에서 제공됨 (소문자)
 */

export const MOOD_AREAS = {
  RED: 'red',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GREEN: 'green'
}

export const AREA_INFO = {
  red: {
    code: 'red',
    nameKr: '빨강 영역',
    nameEn: 'Red Area',
    icon: '🔥',
    description: '높은 에너지 + 불쾌한 감정',
    borderColor: '#EF5350',
    examples: '화남, 짜증, 불안, 긴장'
  },
  yellow: {
    code: 'yellow',
    nameKr: '노랑 영역',
    nameEn: 'Yellow Area',
    icon: '⭐',
    description: '높은 에너지 + 즐거운 감정',
    borderColor: '#FFB74D',
    examples: '행복, 신남, 기쁨, 설렘'
  },
  blue: {
    code: 'blue',
    nameKr: '파랑 영역',
    nameEn: 'Blue Area',
    icon: '💙',
    description: '낮은 에너지 + 불쾌한 감정',
    borderColor: '#42A5F5',
    examples: '슬픔, 우울, 지침, 외로움'
  },
  green: {
    code: 'green',
    nameKr: '초록 영역',
    nameEn: 'Green Area',
    icon: '🌿',
    description: '낮은 에너지 + 즐거운 감정',
    borderColor: '#66BB6A',
    examples: '평온, 편안, 여유, 만족'
  }
}

/**
 * 무드미터 영역 정보 가져오기
 * @param {string} areaCode - 영역 코드 (red, yellow, blue, green)
 * @returns {object} 영역 정보 객체 또는 null
 */
export function getAreaInfo(areaCode) {
  if (!areaCode) return null
  return AREA_INFO[areaCode] || null
}

/**
 * 감정 목록을 무드미터 영역별로 그룹화
 * @param {Array} emotions - 감정 객체 배열 (각 객체는 area 속성을 가져야 함)
 * @returns {object} 영역별로 그룹화된 감정 목록 { red: [], yellow: [], blue: [], green: [] }
 */
export function groupEmotionsByArea(emotions) {
  const grouped = {
    red: [],
    yellow: [],
    blue: [],
    green: []
  }

  emotions.forEach(emotion => {
    const area = emotion.area
    if (area && grouped[area]) {
      grouped[area].push(emotion)
    }
  })

  return grouped
}

/**
 * 영역 표시 순서 (무드미터 레이아웃과 동일하게)
 * 좌측 상단: red, 우측 상단: yellow
 * 좌측 하단: blue, 우측 하단: green
 */
export const AREA_DISPLAY_ORDER = ['red', 'yellow', 'blue', 'green']
