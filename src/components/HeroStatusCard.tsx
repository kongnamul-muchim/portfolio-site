'use client'

import { useEffect, useState } from 'react'
import { projects } from '@/data/projects'

type Activity = { ago: string; days: number } | null

const TRACKED = ['portfolio-site', 'autoflow']

export default function HeroStatusCard() {
  const [activity, setActivity] = useState<Record<string, Activity>>({})

  useEffect(() => {
    let cancelled = false
    TRACKED.forEach((id) => {
      const project = projects.find((p) => p.id === id)
      if (!project?.github) return
      fetch(`/api/github/activity?repo=${encodeURIComponent(project.github)}`)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return
          if (d?.ago && d.days <= 30) {
            setActivity((prev) => ({ ...prev, [id]: { ago: d.ago, days: d.days } }))
          }
        })
        .catch(() => {})
    })
    return () => {
      cancelled = true
    }
  }, [])

  const total = projects.length
  const unity = projects.filter((p) => p.type === 'unity').length
  const web = projects.filter((p) => p.type === 'web').length
  const server = projects.filter((p) => p.type === 'server').length

  const rows = TRACKED.map((id) => ({
    name: projects.find((p) => p.id === id)?.title?.split(' (')[0] ?? id,
    ago: activity[id]?.ago ?? null,
  })).filter((row) => row.ago)

  return (
    <aside className="hero-status" aria-label="사이트 현황">
      <div className="hero-status-head">
        <span className="hero-status-label">이 사이트, 직접 운영 중</span>
        <span className="hero-status-live">
          <i aria-hidden="true" />
          정상
        </span>
      </div>

      <div className="hero-status-big">
        <span className="num">{total}</span>
        <span className="cap">공개 프로젝트</span>
      </div>

      <div className="hero-status-split">
        <div>
          <b>{unity}</b>
          <span>Unity</span>
        </div>
        <div>
          <b>{web}</b>
          <span>Web</span>
        </div>
        <div>
          <b>{server}</b>
          <span>Server</span>
        </div>
      </div>

      {rows.length > 0 && (
        <ul className="hero-status-commits">
          {rows.map((row) => (
            <li key={row.name}>
              <span>{row.name}</span>
              <span>최근 커밋 {row.ago}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="hero-status-foot">5분마다 자동 점검 · 보안 감사 3층 운영</p>
    </aside>
  )
}
