
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants.tsx';
import { initGeminiLive, createPcmBlob, decode, decodeAudioData } from '../services/gemini.ts';

interface VoiceAssistantProps {
  onAITranscription: (text: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onAITranscription }) => {
  const [isActive, setIsActive] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (!inputContextRef.current) {
        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = initGeminiLive({
        onAudio: async (base64Audio) => {
          if (!audioContextRef.current) return;
          const ctx = audioContextRef.current;
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
          
          const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          
          source.onended = () => sourcesRef.current.delete(source);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          sourcesRef.current.add(source);
        },
        onInterrupted: () => {
          sourcesRef.current.forEach(s => {
            try { s.stop(); } catch(e) {}
          });
          sourcesRef.current.clear();
          nextStartTimeRef.current = 0;
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);

      const source = inputContextRef.current.createMediaStreamSource(stream);
      const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (!isActive) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        sessionRef.current.sendRealtimeInput({ media: pcmBlob });
      };

      source.connect(processor);
      processor.connect(inputContextRef.current.destination);

    } catch (error) {
      console.error("Failed to start Gemini Live:", error);
      setIsActive(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    if (sessionRef.current) {
      sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e) {}
      });
      sourcesRef.current.clear();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isActive ? stopSession : startSession}
        className={`p-3 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
        }`}
        title={isActive ? "Stop Voice Assistant" : "Talk to Gemini"}
      >
        {isActive ? <ICONS.Stop /> : <ICONS.Mic />}
      </button>
      {isActive && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-900/40 rounded-full border border-indigo-500/30 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
          <span className="text-xs font-medium text-indigo-200">Gemini Active</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
