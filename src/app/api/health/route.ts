import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// 실행 검증(smoke test)용. DB 가 죽으면 503 을 돌려줘서
// "페이지는 200 인데 DB 는 끊긴" 상태를 잡는다.
export const dynamic = 'force-dynamic'

export async function GET() {
  const started = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, db: 'up', ms: Date.now() - started })
  } catch {
    return NextResponse.json({ ok: false, db: 'down' }, { status: 503 })
  }
}
