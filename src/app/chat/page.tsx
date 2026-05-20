'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('luna_session_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('luna_session_id', id);
  return id;
}

interface UserProfile {
  name_override?: string;
  personality?: string;
  speech_style?: string;
  likes?: string;
  dislikes?: string;
  relationship?: string;
}

interface Character {
  id: number;
  name: string;
  title: string;
  personality: string;
  greeting_message: string;
  avatar_emoji: string;
}

interface ChatMsg {
  role: 'user' | 'bot';
  content: string;
  memories?: number;
}

interface EvalRow {
  chunk_size: number;
  top_k: number;
  avg_score: number;
  avg_time: number;
  total_time: number;
}

interface ModeCompareResult {
  question: string;
  num_results: number;
  avg_score: number;
  top_scores: number[];
  titles: string[];
}

interface ModeCompareData {
  modes_comparison: Record<string, {
    results: ModeCompareResult[];
    summary: { avg_num_results: number; overall_avg_score: number; questions_with_results: number };
  }>;
  winner: { mode: string; avg_score: number };
  parameters: { top_k: number };
}

const defaultProfile: UserProfile = {};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState({ remaining: 10, limit: 10, is_admin: false });
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memoryBar, setMemoryBar] = useState('💫 별빛 도서관에 오신 걸 환영합니다');
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getSessionId());

  // Settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [editName, setEditName] = useState('');
  const [editPersonality, setEditPersonality] = useState('');
  const [editSpeech, setEditSpeech] = useState('');
  const [editLikes, setEditLikes] = useState('');
  const [editDislikes, setEditDislikes] = useState('');
  const [editRelationship, setEditRelationship] = useState('');

  // Admin state
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPw, setLoginPw] = useState('');

  // RAG Evaluation state
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResults, setEvalResults] = useState<EvalRow[] | null>(null);
  const [evalBest, setEvalBest] = useState<{ params: { chunk_size: number; top_k: number }; score: number } | null>(null);
  const [evalDetail, setEvalDetail] = useState('');
  const [evalChunkSize, setEvalChunkSize] = useState('1000');
  const [evalTopK, setEvalTopK] = useState('5');

  // Search Mode Comparison state
  const [modeCompareLoading, setModeCompareLoading] = useState(false);
  const [modeCompareData, setModeCompareData] = useState<ModeCompareData | null>(null);
  const [modeTopK, setModeTopK] = useState('5');

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }, []);

  // Load saved profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('luna_user_profile');
      if (saved) {
        const p = JSON.parse(saved) as UserProfile;
        setProfile(p);
        setEditName(p.name_override || '');
        setEditPersonality(p.personality || '');
        setEditSpeech(p.speech_style || '');
        setEditLikes(p.likes || '');
        setEditDislikes(p.dislikes || '');
        setEditRelationship(p.relationship || '');
      }
    } catch {}
  }, []);

  // Check for saved admin token
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rag_admin_token');
      if (saved) setAdminToken(saved);
    } catch {}
  }, []);

  // Set default character
  useEffect(() => {
    setCharacter({
      id: 1,
      name: '루나',
      title: '🌙 별빛 도서관의 사서 — 기억을 엮는 큐레이터',
      personality: '부드럽고 따뜻한 성격의 AI 사서',
      greeting_message: '안녕하세요! 저는 별빛 도서관의 사서, 루나예요 🌙\n\n당신과의 대화를 하나하나 소중히 기억할게요.',
      avatar_emoji: '🌙',
    });
  }, []);

  // Load quota
  useEffect(() => {
    const headers: Record<string, string> = {};
    if (adminToken) {
      headers['x-admin-token'] = adminToken;
    }
    fetch('/api/rag')
      .then(r => r.json())
      .then(d => setQuota(d))
      .catch(() => showError('⚠️ 서버 연결 실패'));
  }, [adminToken, showError]);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setMemoryBar('🌙 기억을 찾는 중...');

    try {
      const body: Record<string, unknown> = {
        question: text,
        session_id: sessionId.current,
        character_id: 1,
      };

      if (adminToken) body.admin_token = adminToken;

      // Include user profile customization
      const activeProfile = Object.fromEntries(
        Object.entries(profile).filter(([_, v]) => v && v.length > 0)
      );
      if (Object.keys(activeProfile).length > 0) {
        body.user_profile = activeProfile;
      }

      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        const memories = data.memories_found || 0;
        setMessages(prev => [...prev, { role: 'bot', content: data.answer, memories }]);

        if (data.character) setCharacter(data.character);

        if (memories > 0) {
          setMemoryBar(`💫 ${memories}개의 기억을 떠올렸어요`);
        } else {
          setMemoryBar('💭 새로운 이야기를 듣는 중이에요');
        }

        if (!data.is_admin) {
          setQuota(prev => ({ ...prev, remaining: data.remaining_quota }));
        }
      } else {
        const errMsg = data.detail?.message || data.detail || '오류가 발생했습니다';
        setMessages(prev => [...prev, { role: 'bot', content: `❌ ${errMsg}` }]);
        setMemoryBar('💫 별빛 도서관에 오신 걸 환영합니다');
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '❌ 서버에 연결할 수 없습니다.' }]);
      setMemoryBar('💫 별빛 도서관에 오신 걸 환영합니다');
    } finally {
      setLoading(false);
    }
  };

  const charName = character?.name || '루나';
  const charEmoji = character?.avatar_emoji || '🌙';
  const charTitle = character?.title || '별빛 큐레이터';
  const greetingMsg = character?.greeting_message || '안녕하세요! 별빛 도서관의 사서예요 🌙';
  const displayName = profile.name_override || charName;

  // Settings handlers
  const openSettings = () => {
    setEditName(profile.name_override || '');
    setEditPersonality(profile.personality || '');
    setEditSpeech(profile.speech_style || '');
    setEditLikes(profile.likes || '');
    setEditDislikes(profile.dislikes || '');
    setEditRelationship(profile.relationship || '');
    setSettingsOpen(true);
  };
  const closeSettings = () => setSettingsOpen(false);

  const saveProfile = () => {
    const newProfile: UserProfile = {
      name_override: editName || undefined,
      personality: editPersonality || undefined,
      speech_style: editSpeech || undefined,
      likes: editLikes || undefined,
      dislikes: editDislikes || undefined,
      relationship: editRelationship || undefined,
    };
    setProfile(newProfile);
    localStorage.setItem('luna_user_profile', JSON.stringify(newProfile));
    closeSettings();
  };

  const resetProfile = () => {
    setEditName('');
    setEditPersonality('');
    setEditSpeech('');
    setEditLikes('');
    setEditDislikes('');
    setEditRelationship('');
  };

  // Admin login
  const openAdminLogin = () => {
    setLoginPw('');
    setShowLoginPrompt(true);
  };

  const submitAdminLogin = () => {
    if (loginPw) {
      localStorage.setItem('rag_admin_token', loginPw);
      setAdminToken(loginPw);
      setShowLoginPrompt(false);
      window.location.reload();
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('rag_admin_token');
    setAdminToken(null);
    window.location.reload();
  };

  // RAG Evaluation
  const runEval = async () => {
    setEvalLoading(true);
    setEvalResults(null);
    try {
      const res = await fetch(`/api/rag/evaluate?chunk_size=${evalChunkSize}&top_k=${evalTopK}&admin_token=${adminToken}`);
      if (!res.ok) throw Error('평가 실패');
      const data = await res.json();
      const rows = data.results || [];
      const formatted: EvalRow[] = rows.map((r: any) => ({
        chunk_size: evalChunkSize,
        top_k: evalTopK,
        avg_score: r.score || 0,
        avg_time: r.response_time || 0,
        total_time: 0,
      }));
      setEvalResults(formatted);
      setEvalDetail(`📋 ${rows.length}개 질문 · 키워드 커버리지 기반 평가`);
    } catch (err: any) {
      showError(`❌ 평가 오류: ${err.message}`);
    } finally {
      setEvalLoading(false);
    }
  };

  // Search Mode Comparison
  const runModeCompare = async () => {
    setModeCompareLoading(true);
    setModeCompareData(null);
    try {
      const res = await fetch(`/api/rag/evaluate-search-modes?top_k=${modeTopK}&admin_token=${adminToken}`);
      if (!res.ok) throw Error('비교 실패');
      const data: ModeCompareData = await res.json();
      setModeCompareData(data);
    } catch (err: any) {
      showError(`❌ 비교 오류: ${err.message}`);
    } finally {
      setModeCompareLoading(false);
    }
  };

  // Backtick key for admin
  useEffect(() => {
    let count = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '₩' || e.code === 'Backquote') {
        count++;
        if (count >= 2) {
          count = 0;
          openAdminLogin();
        }
        setTimeout(() => count = 0, 1000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const modeLabels: Record<string, string> = {
    vector: '🔤 Vector (의미검색)',
    bm25: '🔍 BM25 (키워드검색)',
    hybrid: '⚡ Hybrid (혼합)',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-pulse">
          {error}
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">🔑 관리자 로그인</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">비밀번호를 입력하세요</p>
            <input
              type="password"
              value={loginPw}
              onChange={e => setLoginPw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitAdminLogin(); }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400"
              placeholder="비밀번호"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowLoginPrompt(false)} className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-[#2a2a3e] text-sm">취소</button>
              <button onClick={submitAdminLogin} className="flex-1 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm">로그인</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeSettings}>
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">⚙ 캐릭터 설정</h2>
              <button onClick={closeSettings} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2a3e] flex items-center justify-center text-sm">✕</button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              이 기기/브라우저에만 저장되는 설정이에요.<br />
              루나의 성격과 말투를 원하는 대로 바꿔보세요! 🌙
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">캐릭터 이름</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="루나" maxLength={20}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">성격</label>
                <textarea value={editPersonality} onChange={e => setEditPersonality(e.target.value)} placeholder="부드럽고 따뜻한 성격의 AI 사서예요..." rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">말투</label>
                <select value={editSpeech} onChange={e => setEditSpeech(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400">
                  <option value="">기본 (~예요/~에요체)</option>
                  <option value="반말로 편하게 말해줘">반말 (~야/~다)</option>
                  <option value="귀여운 말투로 말해줘 (~냥/~용)">귀여운 말투</option>
                  <option value="격식있고 예의바르게 말해줘">격식체 (~습니다/~니다)</option>
                  <option value="차분하고 철학적인 말투로 말해줘">차분/철학적인 말투</option>
                  <option value="장난스럽고 유쾌하게 말해줘">장난스러운 말투</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">좋아하는 것</label>
                <input type="text" value={editLikes} onChange={e => setEditLikes(e.target.value)} placeholder="별빛, 책, 대화, 음악..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">싫어하는 것</label>
                <input type="text" value={editDislikes} onChange={e => setEditDislikes(e.target.value)} placeholder="거짓말, 무례한 말..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">나와의 관계 설정</label>
                <input type="text" value={editRelationship} onChange={e => setEditRelationship(e.target.value)} placeholder="예) 오랜 친구, 선생님과 제자, 동료..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-sm outline-none focus:border-purple-400" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={resetProfile} className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-[#2a2a3e] text-sm">초기화</button>
              <button onClick={saveProfile} className="flex-1 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm">💾 저장하기</button>
            </div>

            {/* Admin sections */}
            {adminToken && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#2a2a4a] space-y-4">
                {/* RAG Evaluation */}
                <div>
                  <h3 className="text-base font-bold mb-1">📊 RAG 성능 평가</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">파라미터별 RAG 성능을 측정합니다.</p>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Chunk Size</label>
                      <select value={evalChunkSize} onChange={e => setEvalChunkSize(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-xs outline-none">
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                        <option value="1500">1500</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Top-K</label>
                      <select value={evalTopK} onChange={e => setEvalTopK(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-xs outline-none">
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={runEval} disabled={evalLoading}
                    className="w-full px-3 py-2 rounded-lg bg-purple-600 text-white text-sm disabled:opacity-50">
                    {evalLoading ? '⏳ 측정 중...' : '▶ 성능 측정 실행'}
                  </button>
                  {evalResults && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-[#0f0f1a] rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">✅ 평가 완료</p>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                        {evalResults.map((r, i) => (
                          <div key={i}>Q{i+1}: 점수 {r.avg_score}점</div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{evalDetail}</p>
                    </div>
                  )}
                  {evalLoading && <p className="text-xs text-gray-400 mt-2 animate-pulse">🔍 RAG 성능 측정 중...</p>}
                </div>

                <div className="border-t border-gray-200 dark:border-[#2a2a4a] pt-4">
                  {/* Search Mode Comparison */}
                  <h3 className="text-base font-bold mb-1">🔍 검색 방식 비교</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vector vs BM25 vs Hybrid 성능 비교</p>
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">Top-K</label>
                    <select value={modeTopK} onChange={e => setModeTopK(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 dark:border-[#2a2a4a] bg-gray-50 dark:bg-[#0f0f1a] text-xs outline-none">
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <button onClick={runModeCompare} disabled={modeCompareLoading}
                    className="w-full px-3 py-2 rounded-lg bg-purple-600 text-white text-sm disabled:opacity-50">
                    {modeCompareLoading ? '⏳ 비교 중...' : '🔬 검색 모드 비교 실행'}
                  </button>
                  {modeCompareLoading && <p className="text-xs text-gray-400 mt-2 animate-pulse">🔬 검색 방식 비교 중...</p>}
                  {modeCompareData && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-[#0f0f1a] rounded-lg">
                      <div className="space-y-1 text-xs">
                        {['vector', 'bm25', 'hybrid'].map(mode => {
                          const comp = modeCompareData.modes_comparison[mode];
                          const isWinner = mode === modeCompareData.winner.mode;
                          if (!comp) return null;
                          return (
                            <div key={mode} className={`flex justify-between py-1 ${isWinner ? 'font-bold text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                              <span>{modeLabels[mode] || mode} {isWinner && '🏆'}</span>
                              <span>{(comp.summary.overall_avg_score || 0).toFixed(4)}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        🏆 승자: {modeLabels[modeCompareData.winner.mode]} ({(modeCompareData.winner.avg_score || 0).toFixed(4)})
                      </p>
                      {/* Per-question breakdown */}
                      {['vector', 'bm25', 'hybrid'].map(mode => {
                        const comp = modeCompareData.modes_comparison[mode];
                        if (!comp) return null;
                        return (
                          <details key={mode} className="mt-2 text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                              {modeLabels[mode]} — 상세 보기
                            </summary>
                            <div className="mt-1 pl-2 space-y-0.5 text-gray-400">
                              {comp.results.map((r, i) => (
                                <div key={i}>Q{i+1}: "{r.question}" → {r.num_results}개 결과</div>
                              ))}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Character Header */}
      <div className="flex items-center gap-3 py-4 border-b border-gray-200 dark:border-[#2a2a2c]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a3f8a] to-[#2a5a8a] flex items-center justify-center text-2xl shadow-lg shadow-purple-500/10 flex-shrink-0 overflow-hidden">
          <img src="/images/luna_avatar.jpg" className="w-full h-full object-cover" alt={charName} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold">{displayName}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span>대화 중</span>
            <span className="text-gray-400">·</span>
            <span className="truncate">{charTitle}</span>
          </div>
        </div>
        <button onClick={openSettings}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1a1a2e] flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors"
          title="캐릭터 설정">
          ⚙
        </button>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {quota.is_admin || adminToken ? (
            <span className="text-yellow-500 cursor-pointer" onClick={logoutAdmin}>👑 관리자</span>
          ) : (
            <span>💬 {quota.remaining}/{quota.limit}회</span>
          )}
        </div>
      </div>

      {/* Memory Bar */}
      <div className="py-2 text-xs text-center text-gray-500 dark:text-[#7777bb] border-b border-gray-100 dark:border-[#1a1a2e]">
        {memoryBar}
      </div>

      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a3f8a] to-[#2a5a8a] flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-purple-500/10 overflow-hidden">
              <img src="/images/luna_avatar.jpg" className="w-full h-full object-cover" alt={charName} />
            </div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-[#E5E7EB]">{displayName}</h2>
            <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mt-2 max-w-sm mx-auto leading-relaxed">
              {greetingMsg}
            </p>
            <div className="flex gap-2 justify-center mt-6 flex-wrap">
              <button onClick={() => { setInput('안녕! 나는 어떤 사람이야?'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors">
                💭 &quot;나는 어떤 사람이야?&quot;
              </button>
              <button onClick={() => { setInput('저번에 무슨 얘기 했었지?'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors">
                🔄 &quot;저번 얘기 기억해?&quot;
              </button>
              <button onClick={() => { setInput('너 소개해줘'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors">
                🌙 &quot;너 소개해줘&quot;
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-6">💫 대화할수록 더 똑똑해져요</p>
            {!adminToken && (
              <button onClick={openAdminLogin} className="mt-4 text-xs text-gray-400 hover:text-purple-400 transition-colors">
                🔑 관리자
              </button>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-[#1a2a5a] to-[#1a1a4a] text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-[#15152e] text-gray-900 dark:text-[#E5E7EB] border border-gray-200 dark:border-[#2a2a4a] rounded-bl-md'
            }`}>
              {msg.role === 'bot' && (
                <div className="text-xs font-medium text-purple-500 dark:text-[#8888dd] mb-1">
                  🌙 {displayName}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.role === 'bot' && msg.memories && msg.memories > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-[#2a2a4a] text-xs text-purple-400">
                  💫 {msg.memories}개의 기억을 떠올렸어요
                </div>
              )}
              {msg.role === 'user' && (
                <div className="text-xs text-gray-500 mt-1 text-right">나</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-[#15152e] rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 dark:border-[#2a2a4a]">
              <div className="text-xs font-medium text-purple-500 dark:text-[#8888dd] mb-2">
                🌙 {displayName}
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="py-4 border-t border-gray-200 dark:border-[#2a2a2c]">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative bg-gray-100 dark:bg-[#14142e] rounded-2xl border border-gray-200 dark:border-[#2a2a4a] focus-within:border-purple-400 transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`${displayName}에게 메시지 보내기...`}
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none text-gray-900 dark:text-[#E5E7EB] placeholder-gray-400"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={quota.remaining <= 0 && !quota.is_admin && !adminToken}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || (quota.remaining <= 0 && !quota.is_admin && !adminToken)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3f8a] to-[#3a3faa] text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🔑 세션 ID: {sessionId.current.slice(0, 8)}...
          {quota.is_admin || adminToken ? ' | 👑 무제한' : ` | 💬 ${quota.remaining}/${quota.limit}회 남음`}
          {adminToken && (
            <span className="ml-2 text-purple-400 cursor-pointer" onClick={openSettings}>⚙ 설정</span>
          )}
        </p>
      </div>
    </div>
  );
}
