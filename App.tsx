
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, Language, User, UserRole, Job } from './types';
import { WILAYAS, TRANSLATIONS, MOCK_JOBS, JOB_CATEGORIES } from './constants';
import { 
  Home, Search, PlusSquare, MessageCircle, Users, User as UserIcon, 
  Menu, Bell, Moon, Sun, Filter, ChevronLeft, ChevronRight, Send, Mic, 
  Image as ImageIcon, CheckCheck, MoreVertical, Flag, ShieldAlert, Star,
  Loader2, CheckCircle2, Sparkles, MapPin, Briefcase, DollarSign, Clock
} from 'lucide-react';
import { LanguageToggle } from './components/LanguageToggle';
import { JobCard } from './components/JobCard';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewType>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiGeneratedDesc, setAiGeneratedDesc] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [profileTips, setProfileTips] = useState<string>('');
  const [showToast, setShowToast] = useState<string | null>(null);

  const [currentUser] = useState<User>({
    id: 'u1',
    name: 'أحمد الجزائري',
    role: 'regular',
    wilaya: '16-Alger',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    skills: ['React', 'TypeScript', 'Node.js', 'Arabic', 'French'],
    rating: 4.9,
    isPro: true,
    bio: 'مطور برمجيات شغوف ببناء حلول تقنية تخدم المجتمع الجزائري.'
  });

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [lang, isDarkMode, isRTL]);

  // Fetch AI Tips for Profile
  useEffect(() => {
    if (activeTab === 'profile' && !profileTips) {
        const fetchTips = async () => {
            const gemini = GeminiService.getInstance();
            const tips = await gemini.analyzeProfile(currentUser.skills, currentUser.bio || '');
            setProfileTips(tips);
        };
        fetchTips();
    }
  }, [activeTab, currentUser, profileTips]);

  const triggerToast = (msg: string) => {
      setShowToast(msg);
      setTimeout(() => setShowToast(null), 3000);
  };

  const handleGenerateAIDesc = async () => {
      if (!jobTitleInput) {
          triggerToast(isRTL ? "يرجى إدخال عنوان الوظيفة أولاً" : "Veuillez entrer le titre du poste");
          return;
      }
      setIsLoadingAI(true);
      const gemini = GeminiService.getInstance();
      const desc = await gemini.generateJobDescription(jobTitleInput, "خبرة سنتين، مهارات تواصل جيدة، العمل في الجزائر العاصمة");
      setAiGeneratedDesc(desc);
      setIsLoadingAI(false);
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
        const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWilaya = !selectedWilaya || job.wilaya === selectedWilaya;
        return matchesQuery && matchesWilaya;
    });
  }, [searchQuery, selectedWilaya]);

  const renderHome = () => (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/30">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={14} className="text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{isRTL ? 'الذكاء الاصطناعي مفعل' : 'AI POWERED'}</span>
          </div>
          <h1 className="text-3xl font-black mb-2 leading-tight">
            {isRTL ? 'مستقبلك يبدأ من هنا' : 'Votre avenir commence ici'}
          </h1>
          <p className="text-emerald-100 text-sm mb-8 opacity-90 max-w-[80%]">
            {isRTL ? 'اكتشف فرص العمل الأكثر ملاءمة لمهاراتك في جميع ولايات الجزائر' : 'Découvrez les meilleures opportunités adaptées à vos compétences.'}
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors`} size={20} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className={`w-full bg-white text-slate-900 py-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl focus:ring-4 ring-emerald-400/30 outline-none transition-all shadow-lg shadow-emerald-900/20`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <MapPin className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-emerald-200`} size={16} />
                    <select 
                        className={`w-full bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm outline-none appearance-none cursor-pointer hover:bg-white/20 transition-all`}
                        value={selectedWilaya}
                        onChange={(e) => setSelectedWilaya(e.target.value)}
                    >
                        <option value="" className="text-slate-800">{t.wilaya}</option>
                        {WILAYAS.map(w => <option key={w} value={w} className="text-slate-800">{w}</option>)}
                    </select>
                </div>
                <button className="bg-white text-emerald-700 p-3.5 rounded-xl font-bold shadow-lg active:scale-90 transition-transform">
                    <Filter size={20} />
                </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Categories Horizontal Scroll */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="font-black text-xl text-slate-800 dark:text-slate-100">{isRTL ? 'المجالات الشائعة' : 'Secteurs populaires'}</h2>
          <button className="text-emerald-600 font-bold text-sm">{isRTL ? 'الكل' : 'Tous'}</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
          {JOB_CATEGORIES.map(cat => (
            <button key={cat.id} className="flex flex-col items-center gap-2 min-w-[90px] p-4 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-emerald-100 transition-all group active:scale-95">
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl group-hover:bg-emerald-50 group-hover:scale-110 transition-all">
                {cat.icon}
              </div>
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {lang === 'ar' ? cat.label.ar : cat.label.fr}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="px-1">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="font-black text-xl text-slate-800 dark:text-slate-100">{t.featured}</h2>
        </div>
        <div className="space-y-4">
          {MOCK_JOBS.filter(j => j.isFeatured).map(job => (
            <JobCard key={job.id} job={job} lang={lang} />
          ))}
        </div>
      </section>

      {/* Latest Jobs List */}
      <section className="px-1">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="font-black text-xl text-slate-800 dark:text-slate-100">{t.latestJobs}</h2>
        </div>
        {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} lang={lang} />
              ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Search size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-bold">{isRTL ? 'لا توجد نتائج مطابقة' : 'Aucun résultat trouvé'}</p>
            </div>
        )}
      </section>
    </div>
  );

  const renderPost = () => (
    <div className="space-y-6 pb-24 animate-in slide-in-from-bottom-10 duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                    <PlusSquare size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{t.postJob}</h2>
                    <p className="text-xs text-slate-500">{isRTL ? 'الوصول لآلاف المترشحين في دقائق' : 'Atteignez des milliers de candidats'}</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="group">
                    <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">{isRTL ? 'عنوان الوظيفة' : 'Titre du poste'}</label>
                    <input 
                        type="text" 
                        value={jobTitleInput}
                        onChange={(e) => setJobTitleInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 outline-none text-sm dark:text-slate-100 transition-all" 
                        placeholder="مثلاً: محاسب، بناء، نادل..." 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t.wilaya}</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none text-sm dark:text-slate-100">
                            {WILAYAS.map(w => <option key={w}>{w}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t.jobType}</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none text-sm dark:text-slate-100">
                            <option>Full-time</option>
                            <option>Daily / يومي</option>
                            <option>Freelance</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.description}</label>
                        <button 
                            onClick={handleGenerateAIDesc}
                            disabled={isLoadingAI}
                            className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-1.5 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                        >
                            {isLoadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isRTL ? 'توليد ذكي' : 'Générer avec AI'}
                        </button>
                    </div>
                    <textarea 
                        rows={6} 
                        value={aiGeneratedDesc}
                        onChange={(e) => setAiGeneratedDesc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none text-sm dark:text-slate-100 resize-none transition-all" 
                        placeholder="اشرح تفاصيل العمل والشروط..." 
                    />
                </div>

                <button 
                    onClick={() => triggerToast(isRTL ? "تم نشر الإعلان بنجاح!" : "Offre publiée avec succès !")}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 active:scale-95 hover:bg-emerald-700 transition-all"
                >
                    {isRTL ? 'نشر الإعلان الآن' : 'Publier l\'annonce'}
                </button>
            </div>
        </div>
    </div>
  );

  const renderProfile = () => (
      <div className="space-y-6 pb-24 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <div className="relative pt-12">
                  <div className="relative inline-block group">
                    <img src={currentUser.avatar} className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 mx-auto shadow-2xl group-hover:scale-105 transition-transform" />
                    {currentUser.isPro && (
                        <div className="absolute bottom-1 right-1 bg-amber-500 text-white p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
                            <Star size={16} fill="currentColor" />
                        </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-black mt-4 text-slate-800 dark:text-slate-100">{currentUser.name}</h2>
                  <p className="text-emerald-600 font-bold text-sm mb-6">{currentUser.wilaya} • {t[`role_${currentUser.role}` as keyof typeof t]}</p>
                  
                  <div className="flex justify-center gap-10 py-6 border-y border-slate-50 dark:border-slate-700 mb-8">
                      <div>
                          <p className="text-2xl font-black text-slate-800 dark:text-white">12</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isRTL ? 'تقديمات' : 'Postulations'}</p>
                      </div>
                      <div className="w-[1px] bg-slate-100 dark:bg-slate-700"></div>
                      <div>
                          <p className="text-2xl font-black text-emerald-600">4.9</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isRTL ? 'تقييم' : 'Note'}</p>
                      </div>
                      <div className="w-[1px] bg-slate-100 dark:bg-slate-700"></div>
                      <div>
                          <p className="text-2xl font-black text-slate-800 dark:text-white">3</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isRTL ? 'عروض' : 'Offres'}</p>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 hover:bg-emerald-700 transition-all">
                          {isRTL ? 'تعديل الملف الشخصي' : 'Modifier Profil'}
                      </button>
                      <button className="w-full bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-200 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">
                          {isRTL ? 'الإعدادات المتقدمة' : 'Paramètres'}
                      </button>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/30">
                    <ShieldAlert size={20} />
                </div>
                <h3 className="text-lg font-black text-amber-900 dark:text-amber-200">
                    {isRTL ? 'نصيحة ذكية للتوظيف' : 'Conseil Pro AI'}
                </h3>
              </div>
              <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  {profileTips ? (
                      <div className="whitespace-pre-line">{profileTips}</div>
                  ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        {isRTL ? 'جاري تحليل ملفك...' : 'Analyse de votre profil...'}
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'} transition-colors duration-300 font-sans`}>
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 fade-in">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold">{showToast}</span>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 px-4 py-4 safe-area-top">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 transform -rotate-3">
                <span className="text-white font-black text-2xl">D</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">DzJob</span>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{isRTL ? 'الجزائر' : 'ALGERIA'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageToggle current={lang} onToggle={setLang} />
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 py-8 overflow-x-hidden min-h-screen">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderHome()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'post' && renderPost()}
        
        {/* Placeholder for other views */}
        {(activeTab === 'messages' || activeTab === 'groups') && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    {activeTab === 'messages' ? <MessageCircle size={40} className="text-slate-300" /> : <Users size={40} className="text-slate-300" />}
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{isRTL ? 'قريباً جداً' : 'Bientôt disponible'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{isRTL ? 'هذه الميزة في مرحلة التطوير النهائي' : 'Cette fonctionnalité est en cours de développement'}</p>
            </div>
        )}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 pt-3 pb-8 px-8 z-50 safe-area-bottom shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-xl mx-auto flex justify-between items-center relative">
          <NavItem 
            icon={<Home size={24} />} 
            label={t.home} 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavItem 
            icon={<MessageCircle size={24} />} 
            label={t.messages} 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')} 
          />
          
          <div className="relative -mt-14">
              <button 
                onClick={() => setActiveTab('post')}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-[1.75rem] shadow-2xl shadow-emerald-500/50 transform transition-all active:scale-90 ring-4 ring-white dark:ring-slate-900 ${activeTab === 'post' ? 'bg-emerald-700 scale-110' : 'bg-emerald-600'}`}
              >
                <PlusSquare size={32} className="text-white" />
              </button>
          </div>

          <NavItem 
            icon={<Users size={24} />} 
            label={t.groups} 
            active={activeTab === 'groups'} 
            onClick={() => setActiveTab('groups')} 
          />
          <NavItem 
            icon={<UserIcon size={24} />} 
            label={t.profile} 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 group relative px-2 py-1 transition-all ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
  >
    <div className={`transition-all duration-300 ${active ? 'transform -translate-y-1 scale-110' : 'group-hover:scale-105'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    {active && <div className="absolute -bottom-1 w-1 h-1 bg-emerald-600 rounded-full"></div>}
  </button>
);

export default App;
