import { getValidToken } from '@/lib/auth/valid-token'
import { isAdminAlias } from '@/lib/auth/admin-alias'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const VPS_API = 'http://aichat:8000/api';
const VPS_ADMIN_PW = process.env.ADMIN_TOKEN || '';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ doc_id: string }> }
) {
  // Check admin auth via JWT token
  const token = await getValidToken(_req);
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const { doc_id } = await params

  try {
    const adminToken = _req.headers.get('X-Admin-Token') || ''
    const vpsToken = isAdminAlias(adminToken) ? VPS_ADMIN_PW : adminToken

    // 토큰을 쿼리스트링에 넣으면 aichat 액세스 로그에 관리자 비밀번호가 그대로 남는다.
    // 헤더로만 전달한다(aichat 는 X-Admin-Token 우선 지원).
    const response = await fetch(`${VPS_API}/documents/${doc_id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': vpsToken },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[rag-proxy]', error)
    return NextResponse.json(
      { detail: '삭제 프록시 오류' },
      { status: 500 }
    );
  }
}
