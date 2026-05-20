'use client'

import { useState, useEffect, useCallback } from 'react'

interface JobPosting {
  id: number
  source: string
  title: string
  company: string
  url: string
  location: string
  experience: string
  education: string
  employment_type: string
  skills: string[]
  deadline: string
  match_score: number
  is_active: number
  created_at: string
}

interface Stats {
  total: number
  active: number
  by_source: Record<string, number>
}

const ADMIN_TOKEN = 'gugu-admin-2026'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [crawling, setCrawling] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [regions, setRegions] = useState<{name: string, count: number}[]>([])
  const [sort, setSort] = useState('newest')
  const [keyword, setKeyword] = useState('backend')
  const [total, setTotal] = useState(0)
  const [msg, setMsg] = useState('')

  const limit = 20

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/jobs?admin_token=${ADMIN_TOKEN}&page=${page}&limit=${limit}&sort=${sort}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (sourceFilter) url += `&source=${sourceFilter}`
      if (locationFilter) url += `&location=${encodeURIComponent(locationFilter)}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        setJobs(data.items || [])
        setTotal(data.total || 0)
      }
    } finally {
      setLoading(false)
    }
  }, [page, search, sourceFilter, locationFilter, sort])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/jobs/stats?admin_token=${ADMIN_TOKEN}`)
      if (res.ok) {
        setStats(await res.json())
      }
    } catch {}
    // Also fetch regions for location filter
    try {
      const res = await fetch(`/api/jobs/locations?admin_token=${ADMIN_TOKEN}`)
      if (res.ok) {
        const data = await res.json()
        setRegions(data.regions || [])
      }
    } catch {}
  }, [])

  useEffect(() => { fetchJobs(); fetchStats() }, [fetchJobs, fetchStats])

  const handleCrawl = async () => {
    setCrawling(true)
    setMsg('')
    try {
      let url = `/api/jobs/crawl?pages=2&admin_token=${ADMIN_TOKEN}`
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
      const res = await fetch(url, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        const parts = [`✅ 크롤링 완료! ${data.new}개 새 공고`]
        if (data.updated > 0) parts.push(`${data.updated}개 지역 업데이트`)
        parts.push(`${data.skipped}개 중복`)
        setMsg(parts.join(', '))
        fetchJobs()
        fetchStats()
      } else {
        setMsg(`❌ 오류: ${data.detail || '알 수 없는 오류'}`)
      }
    } catch (e: any) {
      setMsg(`❌ 오류: ${e.message}`)
    } finally {
      setCrawling(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E] text-gray-900 dark:text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📋 취업공고 매칭
          <span className="text-sm font-normal text-gray-500 dark:text-[#9CA3AF]">
            (Admin Only)
          </span>
        </h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
              <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">전체 공고</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
              <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">진행중</div>
              <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            </div>
            <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
              <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">잡코리아</div>
              <div className="text-2xl font-bold text-blue-400">{stats.by_source?.jobkorea || 0}</div>
            </div>
            <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
              <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">사람인</div>
              <div className="text-2xl font-bold text-orange-400">{stats.by_source?.saramin || 0}</div>
            </div>
          </div>
        )}

        {/* Crawl Controls */}
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151] mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="검색어 (비우면 스마트 크롤링)"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm flex-1 min-w-[150px]"
            />
            <button
              onClick={handleCrawl}
              disabled={crawling}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {crawling ? '🔄 크롤링 중...' : keyword ? '🕷️ 크롤링' : '🕷️ 스마트 크롤링'}
            </button>
            <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">
              {keyword ? `"${keyword}" 검색` : '내 스펙 기반 14개 키워드 자동'}
            </div>
          </div>
          {msg && (
            <div className="mt-3 text-sm">{msg}</div>
          )}
        </div>

        {/* Analyze Controls */}
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151] mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">🤖 DeepSeek 분석</span>
            <button
              onClick={async () => {
                setMsg('')
                try {
                  const res = await fetch(`/api/jobs/analyze?admin_token=${ADMIN_TOKEN}&limit=20`, { method: 'POST' })
                  const data = await res.json()
                  if (res.ok) setMsg(`✅ ${data.message}`)
                  else setMsg(`❌ 오류: ${data.detail || ''}`)
                  fetchJobs()
                  fetchStats()
                } catch (e: any) {
                  setMsg(`❌ ${e.message}`)
                }
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              🧠 미분석 공고 분석
            </button>
            <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">
              DeepSeek V4로 기술스택 추출 및 매칭 점수 계산
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="🔍 제목/회사 검색"
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm"
          />
          <select
            value={sourceFilter}
            onChange={e => { setSourceFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm"
          >
            <option value="">전체 사이트</option>
            <option value="jobkorea">잡코리아</option>
            <option value="saramin">사람인</option>
          </select>
          <select
            value={locationFilter}
            onChange={e => { setLocationFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm max-w-[140px]"
          >
            <option value="">전체 지역</option>
            {regions.map(r => (
              <option key={r.name} value={r.name}>{r.name} ({r.count})</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm"
          >
            <option value="newest">🕐 최신순</option>
            <option value="match">🏆 매칭순</option>
            <option value="location">📍 지역순</option>
          </select>
          <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">
            총 {total}건
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-[#374151] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#111827] border-b border-gray-200 dark:border-[#374151]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">출처</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">제목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden md:table-cell">회사</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden lg:table-cell">지역</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden lg:table-cell">경력</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">매칭</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">로딩 중...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">등록된 공고가 없습니다</td></tr>
                ) : jobs.map(job => (
                  <tr key={job.id} className="border-b border-gray-100 dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#111827]">
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        job.source === 'jobkorea'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {job.source === 'jobkorea' ? '잡코' : '사람인'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 dark:text-[#22D3EE] hover:underline line-clamp-1"
                      >
                        {job.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{job.company}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 dark:text-[#9CA3AF]">{job.location}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{job.experience}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              job.match_score >= 70 ? 'bg-green-500' :
                              job.match_score >= 40 ? 'bg-yellow-500' :
                              job.match_score > 0 ? 'bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            style={{ width: `${Math.min(job.match_score || 0, 100)}%` }}
                          />
                        </div>
                        <span className={`font-medium text-xs whitespace-nowrap ${
                          job.match_score >= 70 ? 'text-green-500' :
                          job.match_score >= 40 ? 'text-yellow-500' :
                          job.match_score > 0 ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          {job.match_score > 0 ? `${Math.round(job.match_score)}%` : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#374151] disabled:opacity-50 text-sm"
            >
              이전
            </button>
            <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#374151] disabled:opacity-50 text-sm"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
