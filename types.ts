
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'text' | 'system' | 'ai';
}

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface ChatState {
  room: string;
  messages: Message[];
  currentUser: User | null;
}
