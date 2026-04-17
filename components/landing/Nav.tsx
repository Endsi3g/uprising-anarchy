"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled 
          ? "bg-black/80 backdrop-blur-md border-b border-white/10" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Uprising Anarchy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-white/70 text-sm font-medium">
            <Link href="#product" className="hover:text-white transition-colors">Product</Link>
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/changelog" className="hover:text-white transition-colors flex items-center gap-1.5">
              Changelog
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white">New</span>
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
