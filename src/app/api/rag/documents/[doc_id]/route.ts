import { NextRequest, NextResponse } from 'next/server';

const VPS_API = 'http://45.59.101.155:8000/api';
const VPS_ADMIN_PW = 'gugu-admin-2026';
const NEW_PW = 'gugu2026';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { doc_id: string } }
) {
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
