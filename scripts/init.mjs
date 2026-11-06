// Ganti identitas starter jadi app baru.
//   npm run init                         (interaktif)
//   npm run init -- "My App" com.me.app  (langsung)
// Jalanin SEBELUM npm install / commit pertama. Aman dijalanin ulang.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const path = (...parts) => join(root, ...parts)
const read = (file) => readFileSync(file, 'utf8')
const write = (file, text) => writeFileSync(file, text)

const pkgFile = path('package.json')
const ymlFile = path('electron-builder.yml')
const lockFile = path('package-lock.json')

const pkg = JSON.parse(read(pkgFile))
const yml = read(ymlFile)
const oldName = pkg.name
const oldProduct = pkg.productName
const oldAppId = yml.match(/^appId:\s*(.+)$/m)?.[1].trim()

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Nama dipakai buat nama exe + folder data, jadi nggak boleh ada karakter terlarang Windows
const validProduct = (text) => text.length > 0 && text.length <= 60 && !/[\\/:*?"<>|]/.test(text)
const validAppId = (text) => /^[a-zA-Z][\w-]*(\.[\w-]+)+$/.test(text)

async function ask(rl, question, fallback, isValid, errorHint) {
  for (;;) {
    const answer = (await rl.question(`${question} [${fallback}]: `)).trim() || fallback
    if (isValid(answer)) return answer
    console.log(`  ${errorHint}`)
  }
}

let product = process.argv[2]
let appId = process.argv[3]

if (!product) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  product = await ask(
    rl,
    'Nama app (jadi nama exe + folder data)',
    oldProduct,
    validProduct,
    'Nama kosong atau mengandung karakter terlarang \\ / : * ? " < > |'
  )
  const defaultAppId = `com.example.${slugify(product).replace(/-/g, '') || 'app'}`
  appId = await ask(rl, 'App ID', defaultAppId, validAppId, 'Format: com.namaku.app')
  rl.close()
}

const slug = slugify(product)
appId ??= `com.example.${slug.replace(/-/g, '')}`

if (!validProduct(product) || !slug) {
  console.error('Nama app nggak valid (kosong / karakter terlarang \\ / : * ? " < > |).')
  process.exit(1)
}
if (!validAppId(appId)) {
  console.error('App ID nggak valid. Format: com.namaku.app')
  process.exit(1)
}

// 1. package.json
pkg.name = slug
pkg.productName = product
write(pkgFile, JSON.stringify(pkg, null, 2) + '\n')

// 2. electron-builder.yml
write(
  ymlFile,
  yml.replace(/^appId:.*$/m, `appId: ${appId}`).replace(/^productName:.*$/m, `productName: ${product}`)
)

// 3. package-lock.json (kalau sudah ada)
if (existsSync(lockFile)) {
  const lock = JSON.parse(read(lockFile))
  lock.name = slug
  if (lock.packages?.['']) lock.packages[''].name = slug
  write(lockFile, JSON.stringify(lock, null, 2) + '\n')
}

// 4. Teks di source (judul, titlebar, AppUserModelId, dll) + README
const textExts = new Set(['.ts', '.tsx', '.html', '.css', '.md'])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (textExts.has(extname(full))) yield full
  }
}

const changed = []
for (const file of [...walk(path('src')), path('README.md'), path('ARCHITECTURE.md')]) {
  if (!existsSync(file)) continue
  const before = read(file)
  let after = before
  if (oldProduct && oldProduct !== product) after = after.replaceAll(oldProduct, product)
  if (oldAppId && oldAppId !== appId) after = after.replaceAll(oldAppId, appId)
  if (file === path('README.md') && oldName !== slug) {
    after = after.replace(`# ${oldName}\n`, `# ${slug}\n`)
  }
  if (after !== before) {
    write(file, after)
    changed.push(file.slice(root.length))
  }
}

// 5. CHANGELOG: app baru mulai kosong. Marker cuma ada di changelog bawaan starter,
//    jadi menjalankan init lagi nggak akan menimpa changelog yang sudah lu isi.
const changelogFile = path('CHANGELOG.md')
if (existsSync(changelogFile) && read(changelogFile).includes('starter-changelog')) {
  const today = new Date().toISOString().slice(0, 10)
  write(
    changelogFile,
    `# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) dan [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [${pkg.version}] - ${today}

### Added

- Rilis awal, dibuat dari starter-minimal.
`
  )
  changed.push('CHANGELOG.md (direset)')
}

console.log(`\nSelesai.
  Nama     : ${product}  (package name: ${slug})
  App ID   : ${appId}
  Exe      : ${product}.exe  ->  data di "${product}_Data/"
  Zip      : ${product} ${pkg.version}.zip
  File teks yang ikut diubah: ${changed.length ? changed.join(', ') : '(tidak ada)'}

Berikutnya: npm install, lalu npm run format.`)
