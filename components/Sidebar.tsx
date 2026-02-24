import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Search, ChevronRight } from "lucide-react";
import { ChatHistory } from "../types";
import { formatTimestamp } from "../lib/utils";
import Profile from "./Profile";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  history: ChatHistory[];
};

export default function Sidebar({ isOpen, onClose, history }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header Sidebar */}
            <div className="p-6 flex items-center justify-between border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Cylen AI</h2>
                  <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">History & Profile</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  className="w-full pl-10 pr-4 py-3 bg-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all"
                />
              </div>

              {/* History */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/30 px-2">Recent Chats</h3>
                <div className="space-y-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-black/5 transition-all text-left group"
                    >
                      <div className="w-2 h-2 rounded-full bg-black/10 mt-2 group-hover:bg-black transition-colors" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.title}</h4>
                        <p className="text-xs text-black/40 truncate">{item.lastMessage}</p>
                        <p className="text-[10px] text-black/20 mt-1 font-mono">{formatTimestamp(item.timestamp)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-black/10 group-hover:text-black transition-colors self-center" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <Profile />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
