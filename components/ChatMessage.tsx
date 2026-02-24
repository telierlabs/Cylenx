import { motion } from "motion/react";
import { User, Bot } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "../types";
import { cn, formatTimestamp } from "../lib/utils";

type ChatMessageProps = {
  msg: Message;
};

export default function ChatMessage({ msg }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 md:gap-6",
        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
        msg.role === 'user' ? "bg-black/5" : "bg-black"
      )}>
        {msg.role === 'user'
          ? <User className="w-4 h-4" />
          : <Bot className="w-4 h-4 text-white" />
        }
      </div>

      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%]",
        msg.role === 'user' ? "items-end" : "items-start"
      )}>
        <p className="text-[9px] font-mono text-black/20 mb-1 uppercase tracking-tighter">
          {formatTimestamp(msg.timestamp)}
        </p>
        {msg.imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
            <img
              src={msg.imageUrl}
              alt="Uploaded content"
              className="max-w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        {msg.content && (
          <div className={cn(
            "px-5 py-3 rounded-2xl text-sm leading-relaxed",
            msg.role === 'user'
              ? "bg-black text-white rounded-tr-none"
              : "bg-black/5 text-black rounded-tl-none"
          )}>
            <div className="markdown-body">
              <Markdown>{msg.content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
