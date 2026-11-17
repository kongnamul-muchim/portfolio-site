import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Next.js 프로덕션(next start)은 빌드 이후 public/ 에 추가된 파일을 서빙하지 않는다.
// 업로드는 런타임에 파일을 쓰기 때문에 /uploads/xxx.png 로는 항상 404가 났다.
// 그래서 업로드 디렉터리를 직접 읽어 스트리밍하는 라우트를 둔다.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  // 파일명은 업로드 시 생성한 형식만 허용한다 (경로 조작 차단)
  if (!/^img-\d+-[a-f0-9]{16}\.(png|jpg|gif|webp)$/.test(name)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const type = CONTENT_TYPES[path.extname(name).toLowerCase()]
  if (!type) {
    return new NextResponse('Not found', { status: 404 })
  }

  const filePath = path.join(UPLOAD_DIR, name)
  // path.join 이후에도 업로드 디렉터리 밖으로 나가지 않았는지 재확인
  if (!path.resolve(filePath).startsWith(path.resolve(UPLOAD_DIR) + path.sep)) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const buf = fs.readFileSync(filePath)
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Length': String(buf.length),
        // 파일명이 매번 새로 생성되므로 내용이 바뀌지 않는다
        'Cache-Control': 'public, max-age=31536000, immutable',
        // 브라우저가 MIME을 추측해 HTML로 해석하는 것을 막는다
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
