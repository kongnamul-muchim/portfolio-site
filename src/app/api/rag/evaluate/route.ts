import { isAdminAlias } from '@/lib/auth/admin-alias'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const VPS_API = 'http://aichat:8000/api';
const VPS_ADMIN_PW = process.env.ADMIN_TOKEN || '';

export async function GET(req: NextRequest) {
  // Check admin auth via JWT token
  const token = await getToken({ req });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  // 헤더 우선(URL 에 비밀번호가 남지 않도록). 쿼리는 구버전 호환용.
  const adminToken = req.headers.get('x-admin-token') || req.nextUrl.searchParams.get('admin_token');
  const token2 = isAdminAlias(adminToken) ? VPS_ADMIN_PW : adminToken;
  const chunkSize = req.nextUrl.searchParams.get('chunk_size') || '1000';
  const topK = req.nextUrl.searchParams.get('top_k') || '5';

  try {
    const response = await fetch(
      `${VPS_API}/admin/evaluate?chunk_size=${chunkSize}&top_k=${topK}`,
      {
        // 관리자 토큰은 URL이 아니라 헤더로 보낸다(로그 노출 방지).
        headers: { 'X-Admin-Token': token2 || '' },
        signal: AbortSignal.timeout(30000),
      },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[rag-proxy]', error)
    return NextResponse.json(
      { detail: '서버 연결 오류' },
      { status: 500 }
    );
  }
}
