# starter-minimal

Versi ringan dari `starter-basic`, tapi udah lengkap buat app desktop beneran.

- **Portable unpacked**: build jadi folder (bukan single exe yang extract ke temp tiap dibuka), otomatis di-zip `<Nama App> <versi>.zip`.
- **Data ikut app**: semua data di `<Nama Exe>_Data/` sejajar exe. Pindah folder app = data ikut.
- **Tray icon**: klik = show/hide, klik kanan = menu (Show/Hide, Theme, Quit).
- **Tema System / Light / Dark**: dari UI atau menu tray, tersimpan, ikut tema OS saat mode System.
- **Settings API generik**: nambah setting baru cukup edit satu file (lihat bawah).
- **Close to tray** dan **Start minimized** bisa diatur di Settings.
- **Start at login** dan **global shortcut** show/hide (default `Ctrl/Cmd+Shift+Space`).
- **Ingat posisi & ukuran window** (aman kalau monitor udah dicabut).
- **Logging** ke `_Data/logs/main.log` (main + renderer, error yang nggak ketangkep ikut masuk).
- **Error boundary**: komponen crash = halaman fallback (bukan layar kosong), error masuk log.
- **Hardening production**: navigasi keluar app diblok, permission ditolak (kecuali clipboard write), DevTools dan reload (Ctrl+R) mati. Dev: F12 buka DevTools.
- **Router** (hash), **toast** tengah bawah, **ESLint + Prettier + GitHub Actions**.
- **`npm run init`**: ganti identitas starter jadi app baru dalam satu perintah.

**Stack:** Electron 38 · electron-vite 4 · Vite 7 · React 19 · TypeScript 5.9 · Tailwind 4 · Zustand 5 · react-router 7 · electron-log 5 · lucide-react

## Mulai app baru

```bash
# 1. copy folder starter ini, lalu di dalamnya:
npm run init            # nanya nama app + appId, ganti semua yang perlu (nama, exe, data folder, judul)
npm install
npm run format          # sekali aja, biar format:check di CI nggak merah
npm run dev             # data dev disimpan di ./.dev-data
```

`npm run init -- "Nama App" com.namaku.app` buat versi tanpa pertanyaan. Nama app dipakai buat nama exe dan folder data, jadi nggak boleh ada karakter `\ / : * ? " < > |`.

## Build

```bash
npm run build        # build ke ./out (tanpa typecheck, biar dist nggak keblok)
npm run build:check  # typecheck + build (dipakai CI)
npm run typecheck
npm run dist:win     # -> release/win-unpacked/ + release/<Nama App> <versi>.zip
npm run dist:linux   # -> release/linux-unpacked/ + zip
npm run lint
```

> Build Windows sebaiknya dijalanin di Windows (dari Linux/mac butuh Wine). Atau biar GitHub Actions yang build: `git tag v0.1.0 && git push --tags` (hasilnya zip di GitHub Release).
> CI pakai `npm ci`, jadi commit `package-lock.json`.
> Cache download Electron disimpan di `./.electron-cache` (diatur `electronDownload.cache` di `electron-builder.yml`, di-gitignore).

## Portable: struktur hasil build

```
Starter Minimal 0.1.0.zip
└── Starter Minimal/
    ├── Starter Minimal.exe
    ├── resources/, *.dll, ...        <- file Electron
    └── Starter Minimal_Data/         <- dibuat otomatis saat pertama dijalanin
        ├── settings.json
        ├── logs/main.log
        ├── session/                  <- cache Chromium
        └── crashDumps/
```

Lokasi data diatur di `src/main/paths.ts` (dipanggil paling awal di `main/index.ts`):

| Kondisi                | Lokasi data                                     |
| ---------------------- | ----------------------------------------------- |
| Build Windows / Linux  | `<folder exe>/<Nama Exe>_Data`                  |
| Build macOS            | `<folder yang berisi .app>/<Nama Exe>_Data`     |
| Dev                    | `<project>/.dev-data`                           |
| Folder exe read-only   | fallback ke lokasi default OS (dicatat di log)  |

Pindah perangkat: copy **seluruh folder app** (exe + `_Data`). Jangan taruh di folder yang nggak bisa ditulis (mis. `Program Files`).
Karena unpacked, app langsung jalan tanpa extract. Zip-nya tinggal di-extract sekali.

## Debug hasil build

