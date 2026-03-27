import { Loader2, Mic, Square, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMood } from "../../hooks";
import { convertBlobToWav } from "../../lib/audioUtils";
import { cn } from "../../lib/utils";

const VoiceRecorder = ({ onResult, onRecordingChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { processAudio } = useMood();

  useEffect(() => {
    if (onRecordingChange) {
      onRecordingChange(isRecording || isProcessing);
    }
  }, [isRecording, isProcessing, onRecordingChange]);

  const handleProcessAudio = async (audioBlob, source = "recording") => {
    setIsProcessing(true);
    setIsDragging(false);

    try {
      // Validate audio blob
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("Audio file is empty. Please try recording again.");
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (audioBlob.size > maxSize) {
        throw new Error("Audio file is too large. Maximum size is 10MB.");
      }

      // Convert webm blob to wav blob
      let wavBlob;
      try {
        wavBlob = await convertBlobToWav(audioBlob);
      } catch (conversionError) {
        console.error("Audio conversion error:", conversionError);
        throw new Error("Failed to process audio format. Please try again.");
      }

      // Validate converted blob
      if (!wavBlob || wavBlob.size === 0) {
        throw new Error("Audio conversion failed. Please try again.");
      }

      // Convert blob to file
      const audioFile = new File([wavBlob], `recording-${Date.now()}.wav`, {
        type: "audio/wav",
      });

      // Call API
      let res;
      try {
        res = await processAudio(audioFile);
      } catch (apiError) {
        console.error("API error:", apiError);
        
        // Handle specific error cases
        if (apiError.status === 0) {
          throw new Error("Network error. Please check your internet connection.");
        } else if (apiError.status === 503) {
          throw new Error("Analysis service is temporarily unavailable. Please try again in a moment.");
        } else if (apiError.status === 400) {
          throw new Error(apiError.message || "Invalid audio file. Please try again.");
        } else {
          throw new Error(apiError.message || "Failed to analyze audio. Please try again.");
        }
      }

      const response = res.data || res;
      const responseData = response?.data || response;

      // Validate response data
      if (!responseData) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Transform API response to match expected format
      onResult({
        text: responseData.text || "Audio processed successfully",
        sentiment:
          responseData.normalized_score ??
          responseData.normalizedScore ??
          responseData.sentiment?.compound ??
          0,
        features: responseData.features || {
          pitch: "Analyzed",
          energy: "Analyzed",
          rate: "Analyzed",
        },
        moodScore: responseData.mood_score ?? responseData.moodScore ?? 5.0,
        moodLabel:
          responseData.mood_label || responseData.moodLabel || "Neutral",
        confidence: responseData.confidence ?? 0.8,
        insight: responseData.insight || "Analysis complete",
        trend: responseData.trend ?? 0,
        fluctuation: responseData.fluctuation ?? 0,
        alert: responseData.alert || null,
        source: source,
      });
      setTimer(0);
    } catch (error) {
      console.error("Error processing audio:", error);
      // Show user-friendly error message
      const errorMessage = error.message || "Failed to process audio. Please try again.";
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isRecording) {
      const startAudio = async () => {
        try {
          // Check if browser supports getUserMedia
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Your browser doesn't support audio recording. Please use a modern browser.");
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          });
          streamRef.current = stream;

          // Start MediaRecorder for audio capture
          audioChunksRef.current = [];
          
          // Check MediaRecorder support
          if (!window.MediaRecorder) {
            throw new Error("Audio recording is not supported in your browser.");
          }

          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            if (audioChunksRef.current.length === 0) {
              console.error("No audio data captured");
              alert("No audio was recorded. Please try again.");
              return;
            }
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            setRecordedBlob(audioBlob);
          };

          mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event.error);
            alert("Recording error occurred. Please try again.");
            setIsRecording(false);
          };

          mediaRecorder.start();

          const AudioContext = window.AudioContext || window.webkitAudioContext;
          
          if (!AudioContext) {
            console.warn("AudioContext not supported, visualization disabled");
            return;
          }

          audioContextRef.current = new AudioContext();

          if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
          }

          analyserRef.current = audioContextRef.current.createAnalyser();
          const source =
            audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);

          analyserRef.current.fftSize = 256;
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const canvas = canvasRef.current;
          if (!canvas) return;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const draw = () => {
            if (!analyserRef.current || !ctx) return;

            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteTimeDomainData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              const amplitude = (dataArray[i] - 128) / 128;
              sum += amplitude * amplitude;
            }
            const rms = Math.sqrt(sum / bufferLength);
            const volumeScale = Math.max(0.1, rms * 5);

            const drawWave = (
              color,
              opacity,
              amplitudeMultiplier,
              frequencyMultiplier,
              offset,
            ) => {
              ctx.beginPath();
              ctx.lineWidth = 2;
              ctx.strokeStyle = color;
              ctx.globalAlpha = opacity;

              for (let x = 0; x <= canvas.width; x += 2) {
                const normalizedX = x / canvas.width;
                const dataIndex = Math.floor(normalizedX * bufferLength);
                const jitter = (dataArray[dataIndex] - 128) / 128;
                const envelope = Math.sin(normalizedX * Math.PI);

                const y =
                  canvas.height / 2 +
                  Math.sin(
                    normalizedX * Math.PI * frequencyMultiplier +
                      offset +
                      Date.now() * 0.005,
                  ) *
                    canvas.height *
                    0.4 *
                    volumeScale *
                    amplitudeMultiplier *
                    envelope +
                  jitter * canvas.height * 0.2 * volumeScale * envelope;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            };

            drawWave("var(--primary)", 0.3, 1.0, 2, 0);
            drawWave("var(--primary)", 0.5, 0.7, 3, Math.PI / 2);
            drawWave("var(--primary)", 0.8, 0.5, 4, Math.PI);

            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(var(--primary), 0.4)";
          };

          draw();

          timerRef.current = setInterval(() => {
            setTimer((prev) => prev + 1);
          }, 1000);
        } catch (err) {
          console.error("Error accessing microphone:", err);
          setIsRecording(false);
          
          // Provide user-friendly error messages
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            alert("Microphone access denied. Please allow microphone permissions in your browser settings.");
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            alert("No microphone found. Please connect a microphone and try again.");
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            alert("Microphone is already in use by another application. Please close other apps and try again.");
          } else {
            alert(err.message || "Failed to access microphone. Please try again.");
          }
        }
      };
      startAudio();
    } else {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      clearInterval(timerRef.current);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
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

  // Process audio when recording stops
  useEffect(() => {
    if (recordedBlob && !isRecording) {
      handleProcessAudio(recordedBlob, "recording");
      setRecordedBlob(null);
    }
  }, [recordedBlob, isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      alert("Please upload a valid audio file.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Audio file is too large. Maximum size is 10MB.");
      return;
    }

    if (file.size === 0) {
      alert("Audio file is empty. Please select a valid file.");
      return;
    }

    await handleProcessAudio(file, "upload");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isRecording || isProcessing) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) {
      alert("No file detected. Please try again.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      alert("Please drop a valid audio file.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Audio file is too large. Maximum size is 10MB.");
      return;
    }

    if (file.size === 0) {
      alert("Audio file is empty. Please select a valid file.");
      return;
    }

    await handleProcessAudio(file, "upload");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "bg-card rounded-3xl p-4 md:p-5 shadow-sm border transition-all duration-300 flex flex-col items-center justify-center space-y-3 md:space-y-4 relative overflow-hidden",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border",
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
            <p className="text-primary font-bold text-lg">
              Drop audio to analyze
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isRecording && !isProcessing && (
        <div className="absolute top-3 right-3 z-10">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex items-center justify-center transition-all border border-primary/20 shadow-sm group"
            title="Upload Audio"
          >
            <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      <div className="text-center space-y-1">
        <h2 className="text-lg md:text-xl font-bold font-display text-foreground">
          Speak Your Mind
        </h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-xs">
          Just talk or drop an audio file. We're listening.
        </p>
      </div>

      <div className="flex items-center justify-center py-1">
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
              "relative z-10 w-20 h-20 md:w-22 md:h-22 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
              isRecording
                ? "bg-destructive hover:bg-destructive/90 scale-110"
                : "bg-primary hover:bg-primary/90 hover:scale-105",
              isProcessing && "opacity-50 cursor-not-allowed",
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 md:w-9 md:h-9 text-primary-foreground animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 md:w-9 md:h-9 text-destructive-foreground fill-current" />
            ) : (
              <Mic className="w-8 h-8 md:w-9 md:h-9 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span
          className={cn(
            "text-xl md:text-2xl font-mono font-bold",
            isRecording ? "text-destructive" : "text-muted-foreground/50",
          )}
        >
          {formatTime(timer)}
        </span>
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          {isProcessing
            ? "Catching the vibe..."
            : isRecording
              ? "Listening Live"
              : "Ready to Listen"}
        </span>
      </div>

      <div className="w-full h-24 md:h-28 flex items-center justify-center px-4 bg-muted rounded-2xl overflow-hidden border border-border/50">
        <canvas
          ref={canvasRef}
          width={400}
          height={100}
          className="w-full h-full"
        />
        {!isRecording && !isProcessing && (
          <div className="absolute flex items-center gap-1 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-muted-foreground/30 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
