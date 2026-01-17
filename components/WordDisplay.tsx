import React, { useMemo } from 'react';

interface WordDisplayProps {
  word: string;
  fontSize: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, fontSize }) => {
  // Logic to find the Optimal Recognition Point (ORP)
  // Scientific consensus suggests ~35% into the word is the Optimal Viewing Position (OVP)
  const { left, pivot, right } = useMemo(() => {
    if (!word) return { left: '', pivot: '', right: '' };

    const len = word.length;
    let pivotIndex = 0;

    // Adjusted for "Left of Center" preference in reading science
    if (len === 1) pivotIndex = 0;
    else if (len >= 2 && len <= 5) pivotIndex = 1;
    else if (len >= 6 && len <= 9) pivotIndex = 2;
    else if (len >= 10 && len <= 13) pivotIndex = 3;
    else pivotIndex = Math.floor((len - 1) * 0.35); // Generic fallback for very long words

    const leftPart = word.slice(0, pivotIndex);
    const pivotChar = word[pivotIndex];
    const rightPart = word.slice(pivotIndex + 1);

    return { left: leftPart, pivot: pivotChar, right: rightPart };
  }, [word]);

  return (
    <div 
      className="reader-font flex items-baseline justify-center select-none w-full"
      style={{ fontSize: `${fontSize}rem`, lineHeight: 1 }}
    >
      {/* 
        Using flex-1 with text-align ensures the 'gap' stays perfectly centered 
        regardless of the pivot character's width.
      */}
      <div className="flex-1 text-right text-slate-400 whitespace-nowrap overflow-visible">
        {left}
      </div>
      
      {/* The Pivot is the anchor. Fixed width container to prevent jitter. */}
      <div className="w-[1ch] text-center flex justify-center text-red-500 font-bold transform scale-110 z-10">
        {pivot}
      </div>
      
      <div className="flex-1 text-left text-slate-400 whitespace-nowrap overflow-visible">
        {right}
      </div>
    </div>
  );
};

export default WordDisplay;