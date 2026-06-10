"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { ASSET_CATEGORIES } from "@/lib/categories";

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // q is local state; cat/type come directly from URL
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keep text input in sync when URL changes (e.g. "Limpiar filtros")
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The active category always reads from the URL — no separate state needed
  const selectedCat = searchParams.get("cat") ?? "";
  const selectedLabel = selectedCat
    ? (ASSET_CATEGORIES.find((c) => c.id === selectedCat)?.label ?? "Todas las categorías")
    : "Todas las categorías";

  // Category selection navigates immediately; does NOT touch ?q
  function handleCategorySelect(catId: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (catId) next.set("cat", catId);
    else next.delete("cat");
    setOpen(false);
    const str = next.toString();
    router.push(str ? `/explorer?${str}` : "/explorer");
  }

  // Text submit ONLY updates ?q — leaves ?cat and ?type untouched
  function handleSubmit() {
    const next = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    const str = next.toString();
    router.push(str ? `/explorer?${str}` : "/explorer");
  }

  // Clear ONLY removes ?q — leaves ?cat and ?type untouched
  function handleClear() {
    setQuery("");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    const str = next.toString();
    router.push(str ? `/explorer?${str}` : "/explorer");
  }

  return (
    <div className="flex items-center rounded-pill border border-white/20 bg-white/5 backdrop-blur-sm">
      {/* Category dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-5 py-3.5 text-sm text-foreground/70 hover:text-foreground transition-colors border-r border-white/15 whitespace-nowrap"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {selectedLabel}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute top-full left-0 mt-2 w-64 bg-surface-muted border border-white/10 rounded-card shadow-2xl z-50 py-1 overflow-hidden"
          >
            <li role="option" aria-selected={!selectedCat}>
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  !selectedCat ? "text-white bg-white/10" : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                Todas las categorías
              </button>
            </li>
            {ASSET_CATEGORIES.map((cat) => (
              <li key={cat.id} role="option" aria-selected={selectedCat === cat.id}>
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedCat === cat.id
                      ? "text-white bg-white/10"
                      : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Buscar prompts, automatizaciones..."
        className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-sm text-foreground placeholder:text-foreground/35 outline-none"
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="px-2 transition-colors"
          style={{ color: "rgba(242,242,242,0.35)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(242,242,242,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(242,242,242,0.35)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Search button */}
      <button
        onClick={handleSubmit}
        aria-label="Buscar"
        className="flex items-center justify-center w-10 h-10 m-1.5 rounded-full bg-gradient-to-b from-primary to-primary-dark text-white hover:opacity-90 transition-opacity shrink-0"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="flex items-center rounded-pill border border-white/20 bg-white/5 h-[52px] w-full animate-pulse" />
  );
}

export function SearchBar() {
  return (
    <Suspense fallback={<SearchBarSkeleton />}>
      <SearchBarInner />
    </Suspense>
  );
}
