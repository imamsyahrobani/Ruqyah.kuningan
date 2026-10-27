import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Calendar,
  User,
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
  MessageSquare,
  Link2,
  Copy,
  Check,
  Share2
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
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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
  useEffect(() => {
    const t = setTimeout(() => {
      fetchArticles(activeCategory, searchQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [activeCategory, searchQuery]);


  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('artikel');
    if (slug && articles.length > 0) {
      const found = articles.find((a) => a.slug === slug || a.id === slug);
      if (found) setSelectedArticle(found);
    }
  }, [articles]);

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

  const getShareUrl = () => {
    if (!selectedArticle) return window.location.href;
    const url = new URL(window.location.href);
    url.searchParams.set('artikel', selectedArticle.slug);
    return url.toString();
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function' || !selectedArticle) return;
    try {
      await navigator.share({
        title: selectedArticle.title,
        text: selectedArticle.excerpt,
        url: shareUrl
      });
    } catch (err) {
      // user cancelled or unsupported
    }
  };

  // Update URL when opening/closing article
  useEffect(() => {
    if (!selectedArticle) return;
    const url = new URL(window.location.href);
    url.searchParams.set('artikel', selectedArticle.slug);
    window.history.replaceState({}, '', url.toString());
    return () => {
      const u = new URL(window.location.href);
      u.searchParams.delete('artikel');
      window.history.replaceState({}, '', u.toString());
    };
  }, [selectedArticle]);


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
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke daftar artikel
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {selectedArticle.category}
            </span>
          </div>
          <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              {selectedArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-6">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(selectedArticle.publishedAt)}
              </span>
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedArticle.tags.join(', ')}
                </span>
              )}
            </div>
            {selectedArticle.coverImage && (
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-56 object-cover rounded-2xl mb-6"
              />
            )}
            <div>DEBUG: {selectedArticle.title}</div>
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-700" />
                Bagikan Artikel
              </h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-semibold hover:opacity-90"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:opacity-90"
                >
                  <Twitter className="w-4 h-4" /> X (Twitter)
                </a>
                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(selectedArticle.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:opacity-90"
                >
                  <MessageSquare className="w-4 h-4" /> Threads
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(selectedArticle.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:opacity-90"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Tautan Disalin' : 'Salin Tautan'}
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                  >
                    <Share2 className="w-4 h-4" /> Bagikan (Instagram/dll)
                  </button>
                )}
              </div>
              <p className="text-[10px] text-stone-400 mt-2">
                Instagram tidak mendukung share link langsung; gunakan "Salin Tautan" atau "Bagikan" untuk menempel di Instagram.
              </p>
            </div>

          </article>
        </div>
      )}
    </section>
  );
};
