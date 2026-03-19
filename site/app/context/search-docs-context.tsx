"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { SearchDocsCommand } from "@/components/search-docs-command";

interface SearchDocsContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSearch: () => void;
}

const SearchDocsContext = createContext<SearchDocsContextValue | null>(null);

export function useSearchDocs() {
  const ctx = useContext(SearchDocsContext);
  if (!ctx) {
    throw new Error("useSearchDocs must be used within SearchDocsProvider");
  }
  return ctx;
}

export function SearchDocsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SearchDocsContext.Provider value={{ open, setOpen, openSearch }}>
      {children}
      <SearchDocsCommand open={open} onOpenChange={setOpen} />
    </SearchDocsContext.Provider>
  );
}
