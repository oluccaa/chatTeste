
import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface.tsx';
import { User } from './types.ts';
import { USER_COLORS } from './constants.tsx';

const App: React.FC = () => {
  const [room, setRoom] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [roomInput, setRoomInput] = useState('');

  // Handle Hash Routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setRoom(hash);
      }
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
      name: nameInput,
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    };

    setUser(newUser);
    setRoom(roomInput);
    window.location.hash = roomInput;
  };

  if (!user || !room) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="max-w-md w-full glass p-8 rounded-3xl shadow-2xl border border-white/5 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-500/20">
              <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Nexus Chat</h1>
            <p className="mt-2 text-slate-400">Join a room and start chatting in real-time across the world.</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. Satoshi"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Room ID</label>
              <input
                type="text"
                required
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. global-hq"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              Join Portal
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
             <p className="text-xs text-slate-500">
               Integrated with Gemini 2.5 Flash Live for voice-enabled smart conversation.
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen w-full overflow-hidden">
      <ChatInterface room={room} user={user} />
    </div>
  );
};

export default App;
