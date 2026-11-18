// 클라이언트 IP 추출 — 위조 불가능한 값만 신뢰한다.
//
// 배경: 예전 코드는 `x-forwarded-for` 의 **첫 번째** 값을 그대로 썼다.
// XFF 는 클라이언트가 임의로 넣을 수 있고 nginx 는 뒤에 실제 IP 를 덧붙이기만 하므로,
// 공격자가 매 요청마다 XFF 를 바꾸면 IP 기반 제한(로그인 시도 제한, 채팅 일일 한도)을
// 전부 우회할 수 있었다(실제로 재현됨).
//
// 우선순위:
//   1) x-real-ip      — nginx 가 `$remote_addr` 로 덮어쓴다. 클라이언트 값은 무시된다.
//                       (nginx 에 Cloudflare real_ip 설정을 넣어 $remote_addr 가 실제 방문자 IP 가 된다)
//   2) cf-connecting-ip — Cloudflare 가 설정하는 헤더. 오리진 직접 접근 시에는 위조 가능하므로
//                       1) 이 없을 때만 사용한다.
//   3) 없음 → 'unknown'
//      x-forwarded-for 는 **쓰지 않는다**. 프록시를 거치지 않은 요청(직접 포트 접근)에서는
//      그 헤더가 전부 클라이언트 값이라 위조가 가능하고, 프록시 경유 여부를 앱이 구분할 방법이 없다.
//      (2026-11-18 재현: 3007 직접 포트에 XFF 3종 → 방문자 0→3. 프록시를 거치면 막히지만
//       nginx 설정이 바뀌는 순간 다시 뚫리므로 신뢰 근거를 x-real-ip 하나로 좁힌다)
export function getClientIp(req: Request): string {
  const realIp = req.headers.get('x-real-ip')
  if (realIp && realIp.trim()) return realIp.trim()

  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp && cfIp.trim()) return cfIp.trim()

  return 'unknown'
}
