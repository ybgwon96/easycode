const variants = {
  primary: [
    'bg-gradient-to-r from-primary to-primary-hover text-white',
    'shadow-lg shadow-primary-glow',
    'hover:shadow-xl hover:shadow-primary-glow hover:scale-[1.03] hover:brightness-110',
    'active:scale-[0.98]'
  ].join(' '),
  secondary: [
    'bg-white/5 text-text border border-glass-border',
    'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]',
    'active:scale-[0.98]'
  ].join(' ')
} as const

const sizes = {
  lg: 'px-8 py-3 text-[15px] gap-2.5 rounded-2xl',
  sm: 'px-5 py-2 text-sm gap-1.5 rounded-xl'
} as const

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'sm',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={`inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${sizes[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
