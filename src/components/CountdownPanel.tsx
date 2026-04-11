import { useState } from 'react'
import { CountdownEvent } from '../types'

interface CountdownPanelProps {
  events: CountdownEvent[]
  onAdd: (event: CountdownEvent) => void
  onDelete: (id: string) => void
}

function getDaysLeft(dateStr: string) {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function CountdownCard({ event, onDelete }: { event: CountdownEvent; onDelete: () => void }) {
  const days = getDaysLeft(event.date)
  const isPast = days < 0
  const isToday = days === 0

  let daysLabel = ''
  let colorClass = ''

  if (isToday) {
    daysLabel = '今天'
    colorClass = 'text-yellow-300'
  } else if (isPast) {
    daysLabel = `已过 ${Math.abs(days)} 天`
    colorClass = 'text-white/40'
  } else if (days <= 7) {
    daysLabel = `还有 ${days} 天`
    colorClass = 'text-red-300'
  } else if (days <= 30) {
    daysLabel = `还有 ${days} 天`
    colorClass = 'text-orange-300'
  } else {
    daysLabel = `还有 ${days} 天`
    colorClass = 'text-green-300'
  }

  return (
    <div className="group relative bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all">
      {event.emoji && <span className="text-2xl">{event.emoji}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{event.label}</div>
        <div className="text-white/50 text-xs mt-0.5">{event.date}</div>
      </div>
      <div className={`text-sm font-semibold shrink-0 ${colorClass}`}>
        {daysLabel}
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center transition-opacity hover:bg-red-600"
      >
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

const EMOJI_OPTIONS = ['🎂', '🎉', '📅', '🏖️', '💼', '🎓', '❤️', '⭐', '🚀', '🎯']

export function CountdownPanel({ events, onAdd, onDelete }: CountdownPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('📅')

  const handleAdd = () => {
    if (!label.trim() || !date) return
    onAdd({
      id: Date.now().toString(),
      label: label.trim(),
      date,
      emoji,
    })
    setLabel('')
    setDate('')
    setEmoji('📅')
    setShowForm(false)
  }

  // 排序：未来的在前，距离最近的排最前；已过去的在后
  const sorted = [...events].sort((a, b) => {
    const da = getDaysLeft(a.date)
    const db = getDaysLeft(b.date)
    if (da >= 0 && db >= 0) return da - db
    if (da < 0 && db < 0) return db - da
    return da >= 0 ? -1 : 1
  })

  return (
    <div className="w-full max-w-sm">
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-xs font-medium uppercase tracking-widest">倒计时</span>
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
        >
          <svg className={`w-3.5 h-3.5 text-white transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <div className="mb-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 space-y-2.5">
          {/* Emoji 选择 */}
          <div className="flex gap-1.5 flex-wrap">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  emoji === e ? 'bg-white/30' : 'hover:bg-white/15'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="事件名称..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-white/40"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40 [color-scheme:dark]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!label.trim() || !date}
              className="flex-1 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
              添加
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 bg-white/10 hover:bg-white/15 text-white/70 text-sm rounded-lg transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 事件列表 */}
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="text-white/30 text-sm text-center py-4">
            还没有倒计时，点击 + 添加
          </div>
        ) : (
          sorted.map(event => (
            <CountdownCard
              key={event.id}
              event={event}
              onDelete={() => onDelete(event.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
