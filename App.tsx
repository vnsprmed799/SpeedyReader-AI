import React, { useState } from 'react';
import InputArea from './components/InputArea';
import Reader from './components/Reader';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [content, setContent] = useState<string>("");

  const handleStartReading = (text: string) => {
    if (!text.trim()) return;
    setContent(text);
    setAppState(AppState.READING);
  };

  const handleBackToEdit = () => {
    setAppState(AppState.INPUT);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {appState === AppState.INPUT ? (
        <InputArea 
          onStart={handleStartReading} 
          initialText={content}
        />
      ) : (
        <Reader 
          text={content} 
          onBack={handleBackToEdit}
        />
      )}
    </div>
  );
};

export default App;