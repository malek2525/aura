import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface TTSRequestBody {
  text: string;
  voice?: string;
}

interface GoogleTTSRequest {
  input: { text: string };
  voice: {
    languageCode: string;
    name: string;
    ssmlGender: string;
  };
  audioConfig: {
    audioEncoding: string;
    speakingRate: number;
    pitch: number;
    volumeGainDb: number;
  };
}

interface GoogleTTSResponse {
  audioContent: string;
}

app.post('/api/tts', async (req: Request<{}, {}, TTSRequestBody>, res: Response) => {
  try {
    const { text, voice } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_TTS_API_KEY not set');
      res.status(500).json({ error: 'TTS service not configured' });
      return;
    }

    const voiceName = voice || 'en-US-Neural2-H';

    const ttsRequest: GoogleTTSRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceName,
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 2.0,
        volumeGainDb: 0
      }
    };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ttsRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google TTS API error:', response.status, errorData);
      res.status(response.status).json({ 
        error: 'TTS API error', 
        details: errorData 
      });
      return;
    }

    const data: GoogleTTSResponse = await response.json();

    const audioBuffer = Buffer.from(data.audioContent, 'base64');

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'no-cache'
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', ttsConfigured: !!process.env.GOOGLE_TTS_API_KEY });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TTS server running on port ${PORT}`);
  console.log(`TTS API configured: ${!!process.env.GOOGLE_TTS_API_KEY}`);
});
