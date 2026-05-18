"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function LoginButton() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowMenu(false);
    await logout();
    setIsLoggingOut(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  if (!user) {
    return (
      <>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={signInWithGoogle}
          className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
          title="Login"
        >
          <LogIn size={16} />
        </motion.button>

        {/* Logged out toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-[#0F172A] border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-sm font-medium text-slate-300 whitespace-nowrap"
            >
              <CheckCircle2 size={16} className="text-blue-400" />
              Logged out แล้ว
            </motion.div>
          )}
        </AnimatePresence>
      </>
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
              className="absolute right-0 top-full mt-2 bg-[#0F172A] border border-white/10 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 min-w-[160px]"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-2.5 px-1 mb-3">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="avatar" width={32} height={32} className="rounded-full shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <User size={16} className="text-blue-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.displayName?.split(" ")[0]}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  <motion.div
                    animate={isLoggingOut ? { rotate: 360 } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  >
                    <LogOut size={13} />
                  </motion.div>
                  {isLoggingOut ? "กำลัง Logout..." : "Logout"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
