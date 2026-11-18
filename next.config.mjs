/** @type {import('next').NextConfig} */
// X-Frame-Options / X-Content-Type-Options / Referrer-Policy / HSTS 는 nginx(global/security.conf)가 붙인다.
// 여기서 또 붙이면 응답 헤더가 2중으로 나가므로 앱에서만 줄 수 있는 것(CSP·Permissions-Policy)만 둔다.
const securityHeaders = [
  // 카메라·마이크·위치 등 브라우저 기능 차단
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // 외부 스크립트 주입 차단. Next.js 가 인라인 스크립트를 쓰므로 'unsafe-inline' 은 필요하다.
  // 'unsafe-eval' 은 개발 모드에서만 필요하므로 운영 CSP 에서는 뺀다.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
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
