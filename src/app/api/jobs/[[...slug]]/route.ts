import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const VPS_API = 'http://aichat:8000/api';
const VPS_ADMIN_PW = process.env.ADMIN_TOKEN || '';

/**
 * Jobs API proxy — forwards all methods to VPS backend.
 * Admin-only — requires valid NextAuth JWT with admin role.
 */
async function proxyToVps(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  // Check admin auth via JWT token
  const token = await getToken({ req });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const { slug } = await params;
  const path = slug ? slug.join('/') : '';
  const url = new URL(req.url);

  let target = `${VPS_API}/jobs${path ? '/' + path : ''}`;

  // Copy query params & translate admin_token
  const searchParams = url.searchParams;
  if (searchParams.toString()) {
    target += '?' + searchParams.toString();
  }
  target = target.replace('admin_token=gugu2026', `admin_token=${VPS_ADMIN_PW}`);
  target = target.replace('admin_token=gugu-admin-2026', `admin_token=${VPS_ADMIN_PW}`);

  try {
    const method = req.method;
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip') || 'unknown';

    const fetchHeaders: Record<string, string> = {
      'X-Forwarded-For': clientIp,
      'X-Real-IP': clientIp,
    };

    // Always add admin token for backend auth
    fetchHeaders['X-Admin-Token'] = VPS_ADMIN_PW;

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: AbortSignal.timeout(60000), // 60s for crawl requests
    };

    // POST body
    if (method === 'POST') {
      if (req.headers.get('content-type')?.includes('application/json')) {
        fetchHeaders['Content-Type'] = 'application/json';
        fetchOptions.body = await req.text();
      }
    }

    const response = await fetch(target, fetchOptions);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { detail: '서버 연결 오류', error: String(error) },
      { status: 500 }
    );
  }
}

export const GET = proxyToVps;
export const POST = proxyToVps;
