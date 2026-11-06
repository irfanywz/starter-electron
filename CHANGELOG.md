<!-- starter-changelog: dihapus otomatis oleh `npm run init` supaya app baru mulai dari changelog kosong -->

# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) dan [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-11-06

### Added

- Struktur dasar: electron-vite 4, React 19, TypeScript, Tailwind 4, Zustand 5, react-router 7.
- Window frameless dengan titlebar custom (logo + tombol kontrol), tray icon, tema System/Light/Dark.
- Settings API generik (`shared/settings.ts` + `settingsApply.ts`) dengan validasi per field dan efek samping.
- Close to tray, start minimized, start at login, global shortcut, ingat posisi/ukuran window.
- Logging ke file (main + renderer), error boundary, toast tengah bawah.
- Hardening production: blok navigasi, tolak permission, DevTools dan reload mati; aktif lagi lewat `--debug`.
- Build portable unpacked, data di `<Nama Exe>_Data/` sejajar exe, hasil build otomatis di-zip.
- `npm run init` buat ganti identitas starter jadi app baru.
- ESLint, Prettier, GitHub Actions (CI dan release).
- Dokumentasi: `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`.
