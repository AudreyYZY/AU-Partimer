"use client";
import Link from "next/link";
import { ShieldCheck, Languages } from "lucide-react";
import { useLanguagePreference } from "@/hooks/use-language-preference";
export function Header() {
  const [language,setLanguage]=useLanguagePreference();
  return <header className="app-header"><Link href="/" className="brand"><ShieldCheck size={24}/><span>AU-Partimer</span></Link>
    <nav><Link href="/">{language==="zh"?"工作区":"Workspace"}</Link><Link href="/about">{language==="zh"?"能力与验证":"Capabilities"}</Link>
      <button className="language-button" onClick={()=>setLanguage(language==="zh"?"en":"zh")} aria-label={language==="zh"?"Switch to English":"切换中文"}><Languages size={16}/>{language==="zh"?"English":"中文"}</button>
    </nav></header>;
}
