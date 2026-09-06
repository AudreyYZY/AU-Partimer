import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Header() {
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
            判断兼职
          </Link>
          <Link
            href="/diagnostic"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            选择工具
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
