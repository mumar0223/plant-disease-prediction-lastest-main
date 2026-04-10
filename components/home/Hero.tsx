"use client";

import Link from "next/link";
import { ArrowRight, CirclePlay } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-[var(--card)] border-b border-[var(--border)] pt-20 pb-16 px-8 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      <div className="inline-flex items-center gap-1.5 bg-[var(--leaf-light)] text-[var(--leaf)] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 bg-[var(--leaf-mid)] rounded-full animate-pulse mr-1" />
        Data-Driven Diagnosis
      </div>

      <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--ink)] leading-tight mb-5 tracking-tight max-w-3xl mx-auto">
        Detect <em className="text-[var(--leaf)] not-italic">Plant Diseases</em>
        <br />
        Before They Spread
      </h1>

      <p className="text-[17px] text-[var(--ink2)] max-w-xl mx-auto mb-10 leading-relaxed font-light">
        Upload a photo of any affected leaf. Our deep learning model identifies
        diseases instantly across 38 categories — built for farmers, gardeners,
        and agronomists.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/diagnose"
          className="inline-flex items-center gap-2 bg-[var(--leaf)] text-white border-none py-3.5 px-7 rounded-lg text-[15px] font-semibold cursor-pointer transition-all hover:bg-[#2d5518] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(58,107,30,0.3)]"
        >
          <CirclePlay size={18} fill="none" strokeWidth={2.5} />
          Start Diagnosis
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center bg-transparent text-[var(--ink)] border-[1.5px] border-[var(--border-strong)] py-3.5 px-6 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:bg-[var(--bg)] hover:border-[var(--ink3)]"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
