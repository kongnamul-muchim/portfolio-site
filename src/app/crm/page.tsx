'use client';

import { useState, useEffect, useCallback } from 'react';

// --- Types ---
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  tags: string[];
  memo: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total_customers: number;
  by_status: Record<string, number>;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  tags: string;
  memo: string;
}

const ADMIN_TOKEN = 'gugu2026';
const API = '/api/crm';
const EMPTY_FORM: CustomerForm = { name: '', email: '', phone: '', company: '', position: '', status: 'lead', tags: '', memo: '' };

const STATUS_LABEL: Record<string, string> = {
  lead: '잠재고객',
  contact: '상담중',
  customer: '고객',
  churned: '이탈',
};

const STATUS_COLOR: Record<string, string> = {
  lead: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  contact: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  customer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  churned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const STATUS_BG: Record<string, string> = {
  lead: 'bg-blue-500',
  contact: 'bg-yellow-500',
  customer: 'bg-green-500',
  churned: 'bg-gray-500',
};

// --- Helpers ---
function formatDate(s: string) {
  if (!s) return '-';
  return new Date(s).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CrmPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  // --- Fetch ---
  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ admin_token: ADMIN_TOKEN, page: String(p), limit: String(limit) });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const [custRes, statsRes] = await Promise.all([
        fetch(`${API}?${params}`),
        fetch(`${API}/stats?admin_token=${ADMIN_TOKEN}`),
      ]);
      const custData = await custRes.json();
      const statsData = await statsRes.json();
      setCustomers(custData.customers || []);
      setTotal(custData.total || 0);
      setTotalPages(custData.total_pages || 1);
      setStats(statsData);
    } catch {
      showToast('데이터를 불러오는데 실패했어요', false);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, limit]);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  // --- CRUD ---
  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Customer) => {
    setEditId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, position: c.position, status: c.status, tags: c.tags.join(','), memo: c.memo });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('이름은 필수입니다', false); return; }
    setSaving(true);
    try {
      const body = { ...form, admin_token: ADMIN_TOKEN };
      const url = editId ? `${API}/${editId}` : API;
      const res = await fetch(url, {
        method: editId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.detail || '오류 발생', false); return; }
      showToast(editId ? '수정되었습니다!' : '등록되었습니다!');
      setModalOpen(false);
      fetchData(page);
    } catch { showToast('저장 실패', false); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/${deleteId}?admin_token=${ADMIN_TOKEN}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { showToast(data.detail || '오류', false); return; }
      showToast(data.message || '삭제되었습니다');
      setDeleteId(null);
      fetchData(page);
    } catch { showToast('삭제 실패', false); }
    finally { setDeleting(false); }
  };

  // --- Stats bar chart ---
  const maxStat = stats ? Math.max(1, ...Object.values(stats.by_status)) : 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E5E7EB]">CRM</h1>
            <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mt-1">고객 관계 관리</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
            + 고객 등록
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#1F2937] rounded-xl p-4 border border-gray-200 dark:border-[#374151]">
              <div className="text-xs text-gray-500 dark:text-[#9CA3AF] mb-1">전체 고객</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-[#E5E7EB]">{stats.total_customers}</div>
            </div>
            {Object.entries(stats.by_status).map(([s, cnt]) => (
              <div key={s} className="bg-white dark:bg-[#1F2937] rounded-xl p-4 border border-gray-200 dark:border-[#374151]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${STATUS_BG[s] || 'bg-gray-500'}`} />
                  <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">{STATUS_LABEL[s] || s}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-[#E5E7EB]">{cnt}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status bar chart */}
        {stats && stats.total_customers > 0 && (
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-4 border border-gray-200 dark:border-[#374151] mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[#D1D5DB] mb-3">📊 상태별 현황</h3>
            <div className="flex gap-1 h-8 items-end">
              {Object.entries(stats.by_status).map(([s, cnt]) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">{cnt}</span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${(cnt / maxStat) * 100}%`,
                      minHeight: cnt > 0 ? '12px' : '0',
                      backgroundColor: s === 'lead' ? '#3B82F6' : s === 'contact' ? '#EAB308' : s === 'customer' ? '#22C55E' : '#6B7280',
                    }}
                  />
                  <span className="text-[10px] text-gray-500 dark:text-[#9CA3AF]">{STATUS_LABEL[s] || s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 이름, 이메일, 회사 검색..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#1F2937] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#1F2937] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">전체 상태</option>
            <option value="lead">잠재고객</option>
            <option value="contact">상담중</option>
            <option value="customer">고객</option>
            <option value="churned">이탈</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-[#374151] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#374151] bg-gray-50 dark:bg-[#111827]">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF]">이름</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF] hidden md:table-cell">연락처</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF] hidden lg:table-cell">회사</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF]">상태</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF] hidden sm:table-cell">태그</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-[#9CA3AF]">관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500 dark:text-[#9CA3AF]">로딩중...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500 dark:text-[#9CA3AF]">
                    {search || statusFilter ? '검색 결과가 없습니다' : '고객을 등록해보세요!'}
                  </td></tr>
                ) : customers.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-[#E5E7EB]">{c.name}</div>
                      <div className="text-xs text-gray-500 dark:text-[#9CA3AF] md:hidden">{c.email || c.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-[#9CA3AF] hidden md:table-cell">
                      <div>{c.email}</div>
                      <div className="text-xs">{c.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-[#9CA3AF] hidden lg:table-cell">
                      <div>{c.company}</div>
                      <div className="text-xs">{c.position}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[c.status] || ''}`}>
                        {STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(c.tags || []).slice(0, 3).map((t, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-[#9CA3AF]">{t}</span>
                        ))}
                        {(c.tags?.length || 0) > 3 && <span className="text-xs text-gray-400">+{c.tags!.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="text-cyan-600 hover:text-cyan-700 dark:text-[#22D3EE] dark:hover:text-cyan-400 text-xs font-medium mr-3">수정</button>
                      <button onClick={() => setDeleteId(c.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#374151]">
              <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">총 {total}명</span>
              <div className="flex gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-[#D1D5DB] disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600"
                >이전</button>
                <span className="px-3 py-1 text-sm text-gray-600 dark:text-[#9CA3AF]">{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-[#D1D5DB] disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600"
                >다음</button>
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${
            toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
            <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-lg mx-4 border border-gray-200 dark:border-[#374151] shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#E5E7EB] mb-4">{editId ? '고객 수정' : '신규 고객 등록'}</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">이름 *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">이메일</label>
                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">전화번호</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">회사</label>
                    <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">직책</label>
                    <input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">상태</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option value="lead">잠재고객</option>
                      <option value="contact">상담중</option>
                      <option value="customer">고객</option>
                      <option value="churned">이탈</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">태그 (쉼표 구분)</label>
                    <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="VIP, 파트너" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-[#9CA3AF] mb-1">메모</label>
                  <textarea value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">취소</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {saving ? '저장중...' : (editId ? '수정' : '등록')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteId(null)}>
            <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-sm mx-4 border border-gray-200 dark:border-[#374151] shadow-2xl" onClick={e => e.stopPropagation()}>
              <p className="text-gray-900 dark:text-[#E5E7EB] font-medium mb-4">정말 삭제하시겠습니까?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">취소</button>
                <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {deleting ? '삭제중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
