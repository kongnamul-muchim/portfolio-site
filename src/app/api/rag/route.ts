import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const VPS_API = 'http://aichat:8000/api';
const VPS_ADMIN_PW = process.env.ADMIN_TOKEN || '';

function translatePassword(body: Record<string, unknown>): Record<string, unknown> {
  if (body.admin_token === 'gugu2026') {
    return { ...body, admin_token: VPS_ADMIN_PW };
  }
  return body;
}

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();

    // If admin_token is provided, require admin session
    if (body.admin_token === 'gugu2026') {
      const token = await getToken({ req });
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
      }
    }

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
  if (adminToken === 'gugu2026') {
    // Require admin session for privileged access
    const token = await getToken({ req });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }
    adminToken = VPS_ADMIN_PW;
  }

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
