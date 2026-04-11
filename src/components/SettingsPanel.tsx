import { useRef, useState } from 'react'

import type { AppData, SearchEngine } from '@/types'

interface SettingsPanelProps {
  data: AppData
  onClose: () => void
  onSetBackground: (image: string | null) => void
  onSetBackgroundColor: (color: string) => void
  onSetBackgroundType: (type: 'color' | 'image') => void
  onSetSearchEngine: (engine: SearchEngine) => void
  onExport: () => void
  onImport: (file: File) => Promise<void>
}

const PRESET_COLORS = ['#0f172a', '#1e1b4b', '#064e3b', '#1c1917', '#0c1a2e', '#1a0533', '#0a1628', '#18181b'] as const

const SEARCH_ENGINE_LABELS: Record<string, string> = {
  bing: 'Bing',
  google: 'Google',
  baidu: '百度',
  duckduckgo: 'DuckDuckGo',
}

export function SettingsPanel(props: SettingsPanelProps) {
  const {
    data,
    onClose,
    onSetBackground,
    onSetBackgroundColor,
    onSetBackgroundType,
    onSetSearchEngine,
    onExport,
    onImport,
  } = props
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      onSetBackground(result)
      onSetBackgroundType('image')
    }
    reader.readAsDataURL(file)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportMsg('')
    try {
      await onImport(file)
      setImportMsg('✅ 导入成功，页面数据已更新')
    } catch (err) {
      setImportMsg(`❌ ${(err as Error).message}`)
    } finally {
      setImporting(false)
      if (importInputRef.current) importInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* 蒙层 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* 面板 */}
      <div className="relative z-10 w-80 h-full bg-gray-950/90 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">设置</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 背景设置 */}
          <section>
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">背景</h3>
            <div className="space-y-3">
              {/* 类型切换 */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSetBackgroundType('color')}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    data.backgroundType === 'color'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  纯色
                </button>
                <button
                  onClick={() => onSetBackgroundType('image')}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    data.backgroundType === 'image'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  图片
                </button>
              </div>

              {data.backgroundType === 'color' ? (
                <>
                  {/* 预设颜色 */}
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => onSetBackgroundColor(color)}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          data.backgroundColor === color
                            ? 'border-white scale-95'
                            : 'border-transparent hover:border-white/40'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {/* 自定义颜色 */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.backgroundColor}
                      onChange={(e) => onSetBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/20"
                    />
                    <span className="text-white/50 text-sm">自定义颜色</span>
                  </div>
                </>
              ) : (
                <>
                  {/* 图片预览 */}
                  {data.backgroundImage && (
                    <div className="relative rounded-xl overflow-hidden h-24">
                      <img src={data.backgroundImage} alt="背景预览" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          onSetBackground(null)
                          onSetBackgroundType('color')
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 border border-dashed border-white/25 hover:border-white/50 rounded-xl text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {data.backgroundImage ? '更换图片' : '选择本地图片'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
          </section>

          {/* 搜索引擎 */}
          <section>
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">默认搜索引擎</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['bing', 'google', 'baidu', 'duckduckgo'] as SearchEngine[]).map((engine) => (
                <button
                  key={engine}
                  onClick={() => onSetSearchEngine(engine)}
                  className={`py-2 rounded-lg text-sm transition-colors ${
                    data.searchEngine === engine
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {SEARCH_ENGINE_LABELS[engine]}
                </button>
              ))}
            </div>
          </section>

          {/* 数据管理 */}
          <section>
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">数据管理</h3>
            <div className="space-y-2">
              <button
                onClick={onExport}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                导出数据
              </button>
              <button
                onClick={() => importInputRef.current?.click()}
                disabled={importing}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                {importing ? '导入中...' : '导入数据'}
              </button>
              <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              {importMsg && <p className="text-xs text-white/60 text-center">{importMsg}</p>}
            </div>
          </section>

          {/* 版本信息 */}
          <div className="text-center text-white/20 text-xs pt-4 border-t border-white/10">Neo Browser Home v1.0.0</div>
        </div>
      </div>
    </div>
  )
}
