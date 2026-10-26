// 이 세그먼트는 ?id= 쿼리로 글을 조회하므로 요청 시점 렌더가 필요합니다.
// (정적 프리렌더 시 useSearchParams 가 Suspense 경계를 요구해 빌드가 실패함)
export const dynamic = 'force-dynamic'

export default function CommunitySegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
