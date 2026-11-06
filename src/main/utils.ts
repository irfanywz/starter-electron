import { app } from 'electron'

export const is = {
  dev: !app.isPackaged
}

/** DevTools aktif: di dev, atau di build kalau exe dijalankan dengan `--debug` */
export const debug = is.dev || process.argv.includes('--debug')

/** App dijalanin dengan --hidden (mis. dari auto-start): jangan munculin window, cukup tray. */
export const startHidden = process.argv.includes('--hidden')
