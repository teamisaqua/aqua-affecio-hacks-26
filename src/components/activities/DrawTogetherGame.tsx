'use client';

import React, { useRef, useState, useEffect } from 'react';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { Pen, Eraser, Trash2, Download, ArrowRight, Sparkles } from 'lucide-react';

interface DrawTogetherGameProps {
  userAName: string;
  userBName: string;
  isUserA: boolean;
  isSimulatedPartner?: boolean;
  onBroadcastAction?: (action: string, payload: unknown) => void;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

export const DrawTogetherGame: React.FC<DrawTogetherGameProps> = ({
  userAName,
  userBName,
  isUserA,
  isSimulatedPartner = true,
  onBroadcastAction,
  onFinishGame,
  onExitToHub,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const colors = [
    { label: 'White', hex: '#FFFFFF' },
    { label: 'Blue', hex: '#2997FF' },
    { label: 'Emerald', hex: '#34C759' },
    { label: 'Amber', hex: '#FF9F0A' },
    { label: 'Rose', hex: '#FF375F' },
    { label: 'Purple', hex: '#BF5AF2' },
  ];

  // Initialize canvas with high-DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with deep near-black background
    ctx.fillStyle = '#0E0E12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Simulated partner drawing simulation after 2 seconds
  useEffect(() => {
    if (!isSimulatedPartner) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw an abstract constellation / heart shape from Taylor
      ctx.strokeStyle = '#34C759';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const cx = canvas.width * 0.65;
      const cy = canvas.height * 0.45;

      // Draw stylized heart
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx - 20, cy - 30, cx - 45, cy + 10, cx, cy + 40);
      ctx.bezierCurveTo(cx + 45, cy + 10, cx + 20, cy - 30, cx, cy);
      ctx.stroke();

      sound.playSliderTick(520);
      setStrokeCount((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isSimulatedPartner]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#0E0E12' : color;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();

    onBroadcastAction?.('DRAW_STROKE', { x, y, color: isEraser ? '#0E0E12' : color, size: brushSize });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokeCount((prev) => prev + 1);
  };

  const handleClear = () => {
    sound.playGlassClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0E0E12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleExport = () => {
    sound.playSuccessChime();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `affecio-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleFinish = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'draw-together',
      activityTitle: 'Draw Together',
      category: 'creative',
      completedAt: Date.now(),
      durationSeconds: 180,
      roundsCompleted: 1,
      summaryText: `Created a shared visual canvas with ${strokeCount} collaborative strokes.`,
    };
    onFinishGame(record);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 select-none p-4 sm:p-6 affecio-card">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono font-semibold">
            Draw Together
          </span>
          <span className="text-[#86868B] font-mono">Shared Canvas</span>
        </div>

        <button onClick={onExitToHub} className="text-[#86868B] hover:text-white font-mono">
          Exit to Hub
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#141418] border border-white/8 text-xs">
        {/* Color Palette */}
        <div className="flex items-center space-x-2">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                setIsEraser(false);
              }}
              className={`w-6 h-6 rounded-full border transition-all ${
                color === c.hex && !isEraser ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
              aria-label={c.label}
            />
          ))}
        </div>

        {/* Brush Size / Eraser Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-1.5 rounded-lg border transition-all ${
              !isEraser ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-white/5 border-white/10 text-[#86868B]'
            }`}
            title="Pen"
          >
            <Pen className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsEraser(true)}
            className={`p-1.5 rounded-lg border transition-all ${
              isEraser ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-white/5 border-white/10 text-[#86868B]'
            }`}
            title="Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-[#86868B] hover:text-red-400 transition-all"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair block touch-none"
        />

        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-white/60">
          Collaborative Canvas · {userAName} & {userBName}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <button
          onClick={handleExport}
          className="apple-btn-secondary px-4 py-2 font-mono flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>

        <button
          onClick={handleFinish}
          className="apple-btn-primary px-6 py-2 font-semibold flex items-center gap-1.5"
        >
          <span>Complete Drawing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
