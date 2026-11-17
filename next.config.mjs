/** @type {import('next').NextConfig} */
const securityHeaders = [
  // 클릭재킹 방지 — 이 사이트를 다른 사이트가 프레임에 넣지 못하게
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // 브라우저가 Content-Type 을 멋대로 해석하지 않게 (XSS 완화)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 카메라·마이크·위치 등 브라우저 기능 차단
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // 외부 스크립트 주입 차단. Next.js 가 인라인 스크립트를 쓰므로 'unsafe-inline' 은 필요하다.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  // Next 16 부터 빌드 시 린트는 실행되지 않는다(별도 `npm run lint`).
  // 타입 오류는 여전히 배포를 멈춘다.
  typescript: {
    ignoreBuildErrors: false
  },
  // 서버 종류를 광고하지 않음
  poweredByHeader: false,
  async headers() {
    const noStore = { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      { source: '/projects/:path*', headers: [noStore] },
      { source: '/play/:path*', headers: [noStore] },
      { source: '/', headers: [noStore] },
    ]
  }
};

export default nextConfig;
