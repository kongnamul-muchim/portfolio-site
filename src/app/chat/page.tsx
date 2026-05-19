'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('aichat_session_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('aichat_session_id', id);
  return id;
}

interface Document {
  id: number;
  title: string;
  filename: string;
  created_at?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string; sources?: { title: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState({ remaining: 10, limit: 10, is_admin: false });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [docs, setDocs] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(getSessionId());

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }, []);

  useEffect(() => {
    fetch('/api/rag')
      .then(r => r.json())
      .then(d => setQuota(d))
      .catch(() => showError('⚠️ 서버 상태 확인 실패'));
  }, [showError]);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const loadDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/rag?admin_token=${adminPw}`);
      const data = await res.json();
      if (data.documents) setDocs(data.documents);
    } catch {
      // 문서 목록 로딩 실패는 조용히 무시
    }
  }, [adminPw]);

  const handleAdminLogin = () => {
    if (adminPw) {
      setIsAdmin(true);
      setQuota(prev => ({ ...prev, remaining: 999, is_admin: true }));
      loadDocs();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('admin_token', adminPw);

      const res = await fetch('http://45.59.101.155:8000/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showError(`✅ "${data.title}" 업로드 완료 (${data.chunks}개 청크)`);
        await loadDocs();
      } else {
        showError(`❌ 업로드 실패: ${data.detail || '알 수 없는 오류'}`);
      }
    } catch {
      showError('❌ 업로드 중 네트워크 오류');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (docId: number) => {
    try {
      const res = await fetch(`http://45.59.101.155:8000/api/documents/${docId}?admin_token=${adminPw}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showError('🗑️ 문서 삭제 완료');
        await loadDocs();
      }
    } catch {
      showError('❌ 삭제 실패');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const body: Record<string, unknown> = { question, session_id: sessionId.current };
      if (isAdmin && adminPw) body.admin_token = adminPw;

      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', content: data.answer, sources: data.sources }]);
        if (!data.is_admin) setQuota(prev => ({ ...prev, remaining: data.remaining_quota }));
        else { setIsAdmin(true); setQuota(prev => ({ ...prev, is_admin: true })); }
      } else {
        const errMsg = data.detail?.message || data.detail || '오류가 발생했습니다';
        setMessages(prev => [...prev, { role: 'bot', content: `❌ ${errMsg}` }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '❌ 네트워크 오류. 서버에 연결할 수 없습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-pulse">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🤖 RAG 챗봇</h1>
          <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">DeepSeek V4 Flash + pgvector</p>
        </div>
        <div className="flex items-center gap-3">
          {quota.is_admin ? (
            <>
              <span className="text-sm text-yellow-500">👑 관리자</span>
              <span className="text-xs text-gray-500">📄 {docs.length}개 문서</span>
            </>
          ) : (
            <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">
              📊 {quota.remaining}/{quota.limit}회
              {quota.remaining <= 2 && ' ⚠️'}
            </span>
          )}
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            🔐 관리자
          </button>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-[#1a1a1c] rounded-xl border border-gray-200 dark:border-[#2a2a2c] space-y-3">
          {!isAdmin ? (
            <div className="flex gap-2">
              <input
                type="password"
                value={adminPw}
                onChange={e => setAdminPw(e.target.value)}
                placeholder="관리자 비밀번호"
                className="flex-1 bg-white dark:bg-[#0D0D0E] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#22D3EE]"
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                onClick={handleAdminLogin}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                로그인
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Document Upload */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.txt,.pdf"
                  onChange={handleUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#22D3EE] text-black rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  {uploading ? '⏳ 업로드 중...' : '📄 문서 업로드'}
                </button>
                <span className="text-xs text-gray-500">(.md / .txt / .pdf)</span>
              </div>

              {/* Document List */}
              {docs.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <p className="text-xs text-gray-500 font-medium">📚 문서 목록</p>
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-white dark:bg-[#0D0D0E] rounded px-3 py-1.5 text-sm">
                      <span className="truncate text-gray-700 dark:text-[#E5E7EB]">
                        📎 {doc.title}
                      </span>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="text-red-400 hover:text-red-300 text-xs ml-2 shrink-0"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat messages */}
      <div
        ref={containerRef}
        className="h-[500px] overflow-y-auto mb-4 space-y-4 bg-gray-100 dark:bg-[#0D0D0E] rounded-xl p-4 border border-gray-200 dark:border-[#2a2a2c]"
      >
        {messages.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-lg font-medium text-gray-500 dark:text-[#9CA3AF]">업로드된 문서에 대해 질문해보세요!</p>
            <p className="text-sm mt-2">문서 검색 → AI 답변 → 출처 표시</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 leading-relaxed text-sm ${
              msg.role === 'user'
                ? 'bg-[#22D3EE] text-white'
                : 'bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-[#E5E7EB] border border-gray-200 dark:border-[#2a2a2c]'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-[#2a2a2c] text-xs text-gray-400">
                  📎 출처: {msg.sources.map(s => s.title).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#1a1a1c] rounded-xl px-4 py-3 border border-gray-200 dark:border-[#2a2a2c]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={
            quota.remaining > 0 || quota.is_admin
              ? '질문을 입력하세요...'
              : '😅 오늘 할당량을 모두 사용했습니다 (내일 다시 시도해주세요)'
          }
          disabled={quota.remaining <= 0 && !quota.is_admin}
          className="flex-1 bg-white dark:bg-[#0D0D0E] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 outline-none focus:border-[#22D3EE] text-gray-900 dark:text-[#E5E7EB] placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || (quota.remaining <= 0 && !quota.is_admin)}
          className="px-6 py-3 bg-[#22D3EE] text-black rounded-xl font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          전송
        </button>
      </div>

      {/* Session info */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        🔑 세션 ID: {sessionId.current.slice(0, 8)}... | 
        {quota.is_admin 
          ? ' 👑 무제한' 
          : ` 📊 ${quota.remaining}/${quota.limit}회 남음`
        }
      </p>
    </div>
  );
}
