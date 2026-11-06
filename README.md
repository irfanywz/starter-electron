# starter-minimal

Base starter buat app desktop Electron: satu stack, satu struktur, biar pindah antar app nggak bingung.

**Stack:** Electron 38 · electron-vite 4 · Vite 7 · React 19 · TypeScript 5.9 · Tailwind 4 · Zustand 5 · react-router 7 · electron-log 5 · lucide-react

## Fitur

- **Portable unpacked**: build jadi folder (nggak extract ke temp tiap dibuka), otomatis di-zip `<Nama App> <versi>.zip`.
- **Data ikut app**: semua data di `<Nama Exe>_Data/` sejajar exe. Pindah folder app = data ikut.
- **Tray icon** (show/hide, ganti tema, quit), **tema System/Light/Dark**, **close to tray**, **start minimized**, **start at login**, **global shortcut**.
- **Settings API generik**: nambah setting baru cukup edit satu file.
- **Ingat posisi & ukuran window**, **logging ke file**, **error boundary**, **toast** tengah bawah, **router** (hash).
- **Hardening production**: navigasi keluar app diblok, permission ditolak, DevTools dan reload mati (aktif lagi lewat `--debug`).
- **`npm run init`**: ganti identitas starter jadi app baru dalam satu perintah.

## Mulai app baru

```bash
# copy folder starter ini, lalu di dalamnya:
npm run init            # nanya nama app + appId, ganti semua yang perlu
npm install
npm run format          # sekali aja
npm run dev             # data dev disimpan di ./.dev-data
```

`npm run init -- "Nama App" com.namaku.app` buat versi tanpa pertanyaan. Nama app dipakai buat nama exe dan folder data, jadi nggak boleh ada karakter `\ / : * ? " < > |`.

## Perintah

| Perintah                          | Fungsi                                                         |
| --------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                     | Jalanin app (HMR)                                              |
| `npm run build`                   | Build ke `./out` (tanpa typecheck)                             |
| `npm run build:check`             | Typecheck + build (dipakai CI)                                 |
| `npm run typecheck`               | Cek tipe saja                                                  |
| `npm run lint` / `lint:fix`       | ESLint                                                         |
| `npm run format` / `format:check` | Prettier                                                       |
| `npm run dist:win`                | `release/win-unpacked/` + `release/<Nama App> <versi>.zip`     |
| `npm run dist:linux`              | `release/linux-unpacked/` + zip                                |

Build Windows sebaiknya dijalanin di Windows (dari Linux/mac butuh Wine). Atau biar GitHub Actions yang build: `git tag v0.1.0 && git push --tags` (hasilnya zip di GitHub Release). CI pakai `npm ci`, jadi commit `package-lock.json`.

## Hasil build

```
Starter Minimal 0.1.0.zip
└── Starter Minimal/
    ├── Starter Minimal.exe
    └── Starter Minimal_Data/         <- dibuat otomatis saat pertama dijalanin
        ├── settings.json
        ├── logs/main.log
        ├── session/                  <- cache Chromium
        └── crashDumps/
```

Pindah perangkat: copy **seluruh folder app** (exe + `_Data`). Jangan taruh di folder yang nggak bisa ditulis (mis. `Program Files`).

## Debug hasil build

- **Log**: `<Nama App>_Data/logs/main.log` (main process + semua error renderer). Tombol "Open data folder" di Home langsung buka folder itu.
- **DevTools**: jalanin exe dengan flag `--debug`, mis. `& ".\Starter Minimal.exe" --debug`. F12 / Ctrl+Shift+I / Ctrl+R jadi aktif.

## Ganti icon

Timpa file-file ini (nama sama):

- `build/icon.ico` (min. 256x256, buat exe Windows)
- `build/icon.png` (512x512, buat Linux)
- `resources/icon.png` (256x256, icon window)
- `resources/tray.png` (32x32, background transparan)
- `src/renderer/src/assets/logo.png` (logo kecil di titlebar, tampil 16px)

## Dokumen lain

- [ARCHITECTURE.md](ARCHITECTURE.md): struktur folder, alur startup, cara kerja settings/IPC/keamanan/build, dan cara nambah fitur.
- [CHANGELOG.md](CHANGELOG.md): riwayat perubahan.
