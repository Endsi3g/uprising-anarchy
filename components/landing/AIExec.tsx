"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function AIExec() {
  return (
    <section className="py-32 bg-[#0A0A0A] text-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Uprising AI Exec
            </div>
            
            <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
              Meet your new <br /> <span className="text-white/40">Chief of Operations.</span>
            </h2>
            
            <p className="text-xl text-white/50 mb-10 leading-relaxed max-w-lg">
              The first AI agent built specifically for agency scale. It manages your pipeline, personalizes your outreach, and ensures your talent stays productive—all while you focus on the big picture.
            </p>

            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium transition-all hover:scale-105">
              Talk to the AI Exec
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            {/* AI Console Mockup */}
            <div className="w-full max-w-md mx-auto aspect-square bg-[#111] rounded-[40px] border border-white/10 p-8 flex flex-col shadow-2xl">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-[10px] text-white/20 font-mono">EXEC_SESSION_01</div>
               </div>

               <div className="flex-1 space-y-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-xs">A</div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-white/80">
                      I've analyzed the new lead: <span className="text-blue-400">CreativeFlow Studio</span>. 
                      Preparing personalized outreach based on their recent award.
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs italic">K</div>
                    <div className="bg-blue-500/10 p-4 rounded-2xl rounded-tr-none border border-blue-500/20 text-sm text-white/80">
                      Run it. Let's aim for a discovery call by Friday.
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-xs">A</div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-white/80 animate-pulse">
                      Processing... Context mapping complete. Outreach sent. ⚡
                    </div>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-white/40">Success rate: <span className="text-green-500">92%</span></div>
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                    <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                  </div>
               </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-10 -right-10 p-4 rounded-3xl bg-[#007AFF]/20 border border-[#007AFF]/30 backdrop-blur-xl">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center">🎯</div>
                 <div>
                   <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Efficiency</p>
                   <p className="text-lg font-medium">9.2x faster</p>
                 </div>
               </div>
            </div>
          </motion.div>
          
          {/* Background Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/5 rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
