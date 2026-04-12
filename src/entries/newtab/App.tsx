import { useState, useCallback, type CSSProperties } from 'react'

import { Clock } from '@/components/Clock'
import { SearchBar } from '@/components/SearchBar'
import { CountdownPanel } from '@/components/CountdownPanel'
import { SettingsPanel } from '@/components/SettingsPanel'
import { useAppData } from '@/hooks/useAppData'
import type { CountdownEvent } from '@/types'
import '@/index.css'

export default function NewTabApp() {
  const { data, setData, exportData, importData } = useAppData()
  const [showSettings, setShowSettings] = useState(false)

  const bgStyle: CSSProperties =
    data.backgroundType === 'image' && data.backgroundImage
      ? {
          backgroundImage: `url(${data.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : { backgroundColor: data.backgroundColor }

  const handleAddCountdown = useCallback(
    (event: CountdownEvent) => {
      setData((prev) => ({ countdownEvents: [...prev.countdownEvents, event] }))
    },
    [setData],
  )

  const handleDeleteCountdown = useCallback(
    (id: string) => {
      setData((prev) => ({ countdownEvents: prev.countdownEvents.filter((e) => e.id !== id) }))
    },
    [setData],
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={bgStyle}>
      {/* 全局遮罩层，让文字更易读 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 主内容区 — 搜索框独立绝对居中 */}
      <div
        className="relative z-10 w-full max-w-2xl px-8"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <SearchBar searchEngine={data.searchEngine} onEngineChange={(engine) => setData({ searchEngine: engine })} />
      </div>

      {/* 时钟浮动在搜索框上方 */}
      <div className="absolute z-10 w-full flex justify-center px-8" style={{ bottom: 'calc(50% + 5.5rem)' }}>
        <Clock />
      </div>

      {/* 右侧倒计时面板 */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-72 max-h-[80vh] overflow-y-auto pr-2">
        <CountdownPanel events={data.countdownEvents} onAdd={handleAddCountdown} onDelete={handleDeleteCountdown} />
      </div>

      {/* 右下角设置按钮 */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:scale-110"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* 设置面板 */}
      {showSettings && (
        <SettingsPanel
          data={data}
          onClose={() => setShowSettings(false)}
          onSetBackground={(image) => setData({ backgroundImage: image })}
          onSetBackgroundColor={(color) => setData({ backgroundColor: color })}
          onSetBackgroundType={(type) => setData({ backgroundType: type })}
          onSetSearchEngine={(engine) => setData({ searchEngine: engine })}
          onExport={exportData}
          onImport={importData}
        />
      )}
    </div>
  )
}
