type Author = { nickname: string; displayName?: string | null }

/** 화면에 보여줄 이름: 표시 이름이 있으면 그것, 없으면 로그인 아이디 */
export function shownName(author?: Author | null): string {
  if (!author) return '알 수 없음'
  return author.displayName || author.nickname
}

/**
 * author.nickname 을 표시 이름으로 바꿔서 돌려준다.
 * 화면 코드는 지금처럼 author.nickname 을 그대로 쓰면 되고,
 * 로그인 아이디는 DB 에만 남는다.
 */
export function withShownAuthor<T extends { author?: Author | null }>(row: T): T {
  if (!row.author) return row
  return { ...row, author: { ...row.author, nickname: shownName(row.author) } } as T
}
