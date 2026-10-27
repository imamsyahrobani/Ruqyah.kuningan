import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { Article } from '../types';

export const AdminArticlesPanel: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('Edukasi');
  const [author, setAuthor] = useState<string>('Ustadz Imam Syahrobani, M.Pd');
  const [tags, setTags] = useState<string>('');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success && data.data) setArticles(data.data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('Edukasi');
    setAuthor('Ustadz Imam Syahrobani, M.Pd');
    setTags('');
    setShowForm(false);
    setMessage(null);
  };

  const startEdit = (a: Article) => {
    setEditingId(a.id);
    setTitle(a.title);
    setExcerpt(a.excerpt);
    setContent(a.content);
    setCategory(a.category);
    setAuthor(a.author);
    setTags((a.tags || []).join(', '));
    setShowForm(true);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage('Judul dan konten wajib diisi');
      return;
    }
    setSaving(true);
    setMessage(null);
    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim() || content.trim().slice(0, 160),
      content: content.trim(),
      category: category.trim() || 'Umum',
      author: author.trim() || 'Ustadz Imam Syahrobani, M.Pd',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
    };
    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan artikel');
      }
      setMessage('Artikel berhasil disimpan');
      await fetchArticles();
      resetForm();
    } catch (err: any) {
      setMessage(err.message || 'Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-stone-900">Kelola Artikel Blog ({articles.length})</h4>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Artikel
        </button>
      </div>

      {message && (
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs">{message}</div>
      )}

      {showForm && (
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {editingId ? 'Edit Artikel' : 'Artikel Baru'}
            </span>
            <button onClick={resetForm} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul artikel"
            className="w-full p-2 rounded-lg border border-stone-300 text-xs"
          />
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan (excerpt)"
            className="w-full p-2 rounded-lg border border-stone-300 text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kategori"
              className="w-full p-2 rounded-lg border border-stone-300 text-xs"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (pisahkan koma)"
              className="w-full p-2 rounded-lg border border-stone-300 text-xs"
            />
          </div>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Konten artikel (markdown sederhana)"
            className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Artikel'}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-xs text-stone-500 py-6">Memuat artikel...</div>
      ) : (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {articles.map((a) => (
            <div key={a.id} className="p-3 rounded-xl border border-stone-200 bg-white flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-stone-900 truncate">{a.title}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  {a.category} • {new Date(a.publishedAt).toLocaleDateString('id-ID')}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => startEdit(a)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="text-center text-xs text-stone-500 py-6">Belum ada artikel.</div>
          )}
        </div>
      )}
    </div>
  );
};
