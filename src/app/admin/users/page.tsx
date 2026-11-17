'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface User {
  id: string
  nickname: string
  email: string
  role: string
  profileImage: string | null
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
    comments: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [resetResult, setResetResult] = useState<{ nickname: string; tempPassword: string } | null>(null)
  const fetchId = useRef(0)

  const fetchUsers = useCallback(async () => {
    const id = ++fetchId.current
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users/list')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '권한 없음')
      }
      const data = await res.json()
      if (id === fetchId.current) {
        setUsers(data)
      }
    } catch (e) {
      if (id === fetchId.current) {
        setError(e instanceof Error ? e.message : String(e))
      }
    } finally {
      if (id === fetchId.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter(u =>
    !search ||
    u.nickname.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleResetPassword = async (user: User) => {
    const ok = window.confirm(
      `${user.nickname} 님의 비밀번호를 임시 비밀번호로 초기화할까요?\n\n· 새 비밀번호가 화면에 한 번만 표시됩니다\n· 이 계정의 로그인 세션은 모두 종료됩니다`
    )
    if (!ok) return

    setError('')
    const res = await fetch(`/api/admin/users/${user.id}/reset-password`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || '비밀번호 초기화에 실패했습니다.')
      return
    }
    setResetResult({ nickname: data.nickname, tempPassword: data.tempPassword })
  }

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    member: users.filter(u => u.role === 'member').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E] text-gray-900 dark:text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          👥 가입자 관리
          <span className="text-sm font-normal text-gray-500 dark:text-[#9CA3AF]">
            (Admin Only)
          </span>
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
            <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">전체 가입자</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
            <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">관리자</div>
            <div className="text-2xl font-bold text-purple-500">{stats.admin}</div>
          </div>
          <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-gray-200 dark:border-[#374151]">
            <div className="text-sm text-gray-500 dark:text-[#9CA3AF]">일반 회원</div>
            <div className="text-2xl font-bold text-blue-400">{stats.member}</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 닉네임 또는 이메일 검색"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
          />
        </div>

        {/* 임시 비밀번호 발급 결과 — 한 번만 보여준다 */}
        {resetResult && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4 mb-6">
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
              🔑 {resetResult.nickname} 님의 임시 비밀번호
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#111827] border border-amber-300 dark:border-amber-700 font-mono text-base select-all">
                {resetResult.tempPassword}
              </code>
              <button
                onClick={() => navigator.clipboard?.writeText(resetResult.tempPassword)}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
              >
                복사
              </button>
              <button
                onClick={() => setResetResult(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-amber-400 text-amber-800 dark:text-amber-300"
              >
                닫기
              </button>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              창을 닫으면 다시 볼 수 없습니다. 본인에게 전달하고, 로그인 후 비밀번호를 바꾸도록 안내하세요.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-200 dark:border-red-800">
            ❌ {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-[#374151] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#111827] border-b border-gray-200 dark:border-[#374151]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">닉네임</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden md:table-cell">이메일</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">등급</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden lg:table-cell">게시글</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF] hidden lg:table-cell">댓글</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">가입일</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-[#9CA3AF]">관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">로딩 중...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">검색 결과가 없습니다</td></tr>
                ) : filtered.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#111827]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                          {user.nickname.charAt(0)}
                        </div>
                        <span className="font-medium">{user.nickname}</span>
                        {user.nickname === 'GuGu' && (
                          <span className="text-xs text-cyan-500">👑</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 dark:text-[#9CA3AF]">
                      {user.email?.includes('@local.port') ? (
                        <span className="text-gray-400 text-xs">—</span>
                      ) : user.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {user.role === 'admin' ? '관리자' : '일반'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-500 dark:text-[#9CA3AF]">
                      {user._count.posts}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-500 dark:text-[#9CA3AF]">
                      {user._count.comments}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9CA3AF] text-xs">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 dark:border-[#4B5563] text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors"
                        title="임시 비밀번호 발급"
                      >
                        🔑 초기화
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 dark:text-[#6B7280] text-center">
          총 {filtered.length}명 {search ? `(검색 결과)` : ''}
        </div>
      </div>
    </div>
  )
}
