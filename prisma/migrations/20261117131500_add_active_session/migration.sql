-- 단일 세션: 로그인할 때마다 새 식별자로 교체되는 컬럼
ALTER TABLE "User" ADD COLUMN "activeSession" TEXT;
