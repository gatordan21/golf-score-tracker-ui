import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStat(value: number | string | null | undefined, suffix = ''): string {
  if (value === null || value === undefined) return '—'
  return `${value}${suffix}`
}

export function formatScoreVsPar(score: number | null | undefined): string {
  if (score === null || score === undefined) return '—'
  if (score === 0) return 'E'
  return score > 0 ? `+${score}` : String(score)
}
