import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const VPS_API = 'http://aichat:8000/api';
const VPS_ADMIN_PW = process.env.ADMIN_TOKEN || '';
const NEW_PW = 'gugu2026';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { doc_id: string } }
) {
  // Check admin auth via JWT token
  const token = await getToken({ req: _req });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  try {
    const adminToken = _req.headers.get('X-Admin-Token') || '';
    const vpsToken = adminToken === NEW_PW ? VPS_ADMIN_PW : adminToken;

    const url = `${VPS_API}/documents/${params.doc_id}?admin_token=${vpsToken}`;
    const response = await fetch(url, { method: 'DELETE' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: '삭제 프록시 오류', error: String(error) },
      { status: 500 }
    );
  }
}
