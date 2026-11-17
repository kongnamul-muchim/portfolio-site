import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'public/uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 확장자는 원본 파일명이 아니라 실제 파일 시그니처로 결정한다.
// (원본명을 그대로 쓰면 image/png 로 위장한 .html 을 올려 같은 오리진에서
//  스크립트가 실행되는 저장형 XSS 가 가능했다)
const SIGNATURES: { ext: string; test: (b: Buffer) => boolean }[] = [
  { ext: '.jpg', test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: '.png',
    test: (b) =>
      b.length > 8 &&
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  { ext: '.gif', test: (b) => b.length > 6 && b.subarray(0, 6).toString('latin1').startsWith('GIF8') },
  {
    ext: '.webp',
    test: (b) =>
      b.length > 12 &&
      b.subarray(0, 4).toString('latin1') === 'RIFF' &&
      b.subarray(8, 12).toString('latin1') === 'WEBP',
  },
]

function detectImageExt(buf: Buffer): string | null {
  for (const sig of SIGNATURES) {
    if (sig.test(buf)) return sig.ext
  }
  return null
}

const fileFilter = (_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('허용되지 않는 파일 형식입니다.'))
  }
}

// 메모리에 받은 뒤 시그니처를 검사하고 나서 디스크에 쓴다.
// (디스크에 먼저 쓰면 검증 전 파일이 잠시라도 공개 경로에 노출된다)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const uploadMiddleware = promisify(upload.single('file'))

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: '로그인이 필요합니다.' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await (uploadMiddleware as unknown as (r: NextApiRequest, s: NextApiResponse) => Promise<void>)(req, res)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        return res.status(400).json({ error: '파일 크기가 5MB를 초과합니다.' })
      }
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: '파일 업로드 실패' })
  }

  const file = (req as NextApiRequest & { file?: Express.Multer.File }).file
  if (!file || !file.buffer) {
    return res.status(400).json({ error: '파일이 없습니다.' })
  }

  const ext = detectImageExt(file.buffer)
  if (!ext) {
    return res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' })
  }

  const filename = `img-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
  try {
    fs.writeFileSync(path.join(uploadDir, filename), file.buffer)
  } catch {
    return res.status(500).json({ error: '파일 저장 실패' })
  }

  // public/ 은 빌드 시점 스냅샷이라 런타임에 쓴 파일이 서빙되지 않는다.
  // 저장 위치는 그대로 두고, 읽기는 전용 라우트로 처리한다.
  const imageUrl = `/api/uploads/${filename}`
  return res.status(200).json({ url: imageUrl, filename })
}
