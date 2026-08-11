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

  const adminToken = req.nextUrl.searchParams.get('admin_token');
  const token2 = adminToken === 'gugu2026' ? VPS_ADMIN_PW : adminToken;
  const topK = req.nextUrl.searchParams.get('top_k') || '5';

  try {
    const response = await fetch(
      `${VPS_API}/admin/evaluate-search-modes?top_k=${topK}&admin_token=${token2}`,
      { signal: AbortSignal.timeout(30000) },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: '서버 연결 오류', error: String(error) },
      { status: 500 }
    );
  }
}
