import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import ai from '../lib/ai';

export function useChat() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      if (!ai) throw new Error('AI not initialized');

      let responseText = '';
      let responseImageUrl = '';

      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/png' } },
              { text: currentInput || 'Tolong analisis gambar ini.' },
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
          model: "gemini-2.0-flash",
          contents: currentInput,
        });
        responseText = response.text || "Maaf, saya tidak bisa memproses permintaan tersebut.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        type: responseImageUrl ? 'image' : 'text',
        imageUrl: responseImageUrl || undefined,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error:", error);
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

  return {
    messages,
    input,
    setInput,
    isLoading,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    messagesEndRef,
  };
}
