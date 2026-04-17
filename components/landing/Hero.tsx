"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-black text-white">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tight mb-8">
            The Sovereign <br /> 
            <span className="text-white/60">Agency OS.</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Own your agency, your talent, and your data. <br className="hidden md:block" />
            Empowering the next generation of creative entrepreneurs with AI-driven operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Button className="bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-full px-8 py-6 text-lg font-medium">
            Get Started
          </Button>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-medium backdrop-blur-sm">
            Watch the Tour
          </Button>
        </motion.div>

        {/* Visual Showcase - Surrogate for the 3D Phone */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          <div className="aspect-[16/10] bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-[32px] overflow-hidden">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[31px] relative overflow-hidden flex items-center justify-center">
               {/* Dashboard Mockup Placeholder */}
               <div className="absolute inset-0 opacity-40 bg-[url('https://cdn.prod.website-files.com/68acbc076b672f730e0c77b9/68bc218cd8c4f0f2596f21eb_external-link.svg')] bg-center bg-no-repeat bg-contain" />
               <div className="flex flex-col items-center gap-6 z-10 px-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-2">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white/80">Uprising AI Exec Operating...</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1.5 w-8 rounded-full bg-blue-500/40" />
                    ))}
                  </div>
               </div>
               
               {/* Floating elements */}
               <div className="absolute top-12 left-12 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center text-xs">↑</div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Growth</p>
                      <p className="text-lg font-medium">+142%</p>
                    </div>
                  </div>
               </div>
               
               <div className="absolute bottom-12 right-12 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs">AI</div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Agent Action</p>
                      <p className="text-sm font-medium">Secured $12k Contract</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
