import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/Fivex-Labs/fivfold",
    label: "GitHub",
  },
];

const productLinks = [
  { title: "Docs", href: "/docs" },
  { title: "Kits", href: "/docs/kits/overview" },
  { title: "Getting Started", href: "/docs/getting-started/introduction" },
  { title: "CLI Reference", href: "/docs/getting-started/cli" },
];

const communityLinks = [
  {
    title: "Contributing",
    href: "https://github.com/Fivex-Labs/fivfold/blob/main/CONTRIBUTING.md",
    external: true,
  },
  {
    title: "GitHub Issues",
    href: "https://github.com/Fivex-Labs/fivfold/issues",
    external: true,
  },
];

export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[var(--section-cta-end)] via-[color-mix(in_srgb,var(--color-brand-primary)_12%,#080808)] to-[color-mix(in_srgb,var(--color-brand-primary)_22%,#050505)]">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -bottom-3/4"
        aria-hidden="true"
      >
        <Image
          src="/logos/logo_full_dark_transparent.png"
          alt=""
          width={2000}
          height={1000}
          className="h-auto w-full saturate-0 opacity-5"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logos/logo_full_dark_transparent.png"
                alt="FivFold"
                width={100}
                height={100}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              FivFold is a comprehensive full-stack development platform that
              provides pre-built &quot;Kits&quot; to streamline project scaffolding
              for both frontend and backend systems.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-primary/20 border border-white/10 hover:border-brand-primary/50 flex items-center justify-center text-white/70 hover:text-brand-primary transition-all hover:scale-110 active:scale-95"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-brand-primary transition-colors text-sm block"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {communityLinks.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-brand-primary transition-colors text-sm block"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-brand-primary transition-colors text-sm block"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Fivex Labs. All rights reserved.
            </p>
            <a
              href="https://www.fivexlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors text-sm"
            >
              Built with 💛 by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.fivexlabs.com/logos/fivex-transparent.png"
                alt="Fivex Labs"
                className="h-4 w-auto inline"
              />
            </a>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-white/50 hover:text-brand-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/50 hover:text-brand-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
