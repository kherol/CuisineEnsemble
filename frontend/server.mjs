import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('./dist', import.meta.url)))
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '')
  const candidate = resolve(root, `.${normalized}`)
  return candidate.startsWith(root) ? candidate : null
}

function sendFile(res, filePath) {
  const extension = extname(filePath).toLowerCase()
  const isAsset = filePath.includes(`${join('dist', 'assets')}`)

  res.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Cache-Control': isAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  })

  createReadStream(filePath).pipe(res)
}

const server = createServer((req, res) => {
  if (!req.url || !['GET', 'HEAD'].includes(req.method || '')) {
    res.writeHead(405)
    res.end('Method Not Allowed')
    return
  }

  const requestedPath = safeFilePath(req.url)
  let filePath = requestedPath

  if (filePath && existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(root, 'index.html')
  }

  if (!existsSync(filePath)) {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Frontend build not found. Run npm run build.')
    return
  }

  sendFile(res, filePath)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`CuisineEnsemble frontend listening on port ${port}`)
})
