import {
  HomeIcon,
  BookOpenIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

export const menuItems = [
  {
    id: 'garden',
    label: '나의 화단보기',
    icon: HomeIcon,
    active: true
  },
  {
    id: 'encyclopedia',
    label: '나의 감정도감',
    icon: BookOpenIcon,
    active: false
  },
  {
    id: 'write',
    label: '감정일기 작성',
    icon: PencilSquareIcon,
    active: false
  },
  {
    id: 'emotion-control',
    label: '나의 감정제어 활동',
    icon: HeartIcon,
    active: false
  },
  {
    id: 'letter',
    label: '감정 레터',
    icon: EnvelopeIcon,
    active: false
  },
  {
    id: 'mood-meter',
    label: '감정 무드미터란?',
    icon: QuestionMarkCircleIcon,
    active: false
  },
  {
    id: 'logout',
    label: '로그아웃',
    icon: ArrowRightOnRectangleIcon,
    active: false
  },
]
