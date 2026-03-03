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

  const fillColor = {
    idle: '#da7756',
    loading: '#da7756',
    success: '#34d399',
    error: '#fb7185'
  }[state]

  const strokeColor = {
    idle: '#e8a88e',
    loading: '#e8a88e',
    success: '#6ee7b7',
    error: '#fda4af'
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
        {/* Code brackets < > */}
        <path
          d="M22 28 L10 40 L22 52"
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path
          d="M58 28 L70 40 L58 52"
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        {/* Central sparkle */}
        <path
          d="M40 14 C42 28, 52 38, 66 40 C52 42, 42 52, 40 66 C38 52, 28 42, 14 40 C28 38, 38 28, 40 14Z"
          fill={fillColor}
          opacity="0.9"
        />
        {/* Small accent sparkle */}
        <path
          d="M60 16 C61 22, 64 25, 70 26 C64 27, 61 30, 60 36 C59 30, 56 27, 50 26 C56 25, 59 22, 60 16Z"
          fill={fillColor}
          opacity="0.4"
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
