import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const MAX_LINES = 500

export default function LogViewer({ lines }: { lines: string[] }): React.JSX.Element {
  const { t } = useTranslation('steps')
  const bottomRef = useRef<HTMLDivElement>(null)
  const displayLines = lines.length > MAX_LINES ? lines.slice(-MAX_LINES) : lines

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayLines.length])

  return (
    <div className="glass-card !rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-error/60" />
        <div className="w-2 h-2 rounded-full bg-warning/60" />
        <div className="w-2 h-2 rounded-full bg-success/60" />
        <span className="ml-2 text-[10px] text-text-muted/50 font-mono">output</span>
      </div>

      <div className="p-3 h-32 overflow-y-auto font-mono text-[11px] leading-5 text-text-muted">
        {displayLines.length === 0 && (
          <span className="opacity-40 italic">{t('install.logViewer.waiting')}</span>
        )}
        {displayLines.map((line, i) => (
          <div key={i} className="break-all hover:text-text/80 transition-colors">
            <span className="text-primary/30 mr-2 select-none">&gt;</span>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
