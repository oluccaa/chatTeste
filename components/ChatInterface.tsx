
import React, { useState, useEffect, useRef } from 'react';
import { Message, User } from '../types';
import { ICONS, USER_COLORS } from '../constants';
import { ChatService } from '../services/communication';
import VoiceAssistant from './VoiceAssistant';

const ChatInterface: React.FC<{ room: string; user: User }> = ({ room, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatServiceRef = useRef<ChatService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatServiceRef.current = new ChatService(room);
    chatServiceRef.current.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Add initial system message
    const welcome: Message = {
      id: 'system-' + Date.now(),
      senderId: 'system',
      senderName: 'System',
      text: `${user.name} joined the room "${room}". Open this same URL in another tab to chat!`,
      timestamp: Date.now(),
      type: 'system'
    };
    setMessages([welcome]);

    return () => chatServiceRef.current?.close();
  }, [room, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: inputText.trim(),
      timestamp: Date.now(),
      type: 'text'
    };

    chatServiceRef.current?.sendMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto glass shadow-2xl overflow-hidden border-x border-slate-700/50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ICONS.Users />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Room: {room}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 
               Online as {user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <VoiceAssistant onAITranscription={() => {}} />
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <ICONS.Settings />
          </button>
        </div>
      </header>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(circle_at_top_right,rgba(30,41,59,0.3),transparent)]"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          const isSystem = msg.type === 'system';
          
          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="px-3 py-1 bg-slate-800/50 rounded-full text-[10px] uppercase tracking-wider font-semibold text-slate-400 border border-slate-700/30">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                 {!isMe && <span className="text-xs font-semibold text-indigo-400">{msg.senderName}</span>}
                 <span className="text-[10px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                isMe 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-slate-900/80 border-t border-slate-700/50">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-2xl p-2 border border-slate-700/50 focus-within:border-indigo-500/50 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-slate-100"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/10"
          >
            <ICONS.Send />
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-slate-500 italic">
          Nexus Chat uses BroadcastChannel for multi-tab local sync. Try opening this room in another window!
        </p>
      </footer>
    </div>
  );
};

export default ChatInterface;
