
import React from 'react';
import { Job, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { MapPin, Briefcase, Clock, Star, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  lang: Language;
}

export const JobCard: React.FC<JobCardProps> = ({ job, lang }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 group cursor-pointer">
      <div className={`flex items-start gap-5 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="relative">
            <img 
              src={job.employerAvatar} 
              alt={job.employerName} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-900 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white dark:border-slate-800">
                <Briefcase size={10} />
            </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors">
              {job.title}
            </h3>
            {job.isFeatured && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 whitespace-nowrap uppercase tracking-tighter">
                    <Star size={10} fill="currentColor" /> {lang === 'ar' ? 'مميز' : 'PRO'}
                </span>
            )}
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-4 flex items-center gap-1.5">
            {job.employerName}
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-emerald-600 dark:text-emerald-400">{job.wilaya}</span>
          </p>
          
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:border-emerald-100 transition-colors">
              <MapPin size={12} className="text-emerald-500" />
              {job.wilaya.split('-')[1]}
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:border-emerald-100 transition-colors">
              <Briefcase size={12} className="text-blue-500" />
              {job.type}
            </div>
            {job.salary && (
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <DollarSign size={12} />
                    {job.salary}
                </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <span className="text-slate-400 text-[10px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                <Clock size={12} /> {job.postedAt}
            </span>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-6 py-2.5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/10 flex items-center gap-2 group/btn">
          {t.apply}
          {isRTL ? <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" /> : <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
        </button>
      </div>
    </div>
  );
};
