// Bungkus hasil build unpacked jadi zip: release/<productName> <version>.zip
// Pakai: node scripts/zip.mjs win|linux   (dipanggil otomatis oleh `npm run dist:win` / `dist:linux`)
import { createWriteStream, existsSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'

const unpackedDirs = { win: 'win-unpacked', linux: 'linux-unpacked' }

const platform = process.argv[2]
if (!(platform in unpackedDirs)) {
  console.error('Pakai: node scripts/zip.mjs <win|linux>')
  process.exit(1)
}

const root = fileURLToPath(new URL('..', import.meta.url))
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const releaseDir = join(root, 'release')
const source = join(releaseDir, unpackedDirs[platform])

if (!existsSync(source)) {
  console.error(`Folder ${source} nggak ada. Jalanin electron-builder dulu.`)
  process.exit(1)
}

const zipPath = join(releaseDir, `${pkg.productName} ${pkg.version}.zip`)
rmSync(zipPath, { force: true })

await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', resolve)
  output.on('error', reject)
  archive.on('error', reject)

  archive.pipe(output)
  // Isi zip: satu folder "<productName>/" berisi exe + file pendukung
  archive.directory(source, pkg.productName)
  archive.finalize()
})

const mb = (statSync(zipPath).size / 1024 / 1024).toFixed(1)
console.log(`\nZip siap: ${zipPath} (${mb} MB)`)
