import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

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
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
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