- **Log**: `<Nama App>_Data/logs/main.log` (main process + semua error renderer, termasuk yang nggak ketangkep). Ini tempat pertama buat ngecek error di exe. Tombol "Open data folder" di Home langsung buka folder itu.
- **DevTools**: jalanin exe dengan flag `--debug`, mis. dari terminal: `& ".\Starter Minimal.exe" --debug`, atau bikin shortcut dengan target `"...\Starter Minimal.exe" --debug`. Dengan flag ini F12 / Ctrl+Shift+I / Ctrl+R aktif.
- **Typecheck**: `npm run build` dan `dist:*` nggak lagi diblok typecheck. Cek tipe lewat `npm run typecheck` (CI tetap menjalankannya).

## Struktur

```
build/                 # icon.ico + icon.png (dipakai electron-builder)
resources/             # icon.png (window), tray.png (tray), disalin ke <app>/resources/resources (extraResources), dibaca lewat src/main/assets.ts
scripts/               # init.mjs (ganti identitas), zip.mjs (bungkus hasil build)
.github/workflows/     # ci.yml, release.yml
src/
├── shared/
│   ├── ipc.ts         # channel IPC + tipe (single source of truth)
│   └── settings.ts    # definisi setting user: tipe, default, validator
├── main/
│   ├── index.ts       # urutan startup
│   ├── paths.ts       # lokasi data (portable)
│   ├── settings.ts    # baca/tulis settings.json
│   ├── settingsApply.ts  # validasi + efek samping + broadcast perubahan
│   ├── security.ts    # blok navigasi, permission, menu
│   ├── logger.ts      # electron-log -> _Data/logs
│   ├── tray.ts, window.ts, windowState.ts, autostart.ts, shortcut.ts
│   └── ipc/           # 1 file = 1 fitur
├── preload/index.ts   # contextBridge -> window.api
└── renderer/src/
    ├── main.tsx, App.tsx, router.tsx
    ├── pages/         # 1 file = 1 halaman
    ├── components/    # Layout, TitleBar, ToastHost, ErrorBoundary, ...
    ├── store/         # Zustand: use<Nama>Store.ts
    ├── lib/           # helper (toast.ts, errors.ts)
    └── styles.css     # token tema + Tailwind
```

## Cara pakai

**Setting baru** (contoh: `compactMode: boolean`), semuanya di `src/shared/settings.ts`:

1. tambah field di `Settings`
2. tambah nilai di `defaultSettings`
3. tambah validator di `validators` (TypeScript error kalau lupa)

Selesai. Di renderer: `useSettingsStore((s) => s.settings?.compactMode)` dan `update({ compactMode: true })`. Di main: `getSettings().compactMode`.
Kalau butuh efek ke OS (seperti tema, auto-start, shortcut), tambah fungsi di `effects` pada `src/main/settingsApply.ts`. Return string = pesan error, setting nggak disimpan dan pesannya muncul di renderer.

**Toast**: `import { toast } from '@/lib/toast'` lalu `toast.info | success | warning | error('pesan', { duration })`.

**Log**: renderer `window.api.log.info('...')` (juga `warn`, `error`); main `import { log } from './logger'`.

**Halaman baru**: bikin `pages/XPage.tsx`, tambah route di `router.tsx` dan menu di `components/Layout.tsx`. Error di halaman otomatis ditangkap (sidebar tetap hidup).

**IPC baru** (selain setting): `shared/ipc.ts` -> `main/ipc/<fitur>.ts` (daftarin di `ipc/index.ts`) -> `preload/index.ts`. Renderer pakai `window.api.<fitur>.<fn>()` (typed).

## Catatan

- **Start at login**: cuma di build Windows/macOS. Dipanggil ulang tiap app start, jadi kalau folder app dipindah, entry-nya ikut update begitu app dibuka sekali. Mau nyala ke tray? Aktifin "Start minimized".
- **Close to tray mati**: tombol close = quit. Quit dari tray menu selalu jalan.
- **Global shortcut**: kalau dipakai app lain, muncul toast error dan shortcut lama tetap aktif. Format: <https://www.electronjs.org/docs/latest/api/accelerator>.
- **Tray di Linux**: klik kiri nggak selalu terkirim, pakai menu klik kanan.
- **Hardening**: kalau butuh izin lain (kamera, notifikasi, dll), tambah ke `allowedPermissions` di `security.ts`. Butuh DevTools di build? Jalanin exe dengan `--debug` (lihat bagian Debug).
- React dan library renderer ada di `devDependencies` (di-bundle Vite), jadi nggak ikut ke paket build. Cuma library yang di-`require` oleh main process (mis. `electron-log`) yang masuk `dependencies`.

## Ganti icon

Timpa file-file ini (nama sama):

- `build/icon.ico` (min. 256x256, buat exe Windows)
- `build/icon.png` (512x512, buat Linux)
- `resources/icon.png` (256x256, icon window)
- `resources/tray.png` (32x32, background transparan)
- `src/renderer/src/assets/logo.png` (logo kecil di titlebar, tampil 16px)
