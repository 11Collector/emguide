"use client";

import { Home, CheckSquare, Briefcase, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "HOME" },
  { href: "/daily", icon: CheckSquare, label: "DAILY" },
  { href: "/2yrs", icon: Briefcase, label: "CASE" },
  { href: "/follow-up", icon: Users, label: "FOLLOW UP" },
  { href: "/new-comers", icon: UserPlus, label: "NEW COMERS" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#060B19]/95 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1.5 min-w-[50px]"
            >
              <div className="relative">
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-[#D4AF37]" : "text-slate-400 hover:text-slate-300"
                  )}
                />
              </div>
              <span className={cn(
                "text-[10px] font-bold transition-all duration-300",
                isActive ? "text-[#D4AF37]" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
