"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchDocs } from "@/context/search-docs-context";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSearch } = useSearchDocs();
  const pathname = usePathname();

  const navItems = [
    { name: "Docs", href: "/docs/getting-started/introduction" },
    { name: "Kits", href: "/docs/kits/overview" },
  ];

  const externalNavItems = [
    { name: "About Us", href: "https://www.fivexlabs.com" },
  ];

  const handleOpenSearch = () => {
    openSearch();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-14 bg-black/50 backdrop-blur-sm">
        {/* Equal 1fr | auto | 1fr columns on md+ so the search sits in the true horizontal center */}
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/* Logo */}
          <div className="flex min-w-0 justify-start">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="FivFold - Home"
            >
              <Image
                src="/logos/logomark_dark_transparent.png"
                alt="FivFold - Logo"
                width={100}
                height={100}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Search — centered in the middle column (desktop only) */}
          <div className="hidden min-w-0 w-72 justify-center md:flex">
            <button
              type="button"
              onClick={openSearch}
              className="relative flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-left text-sm text-white/80 transition-colors hover:border-white/20 hover:bg-white/10"
              aria-label="Search documentation (⌘ K)"
            >
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden
              />
              <span className="text-white/40">Search docs...</span>
              <kbd className="ml-auto hidden rounded bg-white/10 px-2 py-0.5 text-xs text-white/50 sm:inline-block">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Desktop nav + mobile actions */}
          <div className="flex min-w-0 items-center justify-end gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith(item.href)
                      ? "text-brand-primary"
                      : "text-white/80 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {externalNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://github.com/Fivex-Labs/fivfold"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
            </nav>

            {/* Mobile: Search + Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={openSearch}
                className="rounded-lg p-2 text-white/80 hover:bg-white/5 hover:text-white"
                aria-label="Search docs"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="rounded-lg p-2 text-white/80 hover:bg-white/5 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 overflow-hidden border-b border-white/10 bg-[#0a0a0a] md:hidden"
          >
            <div className="space-y-1 p-4">
              <button
                type="button"
                onClick={handleOpenSearch}
                className="relative flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-left text-sm text-white/80 hover:bg-white/10"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <span className="text-white/40">Search docs...</span>
              </button>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-base font-medium",
                    pathname.startsWith(item.href)
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-white/80 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {externalNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://github.com/Fivex-Labs/fivfold"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
