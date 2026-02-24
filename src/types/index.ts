export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  timestamp: Date;
};

export type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
};
