import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Settings, Type, FastForward } from 'lucide-react';
import WordDisplay from './WordDisplay';
import { ReaderSettings } from '../types';

interface ReaderProps {
  text: string;
  onBack: () => void;
}

const Reader: React.FC<ReaderProps> = ({ text, onBack }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    wpm: 350, // Slightly higher default for scientific method
    chunkSize: 1,
    fontSize: 4,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Preserve punctuation attached to words for context
    // We filter out empty strings but keep everything else
    const processed = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWords(processed);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [text]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleSpeedChange = (delta: number) => {
    setSettings(prev => ({ ...prev, wpm: Math.max(50, prev.wpm + delta) }));
  };

  const handleFontSizeChange = (delta: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(1, Math.min(8, prev.fontSize + delta)) }));
  };

  // Scientific Delay Calculation
  // Based on "Sentence Wrap-up" effects and word length processing loads
  const calculateDelay = (word: string) => {
    if (!word) return 60000 / settings.wpm;

    // Base duration for a standard word
    const baseDelay = 60000 / settings.wpm;
    let duration = baseDelay;

    // 1. Length Processing Factor
    // Words longer than 6 letters take exponentially more time to recognize
    if (word.length > 6) {
      // Add ~10% time per char over 6, capped at 2x base speed
      const penalty = Math.min((word.length - 6) * 0.1, 1.0);
      duration *= (1 + penalty);
    } 
    // Very short words (high frequency) can be faster
    else if (word.length < 3) {
      duration *= 0.9;
    }

    // 2. Numeric/Symbol Processing
    // Numbers interrupt the phonological loop
    if (/\d/.test(word)) {
      duration *= 1.3;
    }

    // 3. Sentence Wrap-up Effect (The most important for comprehension)
    // The brain needs time to integrate the clause/sentence meaning.
    const lastChar = word.slice(-1);
    
    if (/[.!?]/.test(lastChar) || word.includes('\n')) {
      duration *= 2.2; // Strong pause for sentence end
    } else if (/[,;:\-]/.test(lastChar)) {
      duration *= 1.5; // Moderate pause for clause boundary
    } else if (/[")]/.test(lastChar)) {
      duration *= 1.2; // Slight pause for quote end
    }

    return duration;
  };

  const step = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= words.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [words.length]);

  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      const currentWord = words[currentIndex];
      // Calculate how long THIS word should stay on screen
      const delay = calculateDelay(currentWord);

      timerRef.current = setTimeout(() => {
        step();
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, words, settings.wpm, step]);

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
  
  // Approximate time remaining calculation
  const wordsRemaining = words.length - currentIndex;
  // Adjust remaining time estimate to account for the new variable delays (roughly 1.2x avg factor)
  const timeRemaining = Math.ceil((wordsRemaining / (settings.wpm / 60)) * 1.2);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Edit Text</span>
        </button>
        <div className="text-slate-500 text-sm font-mono">
          {currentIndex + 1} / {words.length} words
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative min-h-[400px]">
        {/* Focus Guides */}
        <div className="absolute w-full max-w-2xl h-64 border-y-2 border-slate-800/80 flex items-center justify-center pointer-events-none">
           <div className="h-6 w-0.5 bg-red-500/10 absolute top-0"></div>
           <div className="h-6 w-0.5 bg-red-500/10 absolute bottom-0"></div>
        </div>

        <WordDisplay 
          word={words[currentIndex] || ""} 
          fontSize={settings.fontSize} 
        />
        
        {/* Subliminal Context - Removed generic 'Next' for cleaner focus, kept subtle */}
      </div>

      {/* Controls */}
      <div className="bg-slate-800/80 rounded-2xl p-6 backdrop-blur-md border border-slate-700/50 mt-auto shadow-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 h-3 rounded-full mb-6 overflow-hidden cursor-pointer group"
             onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const p = x / rect.width;
                setCurrentIndex(Math.floor(p * words.length));
             }}
        >
          <div 
            className="bg-blue-500 h-full transition-all duration-75 ease-out group-hover:bg-blue-400 relative"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={reset}
              className="p-3 rounded-full hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset to start"
            >
              <RotateCcw size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className={`p-5 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 ring-1 ring-amber-500/50' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
              }`}
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 w-full md:w-auto bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
             <div className="flex items-center gap-4 text-slate-300 font-mono">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">WPM</span>
                <button onClick={() => handleSpeedChange(-25)} className="hover:text-white p-1 text-slate-400 hover:bg-slate-800 rounded">-</button>
                <span className="text-xl font-bold w-16 text-center tabular-nums text-white">{settings.wpm}</span>
                <button onClick={() => handleSpeedChange(25)} className="hover:text-white p-1 text-slate-400 hover:bg-slate-800 rounded">+</button>
             </div>
             <input 
               type="range" 
               min="100" 
               max="1200" 
               step="25" 
               value={settings.wpm}
               onChange={(e) => setSettings({...settings, wpm: Number(e.target.value)})}
               className="w-full md:w-48 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
             />
          </div>

           <div className="flex items-center gap-2 text-slate-400">
              <button 
                onClick={() => handleFontSizeChange(-0.5)} 
                className="hover:text-white p-3 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Type size={16} />
              </button>
              <button 
                onClick={() => handleFontSizeChange(0.5)} 
                className="hover:text-white p-3 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Type size={24} />
              </button>
           </div>
        </div>
        
        <div className="text-center mt-4 text-xs font-mono text-slate-500">
          {timeRemaining < 60 ? `${timeRemaining} sec` : `${Math.floor(timeRemaining/60)} min ${timeRemaining%60} sec`} remaining
        </div>
      </div>
    </div>
  );
};

export default Reader;