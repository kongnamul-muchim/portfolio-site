import { getValidToken } from '@/lib/auth/valid-token'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 컨테이너 네트워크 안의 aichat 서비스로 보낸다 (호스트 포트 노출 불필요)
const VPS_API = 'http://aichat:8000/api';

export async function POST(req: NextRequest) {
  // 관리자만 문서를 넣을 수 있다 — 지식베이스는 답변 내용을 바꾸는 권한이다
  const token = await getValidToken(req);
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

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
  } catch {
    return NextResponse.json({ detail: '업로드 프록시 오류' }, { status: 502 });
  }
}
