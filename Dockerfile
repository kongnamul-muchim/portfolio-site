# ──────────────────────────────────────────────
# Dockerfile - Portfolio (Next.js)
# ──────────────────────────────────────────────
FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# package 설치 (캐싱)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사
COPY . .

# Prisma client 생성 + Next.js 빌드 (migration은 runtime에서)
# Next 16 부터 빌드 중에도 DATABASE_URL 을 참조하는 코드가 평가될 수 있다.
# 빌드 시점에는 DB 에 붙지 않으므로 형식만 맞는 자리표시자를 넣는다.
# (실제 값은 docker run --env-file 로 덮어쓴다)
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"
RUN npx prisma generate && npx next build

# entrypoint: migration → app 실행
RUN printf '#!/bin/sh\n\
cd /app\n\
npx prisma migrate deploy 2>/dev/null || true\n\
exec npm start\n' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
