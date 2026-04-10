"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-8 flex flex-col items-center justify-center text-center bg-[var(--bg2)] border-t border-[var(--border)]">
      <div className="font-[var(--font-serif)] text-[22px] font-bold text-[var(--leaf)] mb-4">
        AgroVision
      </div>
      <p className="text-[15px] text-[var(--ink2)] max-w-sm mb-6 leading-relaxed font-light">
        AI-powered plant disease detection for farmers, researchers,
        <br className="hidden md:block" />
        and agricultural professionals worldwide.
      </p>
      
      <ul className="flex flex-wrap justify-center gap-6 list-none m-0 p-0 mb-8">
        <li><Link href="/" className="text-[14px] font-medium text-[var(--ink3)] hover:text-[var(--leaf)] transition-colors">Home</Link></li>
        <li><Link href="/about" className="text-[14px] font-medium text-[var(--ink3)] hover:text-[var(--leaf)] transition-colors">About</Link></li>
        <li><Link href="/diagnose" className="text-[14px] font-medium text-[var(--ink3)] hover:text-[var(--leaf)] transition-colors">Diagnose</Link></li>
      </ul>
      
      <div className="text-[13px] text-[var(--ink3)] font-light border-t border-[rgba(60,50,30,0.06)] pt-6 w-full max-w-md">
        © {new Date().getFullYear()} AgroVision. Built with deep learning for food security.
      </div>
    </footer>
  );
}
