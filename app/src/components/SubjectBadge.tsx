import { SUBJECT_META } from '../utils/scoring'
import { type Subject } from '../types'

export function SubjectBadge({ subject }: { subject: Subject }) {
  const meta = SUBJECT_META[subject]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.bgColor} ${meta.color} border ${meta.borderColor}`}>
      {meta.language === 'en' ? '🇬🇧' : '🇩🇪'} {meta.label}
    </span>
  )
}
