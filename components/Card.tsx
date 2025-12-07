"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  onClick,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-lg p-8 cursor-pointer ${className}`}
      whileHover={hover && onClick ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}


