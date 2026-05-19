import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';

export async function POST(req: NextRequest) {
  try {
    const bodyBuffer = await req.arrayBuffer();
    const contentType = req.headers.get('content-type') || '';

    const response = await fetch(`${VPS_API}/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: bodyBuffer,
      signal: AbortSignal.timeout(30000),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: '업로드 프록시 오류', error: String(error) },
      { status: 500 }
    );
  }
}
