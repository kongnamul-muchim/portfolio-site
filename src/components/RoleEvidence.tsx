import type { Project } from '@/data/projects'

/**
 * 프로젝트 상세의 "판단 과정" 블록.
 * 문제 → 내 결정 → 검증 숫자 → 한계 순서로만 보여준다.
 * (기능 나열은 카드 설명이 이미 하므로 여기서 반복하지 않는다)
 */
export default function RoleEvidence({ project }: { project: Project }) {
  const hasAny =
    !!project.problem ||
    (project.decisions?.length ?? 0) > 0 ||
    (project.evidence?.length ?? 0) > 0 ||
    (project.limits?.length ?? 0) > 0

  if (!hasAny) return null

  return (
    <section className="evidence-block mb-6">
      {/* 1. 문제 */}
      {project.problem && (
        <div className="ev-problem">
          <p className="ev-label">왜 만들었나</p>
          <p className="ev-problem-text">{project.problem}</p>
        </div>
      )}

      {/* 2. 결정 */}
      {(project.decisions?.length ?? 0) > 0 && (
        <div className="ev-section">
          <p className="ev-label">내가 내린 결정</p>
          <ol className="ev-decisions">
            {project.decisions!.map((d, i) => (
              <li key={i} className="ev-decision">
                <div className="ev-decision-q">
                  <span className="ev-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{d.q}</span>
                </div>
                <p className="ev-decision-chose">{d.chose}</p>
                <p className="ev-decision-why">{d.why}</p>
                {d.alt && <p className="ev-decision-alt">버린 대안 — {d.alt}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 3. 검증 숫자 */}
      {(project.evidence?.length ?? 0) > 0 && (
        <div className="ev-section">
          <p className="ev-label">검증한 숫자</p>
          <dl className="ev-stats">
            {project.evidence!.map((e) => (
              <div key={e.label} className="ev-stat">
                <dt className="ev-stat-label">{e.label}</dt>
                <dd className="ev-stat-value">{e.value}</dd>
                {e.note && <dd className="ev-stat-note">{e.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* 4. 한계 */}
      {(project.limits?.length ?? 0) > 0 && (
        <div className="ev-section">
          <p className="ev-label">한계 — 먼저 말하는 편이 낫다고 생각한 것</p>
          <ul className="ev-limits">
            {project.limits!.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
