import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Star, Sparkles, Cpu, HardDrive, Zap, Tag, Truck } from 'lucide-react';
import { Product } from '../../types/product';
import { apiClient } from '../../api/client';

interface CatalogExplorerProps {
  onDelegateGoal: (prompt: string, budget: number) => void;
}

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({ onDelegateGoal }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        apiClient.getProducts({
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          max_price: maxPrice,
          search: search.trim() || undefined,
        }),
        apiClient.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalog();
  };

  return (
    <div className="space-y-5">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white">Mock Commerce Product Catalog</h2>
          <p className="text-xs text-slate-400">
            Browse seed inventory (~41 realistic items) that the autonomous agent searches and compares against.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Showing</span>
          <span className="font-bold text-cyan-400">{products.length}</span>
          <span>products</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-background-panel border border-background-border space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-background-card text-slate-300 hover:bg-slate-800 border border-background-border'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-background-card text-slate-300 hover:bg-slate-800 border border-background-border'
              }`}
            >
              <span>{cat.name}</span>
              <span className="ml-1.5 opacity-60 text-[10px] font-mono font-bold">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Price Slider */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-background-border">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword, CPU, GPU, brand (e.g., 'RTX 4050', 'OLED')..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background-dark border border-background-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </form>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 whitespace-nowrap">Max Price Cap:</span>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 sm:w-48 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-cyan-400 w-16 text-right">
              ${maxPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading catalog inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-background-panel rounded-2xl border border-background-border">
          <p className="text-sm">No products found for the specified filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-background-panel border border-background-border hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div className="relative">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-background-dark/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  {p.brand}
                </div>
                {p.subcategory && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-medium">
                    {p.subcategory}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                    {p.title}
                  </h4>

                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-semibold">{p.rating}</span>
                    <span className="text-slate-500 text-[10px]">({p.review_count})</span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Specs snapshot */}
                <div className="pt-2 border-t border-background-border space-y-1 text-[10px] text-slate-400">
                  {p.specs.cpu && <div>• CPU: {p.specs.cpu}</div>}
                  {p.specs.gpu && <div>• GPU: {p.specs.gpu}</div>}
                  {p.specs.battery_hours && <div>• Battery: {p.specs.battery_hours} hrs</div>}
                </div>

                {/* Price & Delegate Button */}
                <div className="pt-3 border-t border-background-border flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-black text-white font-mono">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.original_price && p.original_price > p.price && (
                      <span className="text-xs text-slate-500 line-through font-mono ml-1.5">
                        ${p.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onDelegateGoal(
                        `Find and compare ${p.title} or similar alternatives within $${Math.ceil(p.price * 1.1)}`,
                        Math.ceil(p.price * 1.1)
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    title="Delegate shopping analysis to agent"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Agent Evaluate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
