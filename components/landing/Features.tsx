"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Client Operations",
    description: "Automate billing, contracts, and project sequencing with millisecond precision.",
    icon: "💎",
    color: "from-blue-500/20 to-transparent",
  },
  {
    title: "Talent Management",
    description: "Coordinate your global talent pool. Track availability, skills, and output in real-time.",
    icon: "📈",
    color: "from-violet-500/20 to-transparent",
  },
  {
    title: "AI Strategy",
    description: "Deploy autonomous agents to qualify leads and personalize outreach while you sleep.",
    icon: "🤖",
    color: "from-cyan-500/20 to-transparent",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-black text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Designed for the <br /> modern entrepreneur.</h2>
          <p className="text-white/50 text-xl max-w-xl">
            Everything you need to orchestrate a high-performance agency without the overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative p-8 rounded-[32px] bg-white/5 border border-white/10 overflow-hidden"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.color)} />
              
              <div className="relative z-10">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
