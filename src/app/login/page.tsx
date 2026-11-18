'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const notice = searchParams?.get('notice')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', { nickname, password, redirect: false })

    setLoading(false)

    if (result?.error) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } else {
      // 이 기기에서 로그인했으므로 다른 기기는 로그아웃된다 — 다음 화면에서 안내
      try {
        sessionStorage.setItem('site_notice', '다른 기기가 로그인되어 있어 기존 기기를 로그아웃시켰습니다.')
      } catch {}
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</Link>
          <p className="text-gray-500 dark:text-gray-400 mt-2">로그인하여 시작하세요</p>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">로그인</h1>

          {/* 가입 장벽 제거 — 데모 계정을 바로 채워준다 */}
          <div className="mb-5 rounded-lg border border-gray-200 dark:border-[#1F2937] bg-gray-50 dark:bg-gray-800/40 p-3 text-xs leading-relaxed text-gray-600 dark:text-[#9CA3AF]">
            가입 없이 둘러보시려면 데모 계정을 쓰세요.{' '}
            <strong className="text-gray-800 dark:text-[#E5E7EB]">demo / demo1234!</strong>{' '}
            <button
              type="button"
              onClick={() => { setNickname('demo'); setPassword('demo1234!'); setError('') }}
              className="underline font-medium text-[#0E7490] dark:text-[#22D3EE] hover:no-underline"
            >
              자동 입력
            </button>
          </div>

          {notice === 'replaced' && (
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-3 rounded-lg mb-4">
              다른 기기에서 로그인하여 로그아웃되었습니다.
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form method="post" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                아이디 (닉네임)
              </label>
              <input
                id="login-nickname"
                name="nickname"
                type="text"
                autoComplete="username"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input-field"
                placeholder="가입할 때 정한 닉네임"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                회원가입
              </Link>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              비밀번호를 잊으셨다면 관리자에게 문의해주세요.{' '}
              <a href="mailto:rlaehdduf04@gmail.com" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                메일 보내기
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
