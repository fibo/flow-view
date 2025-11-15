#!/usr/bin/env node
import { exec } from 'child_process'
import { createReadStream } from 'fs'
import { access } from 'fs/promises'
import { createServer } from 'http'
import os from 'os'
import { extname, join } from 'path'

let PORT = process.env.PORT ?? 3000
let ROOT_DIR = process.cwd()

let basePathname = 'flow-view'

let baseUrl = `http://localhost:${PORT}/${basePathname}/`

let fileExtensionToMimeTypeMap = new Map()
  .set('css', 'text/css; charset=UTF-8')
  .set('html', 'text/html; charset=UTF-8')
  .set('js', 'text/javascript; charset=UTF-8')

createServer(async (req, res) => {
  let url = req.url.split('/').filter((part) => part != basePathname).join('/')
  let pathParts = [ROOT_DIR, url]

  if (url.endsWith('/'))
    pathParts.push('index.html')

  let filePath = join(...pathParts)

  let exists = await access(filePath).then(() => true, () => false)

  let sendText = (statusCode, text) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/html charset=utf-8' })
    res.end(text)
  }

  let fileExtension = extname(filePath).substring(1).toLowerCase()
  let mimeType = fileExtensionToMimeTypeMap.get(fileExtension)

  if (fileExtension && !mimeType)
    return sendText(501, 'Not implemented')

  if (!exists) {
    if (mimeType) return sendText(404, 'Not found')
    filePath = join(ROOT_DIR, '404.html')
    mimeType = 'html'
  }

  let stream = createReadStream(filePath)

  res.writeHead(200, { 'Content-Type': mimeType })
  stream.pipe(res)
}).listen(PORT, () => {
  switch(os.platform()) {
    case 'darwin': exec(`open ${baseUrl}`)
    case 'linux': exec(`xdg-open ${baseUrl}`)
    case 'win32': exec(`start ${baseUrl}`)
    default: console.info(`Server started on ${baseUrl}`)
  }
})
