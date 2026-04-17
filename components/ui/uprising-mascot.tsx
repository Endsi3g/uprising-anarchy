"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UprisingMascotProps {
  className?: string;
  size?: number;
  state?: "idle" | "active" | "success" | "error";
}

export const UprisingMascot: React.FC<UprisingMascotProps> = ({
  className,
  size = 64,
  state = "idle",
}) => {
  const containerSize = size;
  const strokeWidth = size / 24;

  const variants = {
    idle: {
      scale: 1,
      opacity: 0.8,
    },
    active: {
      scale: 1.1,
      opacity: 1,
    },
    success: {
      scale: [1, 1.4, 1],
      opacity: 1,
    },
    error: {
      scale: [1, 0.9, 1],
      opacity: 0.6,
    },
  };

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: containerSize, height: containerSize }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={state}
        variants={variants}
        className="w-full h-full drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
      >
        {/* Outer Ring - Rotating Hexagon */}
        <motion.path
          d="M50 5 L88.97 27.5 V72.5 L50 95 L11.03 72.5 V27.5 L50 5Z"
          stroke="currentColor"
          strokeWidth={strokeWidth / 2}
          strokeOpacity={0.2}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Middle Ring - Pulsing Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.4}
          strokeDasharray="10 5"
          animate={{
            rotate: -360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Inner Core - Breathing Diamond */}
        <motion.path
          d="M50 30 L70 50 L50 70 L30 50 Z"
          fill="currentColor"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />

        {/* Orbiting Particles */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="0.1 19.9"
          strokeLinecap="round"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glow Filters */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>
      
      {/* Underlying Glow Layer */}
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 opacity-20 animate-pulse" />
    </div>
  );
};
