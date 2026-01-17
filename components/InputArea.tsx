import React, { useState } from 'react';
import { Play, Sparkles, FileText, Eraser, BookOpen, Zap } from 'lucide-react';
import { summarizeText, generatePracticeText, optimizeForSpeedReading } from '../services/geminiService';

interface InputAreaProps {
  onStart: (text: string) => void;
  initialText: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onStart, initialText }) => {
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text) return;
    setIsGenerating(true);
    setError(null);
    try {
      const summary = await summarizeText(text);
      setText(summary);
    } catch (e) {
      setError("Failed to summarize. Check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!text) return;
    setIsGenerating(true);
    setError(null);
    try {
      const optimized = await optimizeForSpeedReading(text);
      setText(optimized);
    } catch (e) {
      setError("Failed to optimize. Check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const story = await generatePracticeText("The Future of Human Evolution");
      setText(story);
    } catch (e) {
      setError("Failed to generate text. Check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          SpeedyReader AI
        </h1>
        <p className="text-slate-400">
          Scientific RSVP reader with optimal recognition point technology.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex-1 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl ring-1 ring-white/5 focus-within:ring-blue-500/50 transition-all">
          <textarea
            className="w-full h-full p-6 bg-transparent text-slate-200 resize-none focus:outline-none transition-all text-lg leading-relaxed placeholder:text-slate-600 font-sans"
            placeholder="Paste your text here to begin speed reading..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-xs bg-slate-900/90 px-3 py-1.5 rounded-full text-slate-400 border border-slate-700/50">
            {wordCount} words
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
            {/* AI Tools */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={handleSummarize}
                    disabled={isGenerating || !text}
                    className="flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-all font-medium text-xs md:text-sm border border-slate-700 hover:border-amber-400/30 group"
                    title="Shorten the text to key points only"
                >
                    {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Sparkles size={16} className="text-amber-400 group-hover:scale-110 transition-transform"/>}
                    <span>Summarize</span>
                </button>
                <button
                    onClick={handleOptimize}
                    disabled={isGenerating || !text}
                    className="flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-all font-medium text-xs md:text-sm border border-slate-700 hover:border-blue-400/30 group"
                    title="Convert numbers and symbols to text for smoother reading (Keep 100% content)"
                >
                    <Zap size={16} className="text-blue-400 group-hover:scale-110 transition-transform"/>
                    <span>Optimize Flow</span>
                </button>
                <button
                    onClick={handleGenerateStory}
                    disabled={isGenerating}
                    className="flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-all font-medium text-xs md:text-sm border border-slate-700 hover:border-emerald-400/30 group"
                    title="Generate a random practice text"
                >
                    <BookOpen size={16} className="text-emerald-400 group-hover:scale-110 transition-transform"/>
                    <span>Practice</span>
                </button>
            </div>

            {/* Main Actions */}
            <div className="flex gap-3">
                 <button
                    onClick={() => setText('')}
                    className="px-5 py-3 bg-slate-800 hover:bg-red-950/30 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-lg text-slate-400 transition-colors"
                    title="Clear text"
                >
                    <Eraser size={20} />
                </button>
                <button
                    onClick={() => onStart(text)}
                    disabled={!text}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] group"
                >
                    <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                      <Play fill="currentColor" size={16} />
                    </div>
                    Start Reading
                </button>
            </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
          <p className="text-xs text-slate-500/80">
            For best results, relax your gaze and stare directly at the <span className="text-red-500/80 font-bold">red letter</span>. Do not move your eyes.
          </p>
      </div>
    </div>
  );
};

export default InputArea;