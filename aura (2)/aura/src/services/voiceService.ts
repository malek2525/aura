const TTS_API_URL = '/api/tts';

interface TTSOptions {
  voice?: string;
}

export async function speakWithAuraTTS(
  text: string, 
  options: TTSOptions = {}
): Promise<HTMLAudioElement> {
  const response = await fetch(TTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice: options.voice || 'en-US-Neural2-H',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `TTS request failed: ${response.status}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };
  
  return audio;
}

export async function checkTTSHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return false;
    const data = await response.json();
    return data.ttsConfigured === true;
  } catch {
    return false;
  }
}

export default { speakWithAuraTTS, checkTTSHealth };
