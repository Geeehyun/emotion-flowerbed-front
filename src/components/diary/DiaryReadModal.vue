<template>
  <div v-if="modelValue" class="modal active diary-modal-overlay" @click="handleBackgroundClick">
    <div class="flip-card-container">
      <div class="flip-card-inner" :class="{ 'is-flipped': isFlipped }">
        <!-- 앞면: 일기 내용 -->
        <div class="flip-card-front modal-content diary-read-modal">
          <div class="modal-header">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ diary?.date }}</h2>
              <p class="text-sm text-gray-500 mt-1" v-if="diary">
                {{ flowerDetail?.flowerNameKr || flowerInfo.name }} · {{ flowerDetail?.emotionNameKr || emotionName }}
              </p>
            </div>
            <div class="header-buttons">
              <button class="flip-btn" @click.stop="$emit('toggle-flip')" title="꽃 정보 보기">
                <ArrowPathIcon class="w-5 h-5" />
              </button>
              <button class="close-btn" @click="$emit('close')">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>
          <div class="modal-body">
            <!-- 꽃 수채화 배경 이미지 -->
            <div class="flower-watercolor-bg" v-if="diary">
              <LazyImage
                :src="realisticImage"
                :alt="flowerDetail?.flowerNameKr || flowerInfo.name"
                image-class="watercolor-bg-image opacity3"
                skeleton-type="watercolor"
              />
            </div>

            <div class="diary-content">{{ diary?.content }}</div>

            <!-- AI 분석 정보 -->
            <div class="ai-analysis-section" v-if="diary">
              <h3 class="analysis-title">AI 분석 정보</h3>

              <!-- 요약 -->
              <div class="analysis-item">
                <div class="analysis-label section-label">요약</div>
                <div class="analysis-value">{{ diary.summary || '요약 정보가 없습니다.' }}</div>
              </div>

              <!-- 대표 감정 -->
              <div class="analysis-item">
                <div class="analysis-label section-label">대표 감정</div>
                <div class="analysis-value highlight">{{ flowerDetail?.emotionNameKr || emotionName }}</div>
              </div>

              <!-- 대표 감정 선정 이유 -->
              <div class="analysis-item" v-if="diary.reason">
                <div class="analysis-label section-label">선정 이유</div>
                <div class="analysis-value">{{ diary.reason }}</div>
              </div>

              <!-- 감정 분포 차트 -->
              <div class="analysis-item emotion-chart-section" v-if="diary.emotions && diary.emotions.length > 0">
                <div class="analysis-label section-label">감정 분포</div>
                <div class="emotion-chart-wrapper">
                  <Bar
                    :data="emotionChartData"
                    :options="emotionChartOptions"
                  />
                </div>
              </div>
            </div>

            <!-- 분석 안된 일기: 재분석/삭제 버튼 -->
            <div class="unanalyzed-actions">
              <div class="unanalyzed-message"  v-if="isUnanalyzed">
                <div class="unanalyzed-header">
                  <InformationCircleIcon  class="w-6 h-6" />
                  일기작성 TIP
                </div>
                <div class="unanalyzed-content">
                  너무 짧거나 의미없는 문장만으로 작성된 일기는 감정을 분석할 수 없습니다.<br>
                  오늘 있었던 일을 문장으로 한두 줄 이상으로 적어보세요.
                </div>
              </div>
              <div class="action-buttons">
                <!-- <button class="reanalyze-btn test-btn" @click="$emit('reanalyze-test')">테스트 분석</button> -->
                <!--<button class="reanalyze-btn" @click="$emit('reanalyze')">수정</button>-->
                <button class="delete-btn" @click="$emit('delete')">삭제</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 뒷면: 꽃 정보 -->
        <div class="flip-card-back modal-content diary-read-modal">
          <div class="modal-header">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ diary?.date }}</h2>
              <p class="text-sm text-gray-500 mt-1" v-if="diary">
                {{ flowerDetail?.flowerNameKr || flowerInfo.name }} · {{ flowerDetail?.emotionNameKr || emotionName }}
              </p>
            </div>
            <div class="header-buttons">
              <button class="save-image-btn" @click.stop="$emit('save-image')" title="이미지로 저장">
                <ArrowDownTrayIcon class="w-5 h-5" />
              </button>
              <button class="flip-btn" @click.stop="$emit('toggle-flip')" title="일기로 돌아가기">
                <ArrowPathIcon class="w-5 h-5" />
              </button>
              <button class="close-btn" @click="$emit('close')">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>
          <div class="modal-body">
            <!-- 도감 스타일: 꽃 이미지 + 정보 오버레이 -->
            <div class="flower-catalog" v-if="diary">
              <!-- 꽃 배경 이미지 -->
              <div class="flower-catalog-bg">
                <LazyImage
                  :src="realisticImage"
                  :alt="flowerDetail?.flowerNameKr || flowerInfo.name"
                  image-class="flower-catalog-image"
                  skeleton-type="detail"
                />
              </div>

              <!-- 포스트잇: 꽃 이름 + 꽃말 -->
              <div
                class="postit postit-info draggable"
                @mousedown="$emit('drag-start', $event, 'name')"
                :style="{ ...postitPositions.name, backgroundColor: postitColor }"
              >
                <div class="postit-text">
                  <div class="flower-name">
                    {{ flowerDetail?.flowerNameKr || flowerInfo.name }}
                    <span class="latin-name">({{ flowerDetail?.flowerNameEn || flowerInfo.nameEn }})</span>
                  </div>
                  <div class="flower-meaning">"{{ flowerDetail?.flowerMeaning || flowerInfo.meaning }}"</div>
                </div>
              </div>
            </div>
            <!-- 하단 상세 정보 -->
            <div class="flower-detail-info" v-if="flowerDetail">
              <div class="detail-section" v-if="flowerDetail.flowerColor">
                <div class="detail-content">
                  <div class="detail-title section-label">색상</div>
                  <div class="detail-text">{{ flowerDetail.flowerColor }}</div>
                  <div class="color-palette" v-if="flowerDetail.flowerColorCodes">
                    <div
                      v-for="(color, index) in flowerDetail.flowerColorCodes.split(',')"
                      :key="index"
                      class="color-chip"
                      :style="{ backgroundColor: color.trim() }"
                      :title="color.trim()"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="detail-section" v-if="flowerDetail.flowerOrigin">
                <div class="detail-content">
                  <div class="detail-title section-label">원산지</div>
                  <div class="detail-text">{{ flowerDetail.flowerOrigin }}</div>
                </div>
              </div>

              <div class="detail-section" v-if="flowerDetail.flowerFragrance">
                <div class="detail-content">
                  <div class="detail-title section-label">향기</div>
                  <div class="detail-text">{{ flowerDetail.flowerFragrance }}</div>
                </div>
              </div>

              <div class="detail-section story-section" v-if="flowerDetail.flowerMeaningStory">
                <div class="detail-content">
                  <div class="detail-title section-label">꽃말 유래</div>
                  <div class="detail-text story-text">{{ flowerDetail.flowerMeaningStory }}</div>
                </div>
              </div>

              <div class="detail-section story-section" v-if="flowerDetail.flowerFunFact">
                <div class="detail-content">
                  <div class="detail-title section-label">재미있는 사실</div>
                  <div class="detail-text story-text">{{ flowerDetail.flowerFunFact }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowPathIcon, XMarkIcon, ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { getEmotionData, UNKNOWN_EMOTION } from '@/utils/flowerMapper.js'
import LazyImage from '@/components/common/LazyImage.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { PERCENT_MAX } from '@/constants/uiConstants.js'

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  diary: {
    type: Object,
    default: null
  },
  flowerDetail: {
    type: Object,
    default: null
  },
  isFlipped: {
    type: Boolean,
    default: false
  },
  isUnanalyzed: {
    type: Boolean,
    default: false
  },
  postitPositions: {
    type: Object,
    default: () => ({
      name: {},
      meaning: {}
    })
  },
  realisticImage: {
    type: String,
    default: ''
  },
  allEmotionsData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'close',
  'toggle-flip',
  'save-image',
  'reanalyze',
  'reanalyze-test',
  'delete',
  'drag-start'
])

