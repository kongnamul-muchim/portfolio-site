# 서버 보안 설정 메모

2026-11-17 작업 기준. 코드가 아니라 **서버 설정**이라 저장소에 함께 남겨둔다.
서버를 다시 세팅할 때 이 순서대로 적용하면 같은 구멍이 다시 열리지 않는다.

## 1. 실제 방문자 IP 복원 (nginx)

파일: `/etc/nginx/conf.d/10-cloudflare-realip.conf`

```nginx
set_real_ip_from <Cloudflare 대역들>;
real_ip_header CF-Connecting-IP;
real_ip_recursive on;
```

대역 목록은 `https://www.cloudflare.com/ips-v4`, `/ips-v6` 에서 받아 채운다.
`real_ip` 모듈은 **신뢰 대역에서 온 연결의 헤더만** 인정하므로, Cloudflare 를 거치지
않고 오리진에 직접 붙은 연결은 헤더를 위조해도 무시된다.

이 설정이 없으면 nginx 의 `$remote_addr` 가 Cloudflare 엣지 IP 가 되어 방문자별
제한(로그인 시도 제한, 챗 일일 한도)이 사실상 하나의 버킷으로 뭉친다.

## 2. 애플리케이션의 IP 판별

`src/lib/client-ip.ts` — `x-real-ip` → `cf-connecting-ip` → `x-forwarded-for` 의
**마지막** 값 순으로만 신뢰한다. `x-forwarded-for` 의 첫 값은 클라이언트가 넣을 수
있어서 절대 쓰면 안 된다(쓰면 요청마다 값을 바꿔 제한을 우회할 수 있다).

## 3. 80/443 을 Cloudflare 대역만 허용 (ufw)

`/root/scripts/cf_only_firewall.sh` 참고.

```bash
ufw allow from <cf 대역> to any port 80 proto tcp
ufw allow from <cf 대역> to any port 443 proto tcp
ufw --force delete allow 80/tcp
ufw --force delete allow 443/tcp
ufw reload
```

효과: 오리진 IP 로 직접 붙어 `Host:` 헤더를 위조해도 연결 자체가 막힌다.
WAF·해외 차단·fail2ban 을 전부 건너뛰던 경로가 사라진다.

검증은 **외부 시점**에서 해야 한다. 서버 자기 자신에서 공인 IP 로 접속하면
루프백으로 처리되어 차단 여부가 드러나지 않는다.

## 4. 관리자 토큰

- 값은 `/root/secrets/aichat.env` 의 `ADMIN_PASSWORD`, `/root/backup/prod.env.bak` 와
  `/tmp/portfolio-test.env` 의 `ADMIN_TOKEN` 세 곳에 있어야 하고 **모두 같아야** 한다.
- 교체: `/root/scripts/rotate_admin_token.sh`
- 토큰은 절대 URL 쿼리로 보내지 않는다. `X-Admin-Token` 헤더만 쓴다.

## 5. aichat 컨테이너

`--network host` + `--env-file /root/secrets/aichat.env` 로 뜬다. 재생성할 때 빼먹으면
DB/발키 접속이 깨진다(예전에는 `host.docker.internal` 이 필요했고, 지금은
`/root/secrets/aichat.env` 의 `PG_HOST`/`VALKEY_HOST` 가 `127.0.0.1` 이다).

```bash
docker build -t aichat:latest /root/rag-api
docker rm -f aichat
docker run -d --name aichat --network host --add-host host.docker.internal:host-gateway \
  --env-file /root/secrets/aichat.env --restart unless-stopped aichat:latest
```

## 6. 세션

`valid-session.ts`(Pages Router) / `valid-token.ts`(App Router) 가
`User.activeSession` 과 토큰 `sid` 를 비교한다. 새 라우트를 추가할 때
`getServerSession` / `getToken` 을 직접 쓰지 말고 이 두 헬퍼를 쓴다.
