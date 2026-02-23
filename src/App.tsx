/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Image as ImageIcon, 
  User, 
  Bot, 
  Loader2, 
  X,
  Sparkles,
  Search,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import Markdown from 'react-markdown';
import { cn } from './lib/utils';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  timestamp: Date;
};

type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo, saya Cylen AI. Ada yang bisa saya bantu hari ini?',
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock History
  const [history] = useState<ChatHistory[]>([
    { id: '1', title: 'Diskusi Desain Minimalis', lastMessage: 'Bagaimana menurutmu...', timestamp: new Date() },
    { id: '2', title: 'Analisis Gambar Kucing', lastMessage: 'Gambar ini menunjukkan...', timestamp: new Date(Date.now() - 86400000) },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: selectedImage ? 'image' : 'text',
      imageUrl: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let responseText = '';
      let responseImageUrl = '';

      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: 'image/png',
                },
              },
              {
                text: currentInput || 'Tolong analisis atau edit gambar ini sesuai instruksi saya.',
              },
            ],
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            responseImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            responseText += part.text;
          }
        }
      } else {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: currentInput,
        });
        responseText = response.text || "Maaf, saya tidak bisa memproses permintaan tersebut.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        type: responseImageUrl ? 'image' : 'text',
        imageUrl: responseImageUrl || undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan saat menghubungi server.',
        type: 'text',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden">
      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full bg-white z-50 flex flex-col shadow-2xl"
            >
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
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Search History */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input 
                    type="text" 
                    placeholder="Cari percakapan..." 
                    className="w-full pl-10 pr-4 py-3 bg-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all"
                  />
                </div>

                {/* History List */}
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

              {/* Profile Section */}
              <div className="p-6 border-t border-black/5 bg-black/2">
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-black/5 backdrop-blur-md sticky top-0 z-10 bg-white/80">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
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
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-semibold text-black/40">Minimalist Assistant</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-0">
        <div className="max-w-3xl mx-auto space-y-12">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
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
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
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
            ))}
          </AnimatePresence>
          {isLoading && (
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
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
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
            onSubmit={handleSendMessage}
            className={cn(
              "relative flex items-end gap-2 p-2 rounded-3xl border transition-all duration-300",
              isDragging ? "border-black bg-black/5" : "border-black/10 bg-white shadow-sm hover:border-black/20"
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
                  handleSendMessage();
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

