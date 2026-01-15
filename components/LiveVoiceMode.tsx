import React, { useEffect, useRef, useState } from 'react';
import { UserProfile, AuraState } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { buildAuraPersonaDescription } from '../services/auraLLM';
import { Icons } from './Icons';

interface LiveVoiceModeProps {
  profile: UserProfile;
  auraState?: AuraState;
  setAuraState?: (state: AuraState) => void;
  onExit: () => void;
}

const LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";

export const LiveVoiceMode: React.FC<LiveVoiceModeProps> = ({ profile, auraState, setAuraState, onExit }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [volume, setVolume] = useState(0);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    let sessionPromise: Promise<any> | null = null;
    
    // Note: In production, API Key should come from env or secure backend proxy
    const apiKey = process.env.API_KEY || ""; 
    
    if (!apiKey) {
      setStatus("API Key Missing");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const startSession = async () => {
      try {
        // Init Audio Context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 16000 });
        audioContextRef.current = ctx;
        
        // Output context (higher quality)
        const outCtx = new AudioContextClass({ sampleRate: 24000 });
        const outNode = outCtx.createGain();
        outNode.connect(outCtx.destination);
        outputNodeRef.current = outNode;

        // Get Microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const persona = buildAuraPersonaDescription(profile);

        sessionPromise = ai.live.connect({
          model: LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: persona,
          },
          callbacks: {
            onopen: () => {
              setIsActive(true);
              setStatus("Listening");
              
              // Setup Input Processing
              const source = ctx.createMediaStreamSource(stream);
              const processor = ctx.createScriptProcessor(4096, 1, 1);
              inputProcessorRef.current = processor;

              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Volume meter calculation
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(prev => prev * 0.8 + rms * 10 * 0.2); 

                const pcmBlob = createBlob(inputData);
                sessionPromise?.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(processor);
              processor.connect(ctx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData) {
                if (outCtx.state === 'suspended') await outCtx.resume();
                
                const buffer = await decodeAudioData(decode(audioData), outCtx);
                const src = outCtx.createBufferSource();
                src.buffer = buffer;
                src.connect(outNode);
                
                const now = outCtx.currentTime;
                const startTime = Math.max(now, nextStartTimeRef.current);
                src.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
                
                sourcesRef.current.add(src);
                src.onended = () => sourcesRef.current.delete(src);
              }

              if (msg.serverContent?.interrupted) {
                sourcesRef.current.forEach(src => src.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => {
              setStatus("Disconnected");
              setIsActive(false);
            },
            onerror: (err) => {
              console.error("Live Error", err);
              setStatus("Connection Error");
            }
          }
        });

      } catch (e) {
        console.error("Setup failed", e);
        setStatus("Microphone Error");
      }
    };

    startSession();

    return () => {
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      inputProcessorRef.current?.disconnect();
      audioContextRef.current?.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [profile]);

  function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  return (
    <div className="fixed inset-0 z-50 bg-warm-white flex flex-col items-center justify-center animate-in fade-in">
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-light/20 to-sage-light/20"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Visualizer */}
        <div className="relative mb-12">
          <div 
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-coral to-gold blur-xl opacity-60 transition-all duration-75 ease-out"
            style={{ transform: `scale(${1 + volume * 2})` }}
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full border border-white/50 flex items-center justify-center shadow-soft">
             <Icons.Sparkles size={48} className="text-coral animate-pulse-slow" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-main mb-2">Aura Live</h2>
        <p className="text-text-sec text-sm mb-12 font-medium bg-white/50 px-4 py-1 rounded-full border border-warm-gray">
           {status}
        </p>

        <button 
          onClick={onExit}
          className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-105"
        >
          <Icons.X size={32} />
        </button>
      </div>
    </div>
  );
};
