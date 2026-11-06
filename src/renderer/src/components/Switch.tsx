interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
}

export default function Switch({ checked, onChange, disabled, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={
        'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ' +
        (checked ? 'bg-accent' : 'bg-fg/20')
      }
    >
      <span
        className={
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ' +
          (checked ? 'translate-x-5' : '')
        }
      />
    </button>
  )
}
