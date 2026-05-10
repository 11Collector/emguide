"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeDeleteWrapperProps {
  children: React.ReactNode;
  onDelete: () => void;
  roundedClass?: string;
  className?: string;
}

export function SwipeDeleteWrapper({ 
  children, 
  onDelete, 
  roundedClass = "rounded-3xl",
  className
}: SwipeDeleteWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -60) {
      setIsOpen(true);
      controls.start({ x: -80 });
    } else {
      setIsOpen(false);
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={cn("relative group w-full", className)}>
      {/* Delete Background Button */}
      <button 
        onClick={() => {
          if (isOpen) {
             onDelete();
             setIsOpen(false);
             controls.start({ x: 0 });
          }
        }}
        className={cn(
          "absolute right-2 top-2 bottom-2 w-24 bg-red-500 flex items-center justify-end px-4 text-white touch-none",
          roundedClass
        )}
      >
        <div className="flex flex-col items-center">
          <Plus className="rotate-45" size={24} />
          <span className="text-[10px] font-bold uppercase">Delete</span>
        </div>
      </button>

      {/* Foreground Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: isOpen ? -80 : -100, right: 0 }}
        dragElastic={0.1}
        animate={controls}
        onDragEnd={handleDragEnd}
        onClick={() => {
          // Close if they tap the card while it's open
          if (isOpen) {
            setIsOpen(false);
            controls.start({ x: 0 });
          }
        }}
        className="relative z-10 touch-pan-y w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
