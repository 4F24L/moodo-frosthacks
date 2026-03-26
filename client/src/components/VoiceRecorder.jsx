import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, ShieldCheck, Upload, FileAudio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const VoiceRecorder = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [timer, setTimer] = useState(0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Real audio visualization
  useEffect(() => {
    if (isRecording) {
      const startAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
          
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }

          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          analyserRef.current.fftSize = 256;
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          const draw = () => {
            if (!analyserRef.current || !ctx) return;
            
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteTimeDomainData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate current volume for scaling
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              const amplitude = (dataArray[i] - 128) / 128;
              sum += amplitude * amplitude;
            }
            const rms = Math.sqrt(sum / bufferLength);
            const volumeScale = Math.max(0.1, rms * 5); // Boost for visibility

            // Draw multi-layered waves
            const drawWave = (color, opacity, amplitudeMultiplier, frequencyMultiplier, offset) => {
              ctx.beginPath();
              ctx.lineWidth = 2;
              ctx.strokeStyle = color;
              ctx.globalAlpha = opacity;

              for (let x = 0; x <= canvas.width; x += 2) {
                const normalizedX = x / canvas.width;
                // Sine wave combined with time-domain data for "real" jitter
                const dataIndex = Math.floor(normalizedX * bufferLength);
                const jitter = (dataArray[dataIndex] - 128) / 128;
                
                // Envelope to taper the ends
                const envelope = Math.sin(normalizedX * Math.PI);
                
                const y = (canvas.height / 2) + 
                          (Math.sin(normalizedX * Math.PI * frequencyMultiplier + offset + Date.now() * 0.005) * 
                           canvas.height * 0.4 * volumeScale * amplitudeMultiplier * envelope) +
                          (jitter * canvas.height * 0.2 * volumeScale * envelope);

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            };

            // Layer 1: Primary
            drawWave('var(--primary)', 0.3, 1.0, 2, 0);
            // Layer 2: Secondary
            drawWave('var(--primary)', 0.5, 0.7, 3, Math.PI / 2);
            // Layer 3: Accent
            drawWave('var(--primary)', 0.8, 0.5, 4, Math.PI);
            
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(var(--primary), 0.4)';
          };
          
          draw();

          timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
          }, 1000);
        } catch (err) {
          console.error("Error accessing microphone:", err);
          setIsRecording(false);
        }
      };
      startAudio();
    } else {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      clearInterval(timerRef.current);
      
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const processAudio = (source = 'recording') => {
    setIsProcessing(true);
    setIsRecording(false);
    setIsDragging(false);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onResult({
        text: source === 'upload' 
          ? "This is a simulated transcription from your uploaded audio file. It sounds like you're doing well."
          : "I've been feeling a bit overwhelmed lately with the new project, but I'm trying to stay positive.",
        sentiment: source === 'upload' ? 0.6 : -0.2,
        features: {
          pitch: source === 'upload' ? "210 Hz" : "185 Hz",
          energy: source === 'upload' ? "0.62 RMS" : "0.45 RMS",
          rate: source === 'upload' ? "155 wpm" : "140 wpm"
        },
        moodScore: source === 'upload' ? 7.8 : 4.5,
        source: source
      });
      setTimer(0);
    }, 2000);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      processAudio('recording');
    } else {
      setIsRecording(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudio('upload');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isRecording && !isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isRecording && !isProcessing) {
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('audio/')) {
        processAudio('upload');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "bg-card rounded-3xl p-6 md:p-8 shadow-sm border transition-all duration-300 flex flex-col items-center justify-center space-y-8 relative overflow-hidden",
        isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border"
      )}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-primary/10 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 bg-card rounded-3xl shadow-xl flex items-center justify-center mb-4">
              <Upload className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <p className="text-primary font-bold text-lg">Drop audio to analyze</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-display text-foreground">Voice Capture</h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
          Speak naturally, upload, or drag & drop a recording.
        </p>
      </div>

      {/* Mic Button Section */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.2 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-primary rounded-full"
              />
            )}
          </AnimatePresence>
          
          <button
            onClick={handleToggleRecording}
            disabled={isProcessing}
            className={cn(
              "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
              isRecording 
                ? "bg-destructive hover:bg-destructive/90 scale-110" 
                : "bg-primary hover:bg-primary/90 hover:scale-105",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
            ) : isRecording ? (
              <Square className="w-10 h-10 text-destructive-foreground fill-current" />
            ) : (
              <Mic className="w-10 h-10 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Timer & Status */}
      <div className="flex flex-col items-center gap-2">
        <span className={cn(
          "text-3xl font-mono font-bold",
          isRecording ? "text-destructive" : "text-muted-foreground/50"
        )}>
          {formatTime(timer)}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          {isProcessing ? "Analyzing Audio..." : isRecording ? "Recording Live" : "Ready to Record"}
        </span>
      </div>

      {/* Waveform Visualizer (Canvas) */}
      <div className="w-full h-24 flex items-center justify-center px-4 bg-muted rounded-2xl overflow-hidden border border-border/50">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={100} 
          className="w-full h-full"
        />
        {!isRecording && !isProcessing && (
          <div className="absolute flex items-center gap-1 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-4 bg-muted-foreground/30 rounded-full" />
            ))}
          </div>
        )}
      </div>

      {/* Combined Drag & Drop + Upload Row */}
      {!isRecording && !isProcessing && (
        <div className="flex items-center gap-4 w-full">
          <div className={cn(
            "flex-1 border-2 border-dashed rounded-2xl p-4 transition-all flex items-center justify-center gap-3",
            isDragging ? "border-primary bg-primary/5" : "border-border bg-muted"
          )}>
            <FileAudio className={cn("w-5 h-5 transition-colors", isDragging ? "text-primary" : "text-muted-foreground/30")} />
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              {isDragging ? "Release to Analyze" : "Drag & Drop Audio Here"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 bg-muted hover:bg-muted/80 text-foreground rounded-xl flex items-center justify-center transition-all border border-border shadow-sm group"
              title="Upload Audio"
            >
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Upload</span>
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
        <ShieldCheck className="w-3 h-3 text-green-500" />
        No raw audio is stored • Encrypted processing
      </div>
    </div>
  );
};

export default VoiceRecorder;
