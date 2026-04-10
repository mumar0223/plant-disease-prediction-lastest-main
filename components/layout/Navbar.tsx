"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="relative bg-[var(--card)] border-b border-[var(--border)] h-16 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline px-6 mx-2">
        <div className="w-9 h-9 bg-[var(--leaf)] rounded-lg flex items-center justify-center">
          <Leaf className="size-5 text-white" />
        </div>
        <span className="font-[var(--font-serif)] text-[19px] font-semibold text-[var(--leaf)] tracking-tight">
          AgroVision
        </span>
      </Link>

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="flex items-center gap-4">
          {/* Links */}
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                      isActive
                        ? "bg-[var(--leaf-light)] text-[var(--leaf)]"
                        : "text-[var(--ink2)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <Link
            href="/diagnose"
            className={`flex items-center px-5 py-2.5 rounded-md text-[14px] font-medium transition-all ${
              pathname === "/diagnose"
                ? "bg-[var(--leaf)] text-white"
                : "bg-[var(--leaf)] text-white hover:bg-[#2d5518]"
            }`}
          >
            Diagnose Plant
          </Link>
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-[var(--bg)] transition"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[var(--card)] border-b border-[var(--border)] p-5 flex flex-col gap-4 shadow-md">
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-[15px] font-medium px-4 py-3 rounded-md ${
                      isActive
                        ? "bg-[var(--leaf-light)] text-[var(--leaf)]"
                        : "text-[var(--ink2)] bg-[var(--bg)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/diagnose"
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-[var(--leaf)] text-white text-[15px] font-medium rounded-md px-4 py-3"
          >
            Diagnose Plant
          </Link>
        </div>
      )}
    </nav>
  );
}
