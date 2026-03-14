import React, { useCallback, useRef, useState } from 'react';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReceiptUploaderProps {
  onUpload: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
}

export function ReceiptUploader({ onUpload, isAnalyzing }: ReceiptUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      onUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64 = dataUrl.split(',')[1];
      setPreview(dataUrl);
      onUpload(base64, 'image/jpeg');
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {!preview && !isCameraOpen && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
            isDragging ? "border-sky-500 bg-sky-500/5 scale-[1.02]" : "border-zinc-200 hover:bg-zinc-50",
            isAnalyzing && "opacity-50 pointer-events-none"
          )}
        >
          <Upload className="w-12 h-12 mb-4 text-zinc-500" />
          <p className="text-zinc-400 font-medium">Drop receipt image or click to upload</p>
          <p className="text-zinc-600 text-sm mt-2">Supports JPG, PNG</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          
          <button 
            onClick={(e) => { e.stopPropagation(); startCamera(); }}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </button>
        </div>
      )}

      {isCameraOpen && (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] max-h-[500px]">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-zinc-300 flex items-center justify-center"
            />
            <button 
              onClick={stopCamera}
              className="absolute right-6 bottom-4 p-2 bg-zinc-900/80 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {preview && !isAnalyzing && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-800">
          <img src={preview} alt="Receipt preview" className="w-full h-auto max-h-[400px] object-contain bg-zinc-950" />
          <button 
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 p-2 bg-zinc-900/80 rounded-full text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/30 rounded-xl border border-zinc-800 animate-pulse">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-300 font-medium">AI Librarian Accountant is auditing...</p>
          <p className="text-zinc-500 text-sm mt-2">Extracting line items and verifying totals</p>
        </div>
      )}
    </div>
  );
}
