"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguagePreference } from "@/hooks/use-language-preference";

const copy = {
  zh: {
    opportunity: "判断兼职",
    tools: "选择工具",
    about: "关于",
  },
  en: {
    opportunity: "Check job",
    tools: "Tools",
    about: "About",
  },
} as const;

export function Header() {
  const [language] = useLanguagePreference();
  const t = copy[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-lg">AU-Partimer</span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/opportunity"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.opportunity}
          </Link>
          <Link
            href="/diagnostic"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.tools}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.about}
          </Link>
        </nav>
      </div>
    </header>
  );
}
