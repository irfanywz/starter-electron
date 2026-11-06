import { app } from 'electron'
import { accessSync, constants, mkdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

export interface DataPaths {
  /** Folder data app (settings.json, logs/, session/, dll) */
  dataDir: string
  packaged: boolean
  /** true kalau folder di sebelah exe nggak bisa ditulis, jadi pakai lokasi default OS */
  fallback: boolean
}

let current: DataPaths | null = null

/** Folder tempat exe berada (di macOS: folder yang berisi .app). */
function appBaseDir(): string {
  if (!app.isPackaged) return app.getAppPath()
  if (process.platform === 'darwin') return resolve(dirname(process.execPath), '../../..')
  return dirname(process.execPath)
}

/** Nama data folder = nama exe + "_Data", mis. "Starter Minimal_Data". */
function dataFolderName(): string {
  if (!app.isPackaged) return '.dev-data'
  return `${basename(process.execPath).replace(/\.exe$/i, '')}_Data`
}

function ensureWritable(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true })
    accessSync(dir, constants.W_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Semua data app disimpan di "<NamaExe>_Data" SEJAJAR dengan exe, jadi kalau folder app
 * (exe + _Data) dipindah/dicopy ke perangkat lain, datanya ikut.
 *
 *   Starter Minimal/
 *   ├── Starter Minimal.exe
 *   └── Starter Minimal_Data/   <- settings.json, logs/, session/, crashDumps/
 *
 * Dev: .dev-data di root project (di-gitignore).
 * Kalau foldernya nggak bisa ditulis (mis. Program Files), fallback ke lokasi default OS.
 *
 * HARUS dipanggil sebelum app 'ready' dan sebelum requestSingleInstanceLock().
 */
export function setupDataPaths(): DataPaths {
  const dataDir = join(appBaseDir(), dataFolderName())

  if (!ensureWritable(dataDir)) {
    current = { dataDir: app.getPath('userData'), packaged: app.isPackaged, fallback: true }
    return current
  }

  app.setPath('userData', dataDir)
  // Cache/cookies Chromium dan crash dump dipisah subfolder biar rapi
  app.setPath('sessionData', join(dataDir, 'session'))
  app.setPath('crashDumps', join(dataDir, 'crashDumps'))

  current = { dataDir, packaged: app.isPackaged, fallback: false }
  return current
}

export function getDataPaths(): DataPaths {
  if (!current) throw new Error('setupDataPaths() belum dipanggil')
  return current
}
