import { User, Settings, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-6 border-t border-black/5">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-black text-white shadow-lg">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">User Premium</h4>
          <p className="text-[10px] text-white/50 truncate">user@cylen.ai</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
      <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
