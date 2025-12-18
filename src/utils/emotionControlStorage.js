// 감정제어 활동 localStorage 관리

const STORAGE_KEY = 'emotionControlActivity'

/**
 * 감정제어 활동 저장
 * @param {Object} activity - { id: string, name: string, icon: string }
 */
export const saveEmotionControlActivity = (activity) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activity))
    return true
  } catch (error) {
    console.error('감정제어 활동 저장 실패:', error)
    return false
  }
}

/**
 * 감정제어 활동 불러오기
 * @returns {Object|null} { id: string, name: string, icon: string } 또는 null
 */
export const getEmotionControlActivity = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('감정제어 활동 불러오기 실패:', error)
    return null
  }
}

/**
 * 감정제어 활동이 등록되어 있는지 확인
 * @returns {boolean}
 */
export const hasEmotionControlActivity = () => {
  const activity = getEmotionControlActivity()
  return activity !== null && activity.id !== undefined
}

/**
 * 감정제어 활동 삭제
 */
export const removeEmotionControlActivity = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('감정제어 활동 삭제 실패:', error)
    return false
  }
}
