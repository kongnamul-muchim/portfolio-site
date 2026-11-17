import { getValidToken } from '@/lib/auth/valid-token'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'

/**
 * POST /api/admin/users/[id]/reset-password
 * 관리자가 임시 비밀번호를 발급한다. 발급된 비밀번호는 응답으로 한 번만 보여준다.
 * (메일 발송 인프라 없이 계정 복구를 처리하기 위한 경로)
 */
function makeTempPassword() {
  // 8자 이상 + 영문/숫자/특수문자 조건을 항상 만족하도록 조합
  const body = randomBytes(6).toString('base64url').replace(/[^a-zA-Z0-9]/g, 'x')
  const digits = randomBytes(2).readUInt16BE(0) % 100
  return `Tmp-${body}${String(digits).padStart(2, '0')}!`
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const token = await getValidToken(req)
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
  }

  const { id } = await ctx.params

  try {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, nickname: true } })
    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    const tempPassword = makeTempPassword()
    const hashed = await bcrypt.hash(tempPassword, 10)

    // 비밀번호 교체 + 기존 세션 전부 종료(activeSession 비우기)
    await prisma.user.update({
      where: { id },
      data: { password: hashed, activeSession: null }
    })

    return NextResponse.json({
      nickname: user.nickname,
      tempPassword,
      notice: '이 비밀번호는 다시 볼 수 없습니다. 본인에게 전달한 뒤 로그인해서 변경하도록 안내하세요.'
    })
  } catch (error) {
    console.error('[ADMIN_RESET_PASSWORD]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
