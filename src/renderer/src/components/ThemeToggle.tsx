import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import type { ThemeMode } from '@shared/settings'
import { useSettingsStore } from '@/store/useSettingsStore'

const options: { value: ThemeMode; label: string; Icon: LucideIcon }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon }
]

export default function ThemeToggle() {
  const theme = useSettingsStore((s) => s.settings?.theme ?? 'system')
  const update = useSettingsStore((s) => s.update)

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex rounded-lg border border-border bg-surface p-1"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          aria-pressed={theme === value}
          onClick={() => update({ theme: value })}
          className={
            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ' +
            (theme === value ? 'bg-accent text-white' : 'text-muted hover:bg-fg/10')
          }
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}
