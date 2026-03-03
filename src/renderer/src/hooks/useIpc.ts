import { useState, useEffect, useCallback } from 'react'

export const useInstallLogs = (): {
  logs: string[]
  error: string | null
  clearLogs: () => void
} => {
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const offProgress = window.electronAPI.install.onProgress((msg) => {
      setLogs((prev) => [...prev, msg])
    })
    const offError = window.electronAPI.install.onError((msg) => {
      setError(msg)
    })
    return () => {
      offProgress()
      offError()
    }
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    setError(null)
  }, [])

  return { logs, error, clearLogs }
}
