import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${VPS_API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  const adminToken = req.nextUrl.searchParams.get('admin_token');
  try {
    const url = adminToken
      ? `${VPS_API}/rate-limit?admin_token=${adminToken}`
      : `${VPS_API}/rate-limit`;
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { remaining: 0, limit: 10, is_admin: false },
      { status: 200 }
    );
  }
}
