import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default [
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/uploads/**', 'next-env.d.ts'],
  },
  {
    rules: {
      // React 19 린트가 새로 추가한 "효과 안에서 setState 동기 호출" 경고.
      // 이 사이트는 테마/토스트처럼 브라우저 상태(DOM·localStorage)를 읽어
      // 마운트 후 한 번 맞추는 패턴을 쓰고 있어 위반이 정상 동작이다.
      // 성능 제안 성격이므로 에러가 아니라 경고로 둔다.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]
