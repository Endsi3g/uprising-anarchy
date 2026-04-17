"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { GithubCommit } from "@/lib/github";

interface ChangelogListProps {
  commits: GithubCommit[];
}

export function ChangelogList({ commits }: ChangelogListProps) {
  return (
    <div className="relative border-l border-white/10 ml-4 pl-10 space-y-12">
      {commits.map((commit, index) => (
        <motion.div
          key={commit.sha}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="relative"
        >
          {/* Dot */}
          <div className="absolute left-[-45px] top-2 w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_10px_rgba(0,122,255,0.5)]" />
          
          <div className="flex items-center gap-3 text-sm text-white/40 mb-2">
            <span className="font-mono">{commit.sha.substring(0, 8)}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(commit.commit.author.date), { addSuffix: true })}</span>
            <span>•</span>
            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-tighter text-[10px]">Commit</span>
          </div>

          <h3 className="text-xl font-medium text-white/90 mb-3 whitespace-pre-wrap leading-snug">
            {commit.commit.message}
          </h3>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] border border-white/20">
              {commit.commit.author.name.charAt(0)}
            </div>
            <span className="text-sm text-white/40">{commit.commit.author.name} pushed a change</span>
          </div>
        </motion.div>
      ))}

      {commits.length === 0 && (
        <div className="py-20 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">
          No recent activity detected. Connect your GitHub PAT to see the live feed.
        </div>
      )}
    </div>
  );
}
