import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Calendar,
  User,
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import { Article } from '../types';

interface BlogSectionProps {
  onOpenTracking?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['all', ...Array.from(new Set(articles.map((a) => a.category)))];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = (category?: string, search?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    fetch(`/api/articles${params.toString() ? '?' + params.toString() : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setArticles(data.data);
      })
      .catch((err) => console.error('Failed to load articles:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchArticles(activeCategory, searchQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [activeCategory, searchQuery]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} className="font-semibold text-stone-900">{p.slice(2, -2)}</strong>;
      }
      return <span key={i}>{p}</span>;
    });
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 text-stone-700 text-sm leading-relaxed mb-3">
            {listBuffer.map((li, i) => (
              <li key={i}>{renderInline(li)}</li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed === '') {
        flushList();
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={`h-${idx}`} className="text-lg sm:text-xl font-bold text-emerald-950 mt-6 mb-2">
            {trimmed.slice(3)}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${idx}`} className="text-xl sm:text-2xl font-bold text-stone-900 mt-6 mb-2">
            {trimmed.slice(2)}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith('- ')) {
        listBuffer.push(trimmed.slice(2));
        return;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        listBuffer.push(trimmed.replace(/^\d+\.\s/, ''));
        return;
      }
      flushList();
      elements.push(
        <p key={`p-${idx}`} className="text-sm sm:text-base text-stone-700 leading-relaxed mb-3">
          {renderInline(trimmed)}
        </p>
      );
    });
    flushList();
    return elements;
  };

  return (
    <section id="blog-section" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Artikel & Blog</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">Wawasan Ruqyah Syar'iyyah & Thibbun Nabawi</h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">Kumpulan artikel edukasi seputar tanda gangguan rohani, panduan ruqyah mandiri, dan tauhid.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari artikel..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-400'}`}>
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-sm text-stone-500 py-12">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-sm text-stone-500 py-12">Belum ada artikel.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col">
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-emerald-800 to-emerald-600 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-amber-300" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">{article.category}</span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">Baca <ArrowLeft className="w-3 h-3 rotate-180" /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{selectedArticle.category}</span>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">{selectedArticle.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-6">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{selectedArticle.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(selectedArticle.publishedAt)}</span>
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{selectedArticle.tags.join(', ')}</span>
                )}
              </div>
              <div>{renderContent(selectedArticle.content)}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
