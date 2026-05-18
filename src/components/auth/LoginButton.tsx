"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function LoginButton() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={signInWithGoogle}
        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
        title="Login"
      >
        <LogIn size={16} />
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="w-7 h-7 rounded-full overflow-hidden border border-blue-400/40 hover:border-blue-400 transition-all"
        title={user.displayName || ""}
      >
        {user.photoURL ? (
          <Image src={user.photoURL} alt="avatar" width={28} height={28} className="rounded-full" />
        ) : (
          <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
            <User size={14} className="text-blue-400" />
          </div>
        )}
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
              className="absolute right-0 top-full mt-2 bg-[#0F172A] border border-white/10 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 min-w-[150px]"
            >
              <p className="text-[10px] text-slate-500 mb-2 px-1 truncate">{user.email}</p>
              <button
                onClick={() => { logout(); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
