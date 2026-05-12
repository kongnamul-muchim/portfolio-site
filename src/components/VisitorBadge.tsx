'use client'

import { useEffect, useState } from 'react'

export default function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // 방문 기록 POST
    fetch('/api/visitors', { method: 'POST' })
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(null))

    // 60초마다 갱신
    const interval = setInterval(() => {
      fetch('/api/visitors')
        .then(res => res.json())
        .then(data => setCount(data.count))
        .catch(() => {})
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-gray-500 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937] bg-white dark:bg-[#111827]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="font-medium">{count.toLocaleString()}</span>
      <span className="hidden sm:inline">today</span>
    </div>
  )
}
