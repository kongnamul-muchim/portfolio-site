import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';
const VPS_ADMIN_PW = 'gugu-admin-2026';

/**
 * CRM API proxy — forwards all methods to VPS backend.
 * Matches /api/crm, /api/crm/stats, /api/crm/123, etc.
 */
async function proxyToVps(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const path = slug ? slug.join('/') : '';
  const url = new URL(req.url);

  // Build VPS target URL
  let target = `${VPS_API}/crm${path ? '/' + path : ''}`;
  
  // Copy query params (including admin_token)
  const searchParams = url.searchParams;
  if (searchParams.toString()) {
    target += '?' + searchParams.toString();
  }

  // Translate admin_token: gugu2026 → gugu-admin-2026
  target = target.replace('admin_token=gugu2026', `admin_token=${VPS_ADMIN_PW}`);

  try {
    const method = req.method;
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip') || 'unknown';

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'X-Forwarded-For': clientIp,
        'X-Real-IP': clientIp,
      },
      signal: AbortSignal.timeout(30000),
    };

    // Attach body for POST/PATCH
    if (method === 'POST' || method === 'PATCH') {
      const body = await req.json();
      // Translate admin_token in body
      if (body.admin_token === 'gugu2026') {
        body.admin_token = VPS_ADMIN_PW;
      }
      fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(body);
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
export const PATCH = proxyToVps;
export const DELETE = proxyToVps;
