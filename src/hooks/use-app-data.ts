import { useState, useEffect, useCallback } from 'react'
import { AppData, DEFAULT_DATA } from '../types'

const STORAGE_KEY = 'neo_browser_home_data'

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DATA }
    const parsed = JSON.parse(raw) as Partial<AppData>
    return { ...DEFAULT_DATA, ...parsed }
  } catch {
    return { ...DEFAULT_DATA }
  }
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useAppData() {
  const [data, setDataState] = useState<AppData>(loadData)

  // 监听其他标签页的 storage 变化
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setDataState({ ...DEFAULT_DATA, ...JSON.parse(e.newValue) })
        } catch {}
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const setData = useCallback((updater: Partial<AppData> | ((prev: AppData) => Partial<AppData>)) => {
    setDataState(prev => {
      const patch = typeof updater === 'function' ? updater(prev) : updater
      const next = { ...prev, ...patch }
      saveData(next)
      return next
    })
  }, [])

  // 导出数据
  const exportData = useCallback(() => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neo-home-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  // 导入数据
  const importData = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string) as Partial<AppData>
          const next = { ...DEFAULT_DATA, ...parsed }
          saveData(next)
          setDataState(next)
          resolve()
        } catch {
          reject(new Error('文件格式不正确'))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }, [])

  return { data, setData, exportData, importData }
}
