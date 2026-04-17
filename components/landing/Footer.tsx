"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Subscribed! Get ready for the next push. ⚡");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white px-6 py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl font-bold mb-6">Uprising Anarchy</h3>
            <p className="text-white/50 text-lg max-w-sm mb-8 leading-relaxed">
              The Sovereign Agency OS. Building the infrastructure for the next generation of creative empires.
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md">
              <p className="text-sm font-bold text-[#007AFF] uppercase tracking-widest mb-3">Subscribe to the Changelog</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="name@agency.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-full px-6 focus:ring-[#007AFF]"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6"
                >
                  {loading ? "..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-white/50">
              <li><Link href="#product" className="hover:text-white transition-colors">Product</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-4 text-white/50">
              <li><Link href="https://x.com" className="hover:text-white transition-colors">Twitter (X)</Link></li>
              <li><Link href="https://github.com" className="hover:text-white transition-colors">GitHub</Link></li>
              <li><Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link></li>
              <li><Link href="mailto:hello@uprising.anarchy" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
          <p>© 2026 Uprising Anarchy by Uprising Studio MTL. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
