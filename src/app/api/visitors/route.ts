import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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
    console.error('Failed to get visitor count:', error)
    return NextResponse.json({ count: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

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
    console.error('Failed to log visitor:', error)
    return NextResponse.json({ count: 0 })
  }
}
