-- 로그인 아이디(nickname)와 화면 표시 이름(displayName) 분리
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;
