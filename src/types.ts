// 倒计时事件
export interface CountdownEvent {
  id: string
  label: string
  date: string // YYYY-MM-DD
  emoji?: string
}

// 应用数据结构（全量，用于导入导出）
export interface AppData {
  backgroundImage: string | null // base64 or null
  backgroundType: 'color' | 'image'
  backgroundColor: string
  searchEngine: 'google' | 'bing' | 'baidu' | 'duckduckgo'
  countdownEvents: CountdownEvent[]
  version: string
}

export type SearchEngine = AppData['searchEngine']

export const DEFAULT_DATA: AppData = {
  backgroundImage: null,
  backgroundType: 'color',
  backgroundColor: '#0f172a',
  searchEngine: 'bing',
  countdownEvents: [],
  version: '1.0.0',
} as const

export const SEARCH_ENGINES = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  duckduckgo: 'https://duckduckgo.com/?q=',
} as const

export const SEARCH_ENGINE_LABELS: Record<SearchEngine, string> = {
  google: 'Google',
  bing: 'Bing',
  baidu: '百度',
  duckduckgo: 'DuckDuckGo',
}
