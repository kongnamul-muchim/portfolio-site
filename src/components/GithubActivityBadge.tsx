'use client';

import { useState, useEffect } from 'react';

interface ActivityData {
  lastUpdate: string | null;
  ago: string;
  days: number;
}

const MAX_DAYS = 30;

export default function GithubActivityBadge({ repo }: { repo: string }) {
  const [data, setData] = useState<ActivityData | null>(null);

  useEffect(() => {
    fetch(`/api/github/activity?repo=${encodeURIComponent(repo)}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, [repo]);

  // 30일 넘은 프로젝트는 badge 숨김 (완성된 게임은 오래돼도 정상)
  if (!data || !data.lastUpdate || data.days > MAX_DAYS) return null;

  // 커밋 메시지는 노출하지 않는다 — 방문자에게 의미 없는 내부 작업 문구가
  // 그대로 보이면 오해를 만들 수 있어서, 마지막 활동 시점만 보여준다.
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-[#9CA3AF] mb-3">
      <span className="shrink-0">🔄</span>
      <span className="truncate">최근 커밋 {data.ago}</span>
    </div>
  );
}
