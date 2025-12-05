// 감정별 꽃 매핑 정보
export const EMOTION_FLOWER_MAP = {
  'JOY': { name: '해바라기', meaning: '당신을 보면 행복해요', nameEn: 'Sunflower', file: 'sunflower', icon: '😊' },
  'HAPPINESS': { name: '코스모스', meaning: '평화로운 사랑', nameEn: 'Cosmos', file: 'cosmos', icon: '😄' },
  'GRATITUDE': { name: '핑크 장미', meaning: '감사의 마음', nameEn: 'Pink Rose', file: 'pink-rose', icon: '🙏' },
  'EXCITEMENT': { name: '프리지아', meaning: '순수한 마음', nameEn: 'Freesia', file: 'freesia', icon: '💓' },
  'PEACE': { name: '은방울꽃', meaning: '행복의 재림', nameEn: 'Lily of the Valley', file: 'lily-valley', icon: '😌' },
  'ACHIEVEMENT': { name: '노란 튤립', meaning: '성공을 기원해요', nameEn: 'Yellow Tulip', file: 'yellow-tulip', icon: '🏆' },
  'LOVE': { name: '빨간 장미', meaning: '사랑해요', nameEn: 'Red Rose', file: 'red-rose', icon: '❤️' },
  'HOPE': { name: '데이지', meaning: '희망과 평화', nameEn: 'Daisy', file: 'daisy', icon: '🌟' },
  'VITALITY': { name: '거베라', meaning: '항상 기운차게', nameEn: 'Gerbera', file: 'gerbera', icon: '💪' },
  'FUN': { name: '스위트피', meaning: '즐거운 추억', nameEn: 'Sweet Pea', file: 'sweet-pea', icon: '🎉' },
  'SADNESS': { name: '파란 수국', meaning: '당신을 이해해요', nameEn: 'Blue Hydrangea', file: 'blue-hydrangea', icon: '😢' },
  'LONELINESS': { name: '물망초', meaning: '나를 잊지 말아요', nameEn: 'Forget-me-not', file: 'forget-me-not', icon: '😔' },
  'ANXIETY': { name: '라벤더', meaning: '마음의 평온', nameEn: 'Lavender', file: 'lavender', icon: '😰' },
  'ANGER': { name: '노란 카네이션', meaning: '실망했어요', nameEn: 'Yellow Carnation', file: 'yellow-carnation', icon: '😠' },
  'FATIGUE': { name: '민트', meaning: '힐링이 필요해요', nameEn: 'Mint', file: 'mint', icon: '😮‍💨' },
  'REGRET': { name: '보라색 팬지', meaning: '생각에 잠기다', nameEn: 'Purple Pansy', file: 'purple-pansy', icon: '😞' },
  'LETHARGY': { name: '백합', meaning: '순수한 마음으로', nameEn: 'Lily', file: 'lily', icon: '😪' },
  'CONFUSION': { name: '아네모네', meaning: '기대와 희망', nameEn: 'Anemone', file: 'anemone', icon: '😵' },
  'DISAPPOINTMENT': { name: '노란 수선화', meaning: '새로운 시작', nameEn: 'Yellow Daffodil', file: 'yellow-daffodil', icon: '😥' },
  'BOREDOM': { name: '흰 카모마일', meaning: '역경 속의 힘', nameEn: 'White Chamomile', file: 'white-chamomile', icon: '😑' }
};

// 감정명 한글 매핑
export const EMOTION_KR_MAP = {
  'JOY': '기쁨',
  'HAPPINESS': '행복',
  'GRATITUDE': '감사',
  'EXCITEMENT': '설렘',
  'PEACE': '평온',
  'ACHIEVEMENT': '성취감',
  'LOVE': '사랑',
  'HOPE': '희망',
  'VITALITY': '활력',
  'FUN': '재미',
  'SADNESS': '슬픔',
  'LONELINESS': '외로움',
  'ANXIETY': '불안',
  'ANGER': '분노',
  'FATIGUE': '피곤',
  'REGRET': '후회',
  'LETHARGY': '무기력',
  'CONFUSION': '혼란',
  'DISAPPOINTMENT': '실망',
  'BOREDOM': '지루함'
};

// 기본 감정 (AI 분석 실패 시)
export const DEFAULT_EMOTION = {
  coreEmotion: 'PEACE',
  flower: '은방울꽃',
  floriography: '행복의 재림',
  summary: '일기 분석에 실패했지만 괜찮아요.'
};

/**
 * 감정 코드로 꽃 이미지 경로 가져오기
 * @param {string} emotionCode - 감정 코드 (예: 'JOY')
 * @param {string} style - 이미지 스타일 ('3d' 또는 'realistic')
 * @returns {string|null} - 이미지 경로 또는 null
 */
export function getFlowerImage(emotionCode, style = '3d') {
  const flower = EMOTION_FLOWER_MAP[emotionCode];
  if (!flower) {
    // unknown 이미지 반환
    const ext = style === '3d' ? 'png' : 'jpg';
    return new URL(`../assets/images/flowers/${style}/unknown.${ext}`, import.meta.url).href;
  }

  const ext = style === '3d' ? 'png' : 'jpg';
  return new URL(`../assets/images/flowers/${style}/${flower.file}.${ext}`, import.meta.url).href;
}

/**
 * 감정 코드로 한글 감정명 가져오기
 * @param {string} emotionCode - 감정 코드 (예: 'JOY')
 * @param {string} lang - 언어 ('kr' 또는 'en')
 * @returns {string} - 감정명
 */
export function getEmotionName(emotionCode, lang = 'kr') {
  if (lang === 'kr') {
    return EMOTION_KR_MAP[emotionCode] || '알 수 없음';
  }
  return emotionCode;
}

/**
 * 감정 코드로 꽃 정보 전체 가져오기
 * @param {string} emotionCode - 감정 코드 (예: 'JOY')
 * @returns {object} - 꽃 정보 객체
 */
export function getFlowerInfo(emotionCode) {
  return EMOTION_FLOWER_MAP[emotionCode] || {
    name: '알 수 없음',
    meaning: '감정을 분석할 수 없어요',
    nameEn: 'Unknown',
    file: 'unknown',
    icon: '❓'
  };
}
