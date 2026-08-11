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

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-[#6B7280] mb-3">
      <span className="shrink-0">🔄</span>
      <span className="truncate">{data.ago} · {data.lastUpdate}</span>
    </div>
  );
}
