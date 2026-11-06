import { create } from 'zustand'
import type { SettingsErrors } from '@shared/ipc'
import type { Settings } from '@shared/settings'

interface SettingsStore {
  /** null sampai load pertama selesai */
  settings: Settings | null
  /** Panggil sekali di App. Return fungsi cleanup. */
  init: () => () => void
  /** Ubah satu atau beberapa setting. Return error per setting yang gagal (kosong = sukses semua). */
  update: (patch: Partial<Settings>) => Promise<SettingsErrors>
}

export const useSettingsStore = create<SettingsStore>((setState) => ({
  settings: null,

  init: () => {
    window.api.settings.get().then((settings) => setState({ settings }))
    // Ikut berubah kalau setting diganti dari tray / window lain
    return window.api.settings.onChange((settings) => setState({ settings }))
  },

  update: async (patch) => {
    const { settings, errors } = await window.api.settings.set(patch)
    setState({ settings })
    return errors
  }
}))
