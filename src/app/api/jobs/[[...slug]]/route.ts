import { getValidToken } from '@/lib/auth/valid-token'
import { ADMIN_ALIAS_PW } from '@/lib/auth/admin-alias'
import { getClientIp } from '@/lib/client-ip'
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
  const token = await getValidToken(req);
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
  if (ADMIN_ALIAS_PW) {
    target = target.replace(`admin_token=${ADMIN_ALIAS_PW}`, `admin_token=${VPS_ADMIN_PW}`);
  }
  target = target.replace('admin_token=gugu-admin-2026', `admin_token=${VPS_ADMIN_PW}`);

  try {
    const method = req.method;
    // XFF 첫 값은 클라이언트가 임의로 넣을 수 있다. x-real-ip(프록시가 덮어쓴 값)만 신뢰한다.
    const clientIp = getClientIp(req);

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
  } catch (error) {
    return NextResponse.json(
      { detail: '서버 연결 오류', error: String(error) },
      { status: 500 }
    );
  }
}

export const GET = proxyToVps;
export const POST = proxyToVps;
