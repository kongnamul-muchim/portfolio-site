// 앞단 별칭(alias) 비밀번호.
// 실제 백엔드 토큰(ADMIN_TOKEN)과 다른 값이며, 저장소에 하드코딩하지 않고 환경변수로만 주입한다.
// 미설정 시 빈 문자열 → 어떤 입력과도 일치하지 않으므로 관리자 로그인이 잠긴다(안전한 기본값).
export const ADMIN_ALIAS_PW = process.env.RAG_ADMIN_PW ?? ''

export function isAdminAlias(value: unknown): boolean {
  return ADMIN_ALIAS_PW.length > 0 && value === ADMIN_ALIAS_PW
}
