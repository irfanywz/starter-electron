import { app } from 'electron'

/** Auto-start cuma jalan di build (bukan dev) dan bukan di Linux. */
export const autoStartSupported = (): boolean => app.isPackaged && process.platform !== 'linux'

/**
 * Daftarin / hapus app dari startup login.
 *
 * Path default = exe yang lagi jalan. Fungsi ini dipanggil lagi tiap app start
 * (lihat settingsApply.applyAllSettings), jadi kalau folder app dipindah, entry-nya
 * otomatis nunjuk ke lokasi baru begitu app dibuka sekali.
 *
 * Mau nyala hidden ke tray? Aktifin setting "startMinimized".
 */
export function applyAutoStart(enabled: boolean): void {
  if (!autoStartSupported()) return
  app.setLoginItemSettings({ openAtLogin: enabled })
}
