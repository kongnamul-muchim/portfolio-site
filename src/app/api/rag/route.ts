import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';

// VPS 백엔드 비밀번호 (변경 불가)
const VPS_ADMIN_PW = 'gugu-admin-2026';

function translatePassword(body: Record<string, unknown>): Record<string, unknown> {
  if (body.admin_token === 'gugu2026') {
    return { ...body, admin_token: VPS_ADMIN_PW };
  }
  return body;
}

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();
    body = translatePassword(body);
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

    const response = await fetch(`${VPS_API}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': clientIp,
        'X-Real-IP': clientIp,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(55000),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: '서버 연결 오류', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  let adminToken = req.nextUrl.searchParams.get('admin_token');
  // 새 비밀번호를 VPS 비밀번호로 변환
  if (adminToken === 'gugu2026') adminToken = VPS_ADMIN_PW;

  try {
    const url = adminToken
      ? `${VPS_API}/rate-limit?admin_token=${adminToken}`
      : `${VPS_API}/rate-limit`;
    const response = await fetch(url, {
      headers: {
        'X-Forwarded-For': req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { remaining: 0, limit: 10, is_admin: false },
      { status: 200 }
    );
  }
}
