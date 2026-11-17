# GuGu.dev — 포트폴리오 사이트

개인 포트폴리오 + 커뮤니티 + AI 문서 검색(RAG)을 한 서비스로 운영하는 사이트입니다.
Next.js App Router 기반이며, 실제로 VPS에서 Docker로 돌아갑니다.

- 운영: https://portfolio.olivilo.shop
- 문의: rlaehdduf04@gmail.com

## 구성

| 영역 | 내용 |
|---|---|
| 포트폴리오 | 프로젝트 목록/상세, 역할 근거, GitHub 최근 활동 배지 |
| 커뮤니티 | 게시글·댓글·반응·카테고리, NextAuth 로그인 |
| AI 채팅 | RAG 검색 API(`/api/rag`) 프록시. 문서 업로드·색인 |
| 관리자 | 지원 공고(CRM) 프록시, 사용자/문서 관리 |

## 기술 스택

- **프레임워크**: Next.js 14 (App Router) + Pages Router API 일부
- **언어**: TypeScript
- **DB**: PostgreSQL + Prisma
- **인증**: NextAuth (JWT 세션)
- **스타일**: Tailwind CSS
- **인프라**: Docker, nginx, Cloudflare

## 구조

```
src/
├── app/            # App Router 페이지 + API 라우트
│   ├── api/        # rag, crm, jobs, visitors, github
│   ├── projects/   # 포트폴리오 목록·상세
│   ├── community/  # 게시판
│   └── chat/       # AI 채팅
├── pages/api/      # 레거시 Pages Router API (posts, comments, reactions, upload)
├── components/     # UI 컴포넌트
├── lib/auth/       # 인증 유틸
├── services/       # 도메인 서비스 계층
└── data/           # 프로젝트 메타데이터
prisma/schema.prisma
```

## 로컬 실행

```bash
npm ci
cp .env.example .env   # 값 채우기
npx prisma generate
npm run dev            # http://localhost:3000
```

## 환경변수

| 키 | 용도 |
|---|---|
| `DATABASE_URL` | PostgreSQL 접속 문자열 |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | 세션 서명·콜백 주소 |
| `ADMIN_TOKEN` | 내부 RAG/CRM 백엔드 관리자 토큰 |
| `RAG_ADMIN_PW` | 관리자 화면에서 입력하는 앞단 별칭 비밀번호 (미설정 시 관리자 로그인 잠김) |

## 배포

```bash
docker build -t portfolio .
docker run -d -p 3001:3000 --env-file .env.production portfolio
```

운영은 테스트(3002) → 운영(3001) 순서로 확인 후 반영합니다.

## 검증

```bash
npx tsc --noEmit
npx next lint
npm run build
```

## AI 활용

이 저장소는 **구현을 AI 코딩 에이전트가 담당하고, 기획·요구사항 정의·검증을 직접 맡는** 방식으로 만들었습니다.

| 구분 | 내용 |
|---|---|
| 구현 | AI 코딩 에이전트 — 페이지·API 라우트·스타일 |
| 기획·요구사항 | 직접 — 무엇을 어떤 기준으로 만들지 정의 |
| 검증 | 배포 후 라우트별 응답 확인, `tsc --noEmit`, 런타임·관리자 동작 점검 |
| 기록 | 프로젝트별 `aiUsage` 필드, 상세 페이지의 `AI 활용` 항목 |

AI 제안을 거부한 지점도 `decisions`에 함께 적어 두었습니다. 숨기지 않고 범위를 밝히는 쪽을 택했습니다.

