import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';
const VPS_ADMIN_PW = 'gugu-admin-2026';

export async function GET(req: NextRequest) {
  const adminToken = req.nextUrl.searchParams.get('admin_token');
  const token = adminToken === 'gugu2026' ? VPS_ADMIN_PW : adminToken;
  const topK = req.nextUrl.searchParams.get('top_k') || '5';

  try {
    const response = await fetch(
      `${VPS_API}/admin/evaluate-search-modes?top_k=${topK}&admin_token=${token}`,
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
