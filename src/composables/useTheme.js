/**
 * 테마 설정 composable
 * - 화단 배경 이미지, 메인 색상 관리
 * - 로그인 시 userInfo에서 초기값 로드
 * - 변경 시 API를 통해 서버에 저장
 */
import { reactive } from 'vue'
import { getSettings, updateSettings } from '@/services/studentApi'
import { getMyInfo } from '@/services/authApi'

// 화단 배경 이미지 import (Vite 정적 import)
import gardenBgDefault from '@/assets/images/thems/garden-bg/default.png'
import gardenBgStone from '@/assets/images/thems/garden-bg/stone.png'

// 테마 색상 옵션
export const themeColors = [
  {
    id: 'yellow',
    background: '#fff3d1',
    dot: 'rgba(255, 193, 7, {{opacity}})',
    dotBase: '#ffc107',
    accent: 'rgba(139, 111, 71, 0.95)',
    accentSolid: '#8B6F47',
    accentLight: 'rgba(139, 111, 71, 0.15)',
    accentBorder: '#E8CD8E'
  },
  {
    id: 'pink',
    background: '#fff0f3',
    dot: 'rgba(255, 143, 163, {{opacity}})',
    dotBase: '#ff8fa3',
    accent: 'rgba(219, 112, 147, 0.95)',
    accentSolid: '#DB7093',
    accentLight: 'rgba(219, 112, 147, 0.15)',
    accentBorder: '#FFB6C1'
  },
  {
    id: 'mint',
    background: '#e8f8f0',
    dot: 'rgba(78, 205, 196, {{opacity}})',
    dotBase: '#4ecdc4',
    accent: 'rgba(46, 139, 130, 0.95)',
    accentSolid: '#2E8B82',
    accentLight: 'rgba(46, 139, 130, 0.15)',
    accentBorder: '#7FDBDA'
  },
  {
    id: 'purple',
    background: '#f3e8ff',
    dot: 'rgba(167, 139, 250, {{opacity}})',
    dotBase: '#a78bfa',
    accent: 'rgba(124, 93, 184, 0.95)',
    accentSolid: '#7C5DB8',
    accentLight: 'rgba(124, 93, 184, 0.15)',
    accentBorder: '#C4B5FD'
  },
  {
    id: 'blue',
    background: '#e8f4fc',
    dot: 'rgba(96, 165, 250, {{opacity}})',
    dotBase: '#60a5fa',
    accent: 'rgba(59, 130, 189, 0.95)',
    accentSolid: '#3B82BD',
    accentLight: 'rgba(59, 130, 189, 0.15)',
    accentBorder: '#93C5FD'
  }
]

// 화단 배경 옵션
export const gardenBackgrounds = [
  {
    id: 'default',
    name: '기본',
    src: gardenBgDefault
  },
  {
    id: 'stone',
    name: '돌',
    src: gardenBgStone
  }
]

// 기본값
const DEFAULT_THEME = {
  colorId: 'yellow',
  gardenBgId: 'default'
}

// userInfo에서 테마 불러오기
function loadThemeFromUserInfo() {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    return {
      colorId: userInfo.themeColor || DEFAULT_THEME.colorId,
      gardenBgId: userInfo.themeGardenBg || DEFAULT_THEME.gardenBgId
    }
  } catch (e) {
    console.warn('테마 불러오기 실패:', e)
    return { ...DEFAULT_THEME }
  }
}

// 전역 상태 (싱글톤)
const state = reactive(loadThemeFromUserInfo())

// API 호출 중복 방지용 플래그
let isSaving = false

/**
 * 테마 composable
 */