// 현재 일기의 꽃 데이터
const flowerData = computed(() => {
  // flowerDetail이 있으면 우선 사용
  if (props.flowerDetail) {
    return props.flowerDetail
  }

  // emotion 코드로 API 데이터에서 찾기
  if (props.diary?.emotion) {
    const emotionData = getEmotionData(props.allEmotionsData, props.diary.emotion)
    if (emotionData) return emotionData
  }

  return UNKNOWN_EMOTION
})

const flowerInfo = computed(() => {
  return {
    name: flowerData.value.flowerNameKr || '알 수 없음',
    nameEn: flowerData.value.flowerNameEn || 'Unknown',
    meaning: flowerData.value.flowerMeaning || '감정을 분석할 수 없어요'
  }
})

const emotionName = computed(() => {
  return flowerData.value.emotionNameKr || '알 수 없음'
})

// 감정 영역별 파스텔톤 포스트잇 색상
const AREA_POSTIT_COLORS = {
  red: '#FFCDD2',    // 연한 빨강
  yellow: '#FFF9C4', // 연한 노랑
  blue: '#BBDEFB',   // 연한 파랑
  green: '#C8E6C9'   // 연한 초록
}

// 포스트잇 색상 (감정 영역에 따라 동적으로 변경)
const postitColor = computed(() => {
  const area = flowerData.value.area?.toLowerCase()
  return AREA_POSTIT_COLORS[area] || '#FFF9C4' // 기본값: 연한 노랑
})

// 감정 코드로 감정 이름 가져오기
const getEmotionName = (emotionCode) => {
  const emotionData = getEmotionData(props.allEmotionsData, emotionCode)
  return emotionData?.emotionNameKr || emotionCode
}

// 감정 차트 데이터
const emotionChartData = computed(() => {
  if (!props.diary?.emotions || props.diary.emotions.length === 0) {
    return null
  }

  const emotions = props.diary.emotions
  const labels = emotions.map(e => e.emotionNameKr || e.emotion)
  const data = emotions.map(e => e.percent)
  const colors = emotions.map(e => e.color)

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20
      }
    ]
  }
})

// 감정 차트 옵션
const emotionChartOptions = computed(() => {
  return {
    indexAxis: 'y', // 가로 바 차트
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: "'LeeSeoyun', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'LeeSeoyun', sans-serif"
        },
        callbacks: {
          label: (context) => {
            return `${context.parsed.x}%`
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: PERCENT_MAX,
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            size: 11,
            family: "'LeeSeoyun', sans-serif"
          },
          color: '#8B7355'
        },
        grid: {
          color: 'rgba(139, 115, 85, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 13,
            family: "'LeeSeoyun', sans-serif"
          },
          color: '#5D4E37'
        },
        grid: {
          display: false
        }
      }
    }
  }
})

const handleBackgroundClick = (event) => {
  if (event.target.classList.contains('modal')) {
    emit('close')
  }
}
</script>