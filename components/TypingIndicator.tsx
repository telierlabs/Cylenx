import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-4 md:gap-6"
    >
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      </div>
      <div className="bg-black/5 px-5 py-3 rounded-2xl rounded-tl-none">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </motion.div>
  );
}