export function useTheme() {
  // 현재 색상 테마 가져오기
  const getCurrentColor = () => {
    return themeColors.find(c => c.id === state.colorId) || themeColors[0]
  }

  // 현재 화단 배경 가져오기
  const getCurrentGardenBg = () => {
    return gardenBackgrounds.find(bg => bg.id === state.gardenBgId) || gardenBackgrounds[0]
  }

  // 색상 변경
  const setColor = async (colorId) => {
    const color = themeColors.find(c => c.id === colorId)
    if (color) {
      state.colorId = colorId
      applyTheme()
      await saveThemeToServer()
    }
  }

  // 화단 배경 변경
  const setGardenBg = async (bgId) => {
    const bg = gardenBackgrounds.find(b => b.id === bgId)
    if (bg) {
      state.gardenBgId = bgId
      await saveThemeToServer()
    }
  }

  // 서버에 테마 저장 (항상 둘 다 함께 전송)
  const saveThemeToServer = async () => {
    if (isSaving) return

    try {
      isSaving = true
      await updateSettings({
        themeColor: state.colorId,
        themeGardenBg: state.gardenBgId
      })
    } catch (error) {
      console.error('테마 저장 실패:', error)
    } finally {
      isSaving = false
    }
  }

  // CSS 변수에 테마 적용
  const applyTheme = () => {
    const color = getCurrentColor()
    const root = document.documentElement

    root.style.setProperty('--theme-bg', color.background)
    root.style.setProperty('--theme-dot-light', color.dot.replace('{{opacity}}', '0.35'))
    root.style.setProperty('--theme-dot-dark', color.dot.replace('{{opacity}}', '0.5'))
    root.style.setProperty('--theme-dot-base', color.dotBase)
    root.style.setProperty('--theme-accent', color.accent)
    root.style.setProperty('--theme-accent-solid', color.accentSolid)
    root.style.setProperty('--theme-accent-light', color.accentLight)
    root.style.setProperty('--theme-accent-border', color.accentBorder)
  }

  // 초기 테마 적용
  const initTheme = async () => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const accessToken = localStorage.getItem('accessToken')

    // userInfo가 없거나 비어있으면 API에서 사용자 정보 전체를 가져오기
    if (!userInfo.userSn && accessToken) {
      try {
        const data = await getMyInfo()
        userInfo = {
          userSn: data.userSn,
          userId: data.userId,
          name: data.name,
          userTypeCd: data.userTypeCd,
          schoolCode: data.schoolCode,
          schoolNm: data.schoolNm,
          classCode: data.classCode,
          themeColor: data.themeColor || DEFAULT_THEME.colorId,
          themeGardenBg: data.themeGardenBg || DEFAULT_THEME.gardenBgId
        }
        // getMyInfo 내부에서 이미 localStorage에 저장하지만, 명시적으로 다시 저장
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } catch (error) {
        console.warn('사용자 정보 조회 실패:', error)
      }
    }
    // userInfo는 있지만 테마 정보만 없는 경우 테마 설정만 조회
    else if (userInfo.userSn && (!userInfo.themeColor || !userInfo.themeGardenBg) && accessToken) {
      try {
        const settings = await getSettings()
        userInfo.themeColor = settings.themeColor || DEFAULT_THEME.colorId
        userInfo.themeGardenBg = settings.themeGardenBg || DEFAULT_THEME.gardenBgId
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } catch (error) {
        console.warn('테마 설정 조회 실패:', error)
      }
    }

    // 테마 적용
    state.colorId = userInfo.themeColor || DEFAULT_THEME.colorId
    state.gardenBgId = userInfo.themeGardenBg || DEFAULT_THEME.gardenBgId
    applyTheme()
  }

  // userInfo에서 테마 새로고침 (로그인 후 호출용)
  const refreshFromUserInfo = () => {
    const theme = loadThemeFromUserInfo()
    state.colorId = theme.colorId
    state.gardenBgId = theme.gardenBgId
    applyTheme()
  }

  return {
    state,
    themeColors,
    gardenBackgrounds,
    getCurrentColor,
    getCurrentGardenBg,
    setColor,
    setGardenBg,
    applyTheme,
    initTheme,
    refreshFromUserInfo
  }
}
