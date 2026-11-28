import marineLogo from '@/assets/marine.png'

type LogoMarkProps = {
  size?: number
  className?: string
}

export function LogoMark({ size = 56, className }: LogoMarkProps) {
  return (
    <img
      src={marineLogo}
      alt="M.A.R.I.N.E. logo"
      className={className}
      style={{
        width: `${size * 2}px`,
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
      }}
    />
  )
}