
import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface.tsx';
import { User } from './types.ts';
import { USER_COLORS } from './constants.tsx';

const App: React.FC = () => {
  const [room, setRoom] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [roomInput, setRoomInput] = useState('');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash) setRoom(hash);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !roomInput.trim()) return;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: nameInput.trim(),
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    };

    setUser(newUser);
    setRoom(roomInput.trim());
    window.location.hash = roomInput.trim();
  };

  if (!user || !room) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent_50%)]"></div>
        
        <div className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-2xl shadow-indigo-500/40">
              <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Nexus Chat</h1>
            <p className="text-slate-400 font-medium">Conecte-se instantaneamente em qualquer lugar.</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Seu Nome</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all focus:bg-slate-900"
                placeholder="Como quer ser chamado?"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ID da Sala</label>
              <input
                type="text"
                required
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all focus:bg-slate-900"
                placeholder="Ex: amigos-vip"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] mt-4"
            >
              Entrar no Portal
            </button>
          </form>

          <div className="pt-8 mt-8 border-t border-slate-800 text-center">
             <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
               Powered by Gemini 2.5 Flash & Broadcast Sync
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 h-screen w-full overflow-hidden">
      <ChatInterface room={room} user={user} />
    </div>
  );
};

export default App;
