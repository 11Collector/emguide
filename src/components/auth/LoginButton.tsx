"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function LoginButton() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={signInWithGoogle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-all"
      >
        <LogIn size={13} />
        Login
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all"
      >
        {user.photoURL ? (
          <Image src={user.photoURL} alt="avatar" width={18} height={18} className="rounded-full" />
        ) : (
          <User size={13} />
        )}
        <span className="max-w-[80px] truncate">{user.displayName?.split(" ")[0]}</span>
        <ChevronDown size={11} />
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 top-full mt-2 bg-[#0F172A] border border-white/10 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 min-w-[160px]"
            >
              <p className="text-[10px] text-slate-400 mb-2 px-1 truncate">{user.email}</p>
              <button
                onClick={() => { logout(); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={13} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
