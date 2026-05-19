'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('luna_session_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('luna_session_id', id);
  return id;
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

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }, []);

  // Load character info
  useEffect(() => {
    // Character data comes with each chat response
    // Set default character info
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
    fetch('/api/rag')
      .then(r => r.json())
      .then(d => setQuota(d))
      .catch(() => showError('⚠️ 서버 연결 실패'));
  }, [showError]);

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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-pulse">
          {error}
        </div>
      )}

      {/* Character Header */}
      <div className="flex items-center gap-3 py-4 border-b border-gray-200 dark:border-[#2a2a2c]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a3f8a] to-[#2a5a8a] flex items-center justify-center text-2xl shadow-lg shadow-purple-500/10 flex-shrink-0">
          {charEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold">{charName}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span>대화 중</span>
            <span className="text-gray-400">·</span>
            <span className="truncate">{charTitle}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {quota.is_admin ? (
            <span className="text-yellow-500">👑 관리자</span>
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
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto py-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a3f8a] to-[#2a5a8a] flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-purple-500/10">
              {charEmoji}
            </div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-[#E5E7EB]">{charName}</h2>
            <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mt-2 max-w-sm mx-auto leading-relaxed">
              {character?.greeting_message || '안녕하세요! 별빛 도서관의 사서예요 🌙'}
            </p>
            <div className="flex gap-2 justify-center mt-6 flex-wrap">
              <button
                onClick={() => { setInput('안녕! 나는 어떤 사람이야?'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors"
              >
                💭 "나는 어떤 사람이야?"
              </button>
              <button
                onClick={() => { setInput('저번에 무슨 얘기 했었지?'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors"
              >
                🔄 "저번 얘기 기억해?"
              </button>
              <button
                onClick={() => { setInput('너 소개해줘'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a2e] text-gray-500 dark:text-[#8888bb] border border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors"
              >
                🌙 "너 소개해줘"
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-6">💫 대화할수록 더 똑똑해져요</p>
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
                  🌙 {charName}
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
                🌙 {charName}
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
              placeholder={`${charName}에게 메시지 보내기...`}
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none text-gray-900 dark:text-[#E5E7EB] placeholder-gray-400"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={quota.remaining <= 0 && !quota.is_admin}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || (quota.remaining <= 0 && !quota.is_admin)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3f8a] to-[#3a3faa] text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🔑 세션 ID: {sessionId.current.slice(0, 8)}...
          {quota.is_admin ? ' | 👑 무제한' : ` | 💬 ${quota.remaining}/${quota.limit}회 남음`}
        </p>
      </div>
    </div>
  );
}
