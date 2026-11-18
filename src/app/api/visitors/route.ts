import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
// 방문자 IP는 프록시가 확정한 값만 믿는다. 이 라우트만 예전 규칙(XFF 첫 값)을 쓰고 있어서
// 헤더 위조로 방문자 수를 부풀릴 수 있었다 (2026-11-18: 12명 → 14명 재현).
// 다른 라우트(/api/rag, proxy.ts)와 같은 헬퍼를 쓴다.
import { getClientIp } from '@/lib/client-ip'

// 방문자 집계의 "오늘"은 KST(UTC+9) 자정 기준이다.
// 컨테이너는 UTC로 도는데 new Date().setHours(0,0,0,0) 을 쓰면
// 하루 경계가 한국 시간 09:00에 끊겨 오전 방문이 전날로 잡혔다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

function kstDayStart(now: Date = new Date()): Date {
  const shifted = new Date(now.getTime() + KST_OFFSET_MS)
  shifted.setUTCHours(0, 0, 0, 0)
  return new Date(shifted.getTime() - KST_OFFSET_MS)
}

export async function GET() {
  try {
    const today = kstDayStart()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const count = await prisma.visitLog.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    // DB 장애를 "방문자 0명"으로 숨기지 않는다. 상태코드로 알리고 화면은 배지를 감춘다.
    console.error('Failed to get visitor count:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ count: 0, ok: false, error: 'db_unavailable' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    const today = kstDayStart()

    // Upsert: 같은 IP + 오늘 날짜 조합이 없을 때만 INSERT
    await prisma.visitLog.upsert({
      where: {
        ip_date: {
          ip,
          date: today,
        },
      },
      update: {}, // 이미 있으면 아무것도 안 함
      create: {
        ip,
        date: today,
      },
    })

    // 업데이트된 오늘 방문자 수 반환
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const count = await prisma.visitLog.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to log visitor:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ count: 0, ok: false, error: 'db_unavailable' }, { status: 503 })
  }
}
