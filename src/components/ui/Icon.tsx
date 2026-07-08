'use client'

import {
  RotateCcw,
  Play,
  Download,
  Upload,
  Save,
  ChevronRight,
  ChevronDown,
  Plus,
  FolderPlus,
  Trash2,
  History,
  BookmarkCheck,
  Sun,
  Moon,
  Filter,
  GripVertical,
  Copy,
  Check,
  Type,
  Hash,
  Calendar,
  List,
  ToggleLeft,
  Wand2,
  LucideProps,
} from 'lucide-react'

export const Icons = {
  reset: RotateCcw,
  play: Play,
  download: Download,
  upload: Upload,
  save: Save,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  plus: Plus,
  folderPlus: FolderPlus,
  trash: Trash2,
  history: History,
  bookmark: BookmarkCheck,
  sun: Sun,
  moon: Moon,
  filter: Filter,
  grip: GripVertical,
  copy: Copy,
  check: Check,
  typeText: Type,
  hash: Hash,
  calendar: Calendar,
  list: List,
  toggle: ToggleLeft,
  wand2: Wand2,
} as const

export type IconName = keyof typeof Icons

interface IconProps extends LucideProps {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = Icons[name]
  return <LucideIcon {...props} />
}