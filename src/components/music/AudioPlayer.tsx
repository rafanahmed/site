"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  credits?: string;
  releaseDate?: string;
}

export default function AudioPlayer({ src, credits, releaseDate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);

  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    analyzer.smoothingTimeConstant = 0.8;
    
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    
    audioContextRef.current = audioContext;
    analyzerRef.current = analyzer;
    sourceRef.current = source;
  }, []);

  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !analyzerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);
      
      const barCount = 64;
      const barWidth = width / barCount;
      const gap = 2;
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = value * (height * 0.4);
        
        const intensity = value * 0.6 + 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
        
        const x = i * barWidth + gap / 2;
        ctx.fillRect(x, centerY - barHeight, barWidth - gap, barHeight);
        ctx.fillRect(x, centerY, barWidth - gap, barHeight);
      }
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    };
    
    draw();
  }, []);

  const drawIdleWaveform = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    const barCount = 64;
    const barWidth = width / barCount;
    const gap = 2;
    
    for (let i = 0; i < barCount; i++) {
      const idleHeight = 2 + Math.sin(i * 0.3) * 1;
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      const x = i * barWidth + gap / 2;
      ctx.fillRect(x, centerY - idleHeight, barWidth - gap, idleHeight);
      ctx.fillRect(x, centerY, barWidth - gap, idleHeight);
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      drawIdleWaveform();
    }
  }, [drawIdleWaveform]);

  useEffect(() => {
    if (audioRef.current && audioRef.current.readyState >= 1) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      setIsLoaded(true);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    if (!audioContextRef.current) {
      initAudioContext();
    }
    
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      drawIdleWaveform();
    } else {
      await audioRef.current.play();
      drawWaveform();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      setIsLoaded(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    drawIdleWaveform();
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="relative border border-white/10 bg-black/40 overflow-hidden">
        <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-white/80 animate-pulse" : "bg-white/20"}`} />
          <span className={`text-[8px] uppercase tracking-[0.2em] debug-mono ${isPlaying ? "text-red-500" : "text-white/40"}`}>
            {isPlaying ? "STREAMING" : "STANDBY"}
          </span>
        </div>
        
        <div className="absolute top-2 right-3 z-10">
          <span className="text-[8px] uppercase tracking-[0.15em] text-white/30 debug-mono">
            FREQ.ANALYSIS
          </span>
        </div>
        
        <canvas
          ref={canvasRef}
          className="w-full h-24"
          style={{ display: "block" }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-[9px] text-white/50 debug-mono tabular-nums shrink-0">
          {formatTime(currentTime)}
        </span>
        <div 
          className="relative flex-1 h-1 bg-white/5 cursor-pointer group"
          onClick={handleSeek}
        >
          <div 
            className="absolute inset-y-0 left-0 bg-white/30 transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 4px)` }}
          />
          <div className="absolute inset-0 flex">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} className="flex-1 border-r border-white/5 last:border-r-0" />
            ))}
          </div>
        </div>
        <span className="text-[9px] text-white/30 debug-mono tabular-nums shrink-0">
          {formatTime(duration)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!isLoaded}
            className="relative w-10 h-10 border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-0.5 h-3 bg-white/70" />
                  <div className="w-0.5 h-3 bg-white/70" />
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white/70 ml-1" />
              )}
            </div>
            <div className="absolute -inset-px border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-[0.15em] text-white/30 debug-mono">VOL</span>
            <div className="relative w-16 h-1">
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <div 
                className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/70 rounded-full border border-white/30 pointer-events-none"
                style={{ left: `calc(${volume * 100}% - 5px)` }}
              />
            </div>
            <span className="text-[8px] text-white/25 debug-mono tabular-nums w-6">
              {Math.round(volume * 100)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-0.5 h-3 transition-all ${
                  isPlaying 
                    ? "bg-white/40 animate-pulse" 
                    : "bg-white/10"
                }`}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  height: `${8 + i * 2}px`
                }}
              />
            ))}
          </div>
          <span className="text-[8px] uppercase tracking-[0.15em] text-white/20 debug-mono">
            signal received, playback initiating
          </span>
        </div>
      </div>
      
      {(credits || releaseDate) && (
        <div className="pt-2 border-t border-white/5 space-y-2">
          {credits && (
            <p className="text-white/20 text-[9px] uppercase tracking-[0.12em] debug-mono text-center whitespace-pre-line leading-relaxed">
              {credits}
            </p>
          )}
          {releaseDate && (
            <p className="text-white/20 text-[9px] uppercase tracking-[0.12em] debug-mono text-center">
              Released on: {releaseDate}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

