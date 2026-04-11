import { useState, useRef, useEffect } from 'react'
import { AppData, SEARCH_ENGINES, SEARCH_ENGINE_LABELS } from '../types'

interface SearchBarProps {
  searchEngine: AppData['searchEngine']
  onEngineChange: (engine: AppData['searchEngine']) => void
}

export function SearchBar({ searchEngine, onEngineChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showEngines, setShowEngines] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowEngines(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    const q = query.trim()
    if (!q) return
    const url = SEARCH_ENGINES[searchEngine] + encodeURIComponent(q)
    window.location.href = url
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const engines = Object.keys(SEARCH_ENGINES) as AppData['searchEngine'][]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl overflow-visible shadow-2xl transition-all focus-within:bg-white/20 focus-within:border-white/40">
        {/* 搜索引擎切换 */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowEngines(v => !v)}
            className="px-4 py-3.5 text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {SEARCH_ENGINE_LABELS[searchEngine]}
            <svg className={`w-3.5 h-3.5 transition-transform ${showEngines ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showEngines && (
            <div className="absolute top-full left-0 mt-2 bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xl z-50 min-w-[120px]">
              {engines.map(engine => (
                <button
                  key={engine}
                  onClick={() => { onEngineChange(engine); setShowEngines(false) }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    engine === searchEngine
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {SEARCH_ENGINE_LABELS[engine]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 分隔线 */}
        <div className="w-px h-5 bg-white/25" />

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索..."
          className="flex-1 bg-transparent text-white placeholder-white/40 px-4 py-3.5 outline-none text-base"
        />

        {/* 搜索按钮 */}
        <button
          onClick={handleSearch}
          className="px-4 py-3.5 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
