'use client'

import { useState, useEffect } from 'react'

const TOGGLES = [
  { id: 'gradient-hero', label: '🌈 그라디언트 배경', desc: '히어로에 움직이는 Aurora 그라디언트' },
  { id: 'glass-cards', label: '🪟 글래스모피즘', desc: '프로젝트 카드를 유리 효과로' },
  { id: 'scroll-anim', label: '✨ 스크롤 모션', desc: '섹션이 fade-up으로 등장' },
  { id: 'color-accent', label: '🎨 컬러 테마', desc: '시안→퍼플/핑크 그라데이션' },
  { id: 'tilt-hover', label: '🔄 3D 호버', desc: '카드가 마우스 따라 기울기' },
]

const STORAGE_KEY = 'portfolio-design-toggles'

export default function DesignToggle() {
  const [open, setOpen] = useState(false)
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setToggles(parsed)
        // Apply saved classes
        Object.entries(parsed).forEach(([id, enabled]) => {
          if (enabled) document.documentElement.classList.add(`design-${id}`)
        })
      }
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = { ...toggles, [id]: !toggles[id] }
    setToggles(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

    if (next[id]) {
      document.documentElement.classList.add(`design-${id}`)
    } else {
      document.documentElement.classList.remove(`design-${id}`)
    }
  }

  const resetAll = () => {
    TOGGLES.forEach(t => {
      document.documentElement.classList.remove(`design-${t.id}`)
    })
    setToggles({})
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!mounted) return null

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-white dark:bg-[#1F2937] border border-r-0 border-gray-200 dark:border-[#374151] rounded-l-xl px-2 py-4 shadow-lg hover:shadow-xl transition-all group"
        aria-label="디자인 설정"
      >
        <span className="block text-lg group-hover:scale-110 transition-transform">🎨</span>
        {Object.values(toggles).filter(Boolean).length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#22D3EE] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {Object.values(toggles).filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 mr-14">
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl shadow-2xl p-4 w-64">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E5E7EB]">
                  🎨 디자인 설정
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {TOGGLES.map(t => (
                  <label
                    key={t.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={!!toggles[t.id]}
                        onChange={() => toggle(t.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-[#22D3EE] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 dark:text-[#E5E7EB]">
                        {t.label}
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500">
                        {t.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {Object.values(toggles).filter(Boolean).length > 0 && (
                <button
                  onClick={resetAll}
                  className="w-full mt-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border-t border-gray-100 dark:border-gray-800 pt-3 transition-colors"
                >
                  모두 초기화
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
