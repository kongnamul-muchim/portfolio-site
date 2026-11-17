import { getValidToken } from '@/lib/auth/valid-token'
import { isAdminAlias } from '@/lib/auth/admin-alias'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 관리자 별칭 암호 검증 전용 엔드포인트.
 * 화면에서 입력한 암호를 서버에 먼저 물어보고, 통과할 때만 관리자 UI 를 켠다.
 * (예전에는 아무 문자열이나 통과시켜 화면만 관리자로 바뀌었다)
 */
export async function POST(req: NextRequest) {
  let token = ''
  try {
    const body = await req.json()
    token = typeof body?.token === 'string' ? body.token : ''
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 요청입니다.' }, { status: 400 })
  }

  if (!isAdminAlias(token)) {
    return NextResponse.json({ ok: false, error: '암호가 틀렸습니다.' }, { status: 403 })
  }

  const session = await getValidToken(req)
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: '관리자 계정으로 로그인한 뒤 다시 시도해 주세요.' },
      { status: 403 }
    )
  }

  return NextResponse.json({ ok: true })
}
