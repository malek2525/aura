import React, { useEffect, useRef, useState } from 'react';
import { AuraProfile, AuraState } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { buildAuraPersonaDescription } from '../services/auraLLM';

interface LiveVoiceModeProps {
  profile: AuraProfile;
  auraState: AuraState;
  setAuraState: (state: AuraState) => void;
  onExit: () => void;
}

const LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";

export const LiveVoiceMode: React.FC<LiveVoiceModeProps> = ({ profile, auraState, setAuraState, onExit }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [volume, setVolume] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  
  // State for playback
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let sessionPromise: Promise<any> | null = null;
    const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || "" });

    const startSession = async () => {
      try {
        // Init Audio Context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 16000 }); // Input usually 16k
        audioContextRef.current = ctx;
        
        // Output context for playback (higher quality)
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
            systemInstruction: `You are Aura, an AI twin for an introverted user. ${persona} Speak naturally, be supportive, and keep responses concise.`,
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
                
                // Simple volume meter
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(prev => prev * 0.8 + rms * 10 * 0.2); // Smooth volume

                // Send to Gemini
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
                // Update Mood based on activity
                setAuraState({ ...auraState, moodIntensity: Math.min(1, auraState.moodIntensity + 0.1) });

                // Playback
                if (outCtx.state === 'suspended') await outCtx.resume();
                
                const buffer = await decodeAudioData(decode(audioData), outCtx);
                
                const src = outCtx.createBufferSource();
                src.buffer = buffer;
                src.connect(outNode);
                
                const now = outCtx.currentTime;
                // Schedule next chunk
                const startTime = Math.max(now, nextStartTimeRef.current);
                src.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
                
                sourcesRef.current.add(src);
                src.onended = () => sourcesRef.current.delete(src);
              }

              if (msg.serverContent?.interrupted) {
                // Stop all current audio
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
      // Cleanup
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      inputProcessorRef.current?.disconnect();
      audioContextRef.current?.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, []);

  // --- Audio Helpers ---
  
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
    const b64 = btoa(binary);
    return {
      data: b64,
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
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/80 backdrop-blur-2xl absolute inset-0 z-50 rounded-3xl animate-fadeIn">
      
      {/* Visualizer Circle */}
      <div className="relative mb-8">
        <div 
          className="w-40 h-40 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 blur-md opacity-80 flex items-center justify-center transition-all duration-75"
          style={{ transform: `scale(${1 + volume * 2})` }}
        />
        <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse-slow" />
      </div>

      <h2 className="text-2xl font-light text-white mb-2">Live Voice Mode</h2>
      <p className="text-slate-400 text-sm mb-8 animate-pulse">{status}</p>

      <button 
        onClick={onExit}
        className="px-8 py-3 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all"
      >
        End Session
      </button>
    </div>
  );
};
