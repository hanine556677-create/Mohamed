
import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  current: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ current, onToggle }) => {
  return (
    <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-full items-center">
      <button
        onClick={() => onToggle('ar')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${current === 'ar' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'}`}
      >
        العربية
      </button>
      <button
        onClick={() => onToggle('fr')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${current === 'fr' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'}`}
      >
        FR
      </button>
    </div>
  );
};
