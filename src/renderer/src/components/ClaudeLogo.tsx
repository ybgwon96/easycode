interface ClaudeLogoProps {
  state?: 'idle' | 'loading' | 'success' | 'error'
  size?: number
}

export default function ClaudeLogo({
  state = 'idle',
  size = 80
}: ClaudeLogoProps): React.JSX.Element {
  const stateClass = {
    idle: '',
    loading: 'animate-bounce',
    success: 'drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]',
    error: 'animate-[shake_0.5s_ease-in-out_infinite]'
  }[state]

  const promptColor = {
    idle: '#f5ede6',
    loading: '#f5ede6',
    success: '#34d399',
    error: '#fb7185'
  }[state]

  return (
    <div
      className={`inline-flex items-center justify-center transition-all duration-500 ${stateClass}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Terminal body */}
        <rect x="8" y="8" width="64" height="64" rx="10" fill="#141210" />
        {/* Title bar */}
        <rect x="8" y="8" width="64" height="12" rx="10" fill="#e8e4e0" />
        <rect x="8" y="14" width="64" height="6" fill="#e8e4e0" />
        {/* Window dots */}
        <circle cx="17" cy="14" r="2.2" fill="#fb7185" />
        <circle cx="23.5" cy="14" r="2.2" fill="#fbbf24" />
        <circle cx="30" cy="14" r="2.2" fill="#34d399" />
        {/* > prompt (eye position) */}
        <path
          d="M23 30 L32 38 L23 46"
          fill="none"
          stroke={promptColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* _ cursor (mouth position) */}
        <line
          x1="36"
          y1="56"
          x2="52"
          y2="56"
          stroke={promptColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
