import { useState } from 'react';
import { AnimatePresence } from "motion/react";
import { ChatHistory } from './types';
import { useChat } from './hooks/useChat';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';

const MOCK_HISTORY: ChatHistory[] = [
  { id: '1', title: 'Diskusi Desain Minimalis', lastMessage: 'Bagaimana menurutmu...', timestamp: new Date() },
  { id: '2', title: 'Analisis Gambar Kucing', lastMessage: 'Gambar ini menunjukkan...', timestamp: new Date(Date.now() - 86400000) },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    isLoading,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    messagesEndRef,
  } = useChat();

  return (
    <div className="fixed inset-0 flex flex-col bg-white text-black selection:bg-black selection:text-white">
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={MOCK_HISTORY}
      />

      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-0">
        <div className="max-w-3xl mx-auto space-y-12">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onSend={handleSendMessage}
      />
    </div>
  );
}
