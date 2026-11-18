// GitHub 저장소 메타데이터를 서버에서 가져온다.
// 페이지는 ISR(revalidate 3600)로 갱신되므로, 커밋 수를 손으로 적지 않아도 된다.

function parseRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (!match) return null
  return { owner: match[1], repo: match[2] }
}

/**
 * 저장소 전체 커밋 수. GitHub 은 총 개수를 주지 않으므로 Link 헤더의 마지막 page 를 쓴다
 * (per_page=1 이면 마지막 page 번호 == 커밋 수).
 * 실패하면 null 을 돌려주고 호출부가 기존 값을 유지한다 — 숫자 하나 때문에 빌드가 깨지면 안 된다.
 */
export async function getRepoCommitCount(repoUrl: string): Promise<number | null> {
  const parsed = parseRepo(repoUrl)
  if (!parsed) return null

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
      {
        headers: {
          'User-Agent': 'portfolio.olivilo.shop',
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!res.ok) return null

    const link = res.headers.get('link')
    const last = link?.match(/[?&]page=(\d+)>;\s*rel="last"/)
    if (last) return Number(last[1])

    // 커밋이 1개뿐이면 Link 헤더가 없다
    const body = await res.json()
    return Array.isArray(body) ? body.length : null
  } catch {
    return null
  }
}
