
import { NextRequest, NextResponse } from 'next/server'

const CACHE_TTL = 3600_000 // 1시간
const cache = new Map<string, { data: unknown; expiry: number }>()

function parseRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export async function GET(req: NextRequest) {
  const repoUrl = req.nextUrl.searchParams.get('repo');
  if (!repoUrl) return NextResponse.json({ error: 'missing repo' }, { status: 400 });

  const parsed = parseRepo(repoUrl);
  if (!parsed) return NextResponse.json({ error: 'invalid repo url' }, { status: 400 });

  const cacheKey = `${parsed.owner}/${parsed.repo}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
      {
        headers: {
          'User-Agent': 'portfolio.olivilo.shop',
          // 익명 호출은 IP당 60회/시 → 서버 공용 IP 가 금방 소진된다.
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) {
      // API rate limit 등 에러 시 캐시된 데이터 있으면 반환
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ lastUpdate: null, days: 999 }, { status: 200 });
    }
    const commits = await res.json();
    if (!Array.isArray(commits) || commits.length === 0) {
      return NextResponse.json({ ago: null, days: 999 });
    }

    const commit = commits[0];
    const date = new Date(commit.commit?.author?.date || Date.now());
    const now = Date.now();
    const diff = now - date.getTime();
    const ago = diff < 60000 ? '방금 전'
      : diff < 3600000 ? `${Math.floor(diff / 60000)}분 전`
      : diff < 86400000 ? `${Math.floor(diff / 3600000)}시간 전`
      : `${Math.floor(diff / 86400000)}일 전`;

    // 커밋 메시지는 외부에 내보내지 않는다 — 활동 시점만 노출.
    const result = { ago, days: Math.floor(diff / 86400000) };
    cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
    return NextResponse.json(result);
  } catch {
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json({ ago: null, days: 999 });
  }
}
