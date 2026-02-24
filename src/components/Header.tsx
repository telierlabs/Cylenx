import { Sparkles } from "lucide-react";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-black/5 backdrop-blur-md sticky top-0 z-10 bg-white/80">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="flex flex-col gap-1.5 p-2 hover:bg-black/5 rounded-xl transition-all group"
        >
          <div className="w-6 h-0.5 bg-black rounded-full group-hover:w-4 transition-all" />
          <div className="w-4 h-0.5 bg-black rounded-full group-hover:w-6 transition-all" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-medium text-lg tracking-tight">Cylen AI</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-semibold text-black/40">
          Minimalist Assistant
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </header>
  );
}
