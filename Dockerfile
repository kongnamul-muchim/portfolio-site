# ──────────────────────────────────────────────
# Dockerfile - Portfolio (Next.js)
# ──────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# package 설치 (캐싱)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사
COPY . .

# Prisma client 생성 + Next.js 빌드 (migration은 runtime에서)
RUN npx prisma generate && npx next build

# entrypoint: migration → app 실행
RUN printf '#!/bin/sh\n\
cd /app\n\
npx prisma migrate deploy 2>/dev/null || true\n\
exec npm start\n' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
