import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

type ChatInputProps = {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  setSelectedImage: (val: string | null) => void;
  onSend: (e?: React.FormEvent) => void;
};

export default function ChatInput({
  input,
  setInput,
  isLoading,
  selectedImage,
  setSelectedImage,
  onSend,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <footer className="p-4 md:p-8 bg-white">
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-4 left-0"
            >
              <div className="relative group">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border-2 border-black shadow-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={onSend}
          className={cn(
            "relative flex items-end gap-2 p-2 rounded-3xl border transition-all duration-300",
            isDragging
              ? "border-black bg-black/5"
              : "border-black/10 bg-white shadow-sm hover:border-black/20"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onloadend = () => setSelectedImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-black/40 hover:text-black transition-colors rounded-2xl hover:bg-black/5"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ketik pesan atau drop gambar..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-32 min-h-[44px]"
            rows={1}
          />

          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={cn(
              "p-3 rounded-2xl transition-all duration-300",
              (input.trim() || selectedImage) && !isLoading
                ? "bg-black text-white shadow-md hover:scale-105 active:scale-95"
                : "bg-black/5 text-black/20 cursor-not-allowed"
            )}
          >
            {isLoading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Send className="w-5 h-5" />
            }
          </button>
        </form>
      </div>
    </footer>
  );
}
