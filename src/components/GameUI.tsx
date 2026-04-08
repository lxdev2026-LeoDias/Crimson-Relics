import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Ghost, Droplet, Star, Coins, Target, ShoppingCart, X, FlaskConical, ArrowLeft, Flame, CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart, Trophy, Settings, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import { LevelGoal, PlayerStats, PowerUpType, Relic, LocalizedString, Language, Achievement } from '../types';
import { PIECE_CONFIG, POWER_UPS, RELICS, LORE, ACHIEVEMENTS } from '../constants';
import { audioService } from '../services/audioService';

const RELIC_ICONS: Record<string, any> = {
  CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart
};

const ACHIEVEMENT_ICONS: Record<string, any> = {
  CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart, Medal
};

interface HUDProps {
  score: number;
  moves: number;
  goals: LevelGoal[];
  playerStats: PlayerStats;
  onOpenShop: () => void;
  onBackToMenu: () => void;
  onSelectTitle: (titleId: string) => void;
}

const t = (str: LocalizedString | string, lang: Language) => {
  if (typeof str === 'string') return str;
  return str[lang] || str['en'];
};

export const HUD = ({ score, moves, goals, playerStats, onOpenShop, onBackToMenu, onSelectTitle }: HUDProps) => {
  const lang = playerStats.language;
  const [isTitleSelectorOpen, setIsTitleSelectorOpen] = useState(false);

  const unlockedTitles = ACHIEVEMENTS.filter(a => playerStats.unlockedAchievements.includes(a.id));
  const currentTitle = unlockedTitles.find(a => a.id === playerStats.selectedTitleId) || unlockedTitles[0];

  return (
    <div className="flex flex-col w-full max-w-2xl gap-4 mb-6">
      {/* Top Bar with Back Button and Stats */}
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={() => {
            audioService.playSound('click');
            onBackToMenu();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-red-900/40 rounded-full border border-red-900/20 text-red-500 text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={14} />
          Menu
        </button>

        <div className="flex-1 flex justify-between items-center px-6 py-2 bg-black/40 rounded-full border border-red-900/20 backdrop-blur-sm relative z-20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Trophy className="text-red-600" size={16} />
                <span className="text-sm font-bold text-white uppercase tracking-widest">Ritual {playerStats.level}</span>
              </div>
              {/* Relic Progress Bar */}
              <div className="mt-1 w-full h-1 bg-red-950 rounded-full overflow-hidden border border-red-900/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((playerStats.level - 1) % 10) * 10}%` }}
                  className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Player Title Section */}
          {unlockedTitles.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <button 
                onClick={() => {
                  if (unlockedTitles.length > 1) {
                    audioService.playSound('click');
                    setIsTitleSelectorOpen(!isTitleSelectorOpen);
                  }
                }}
                className={`flex flex-col items-center group ${unlockedTitles.length > 1 ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="text-[8px] uppercase tracking-[0.3em] text-red-500/50 font-bold">
                  {lang === 'pt' ? 'Título' : 'Title'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest group-hover:text-red-300 transition-colors">
                    {currentTitle ? t(currentTitle.title, lang) : '---'}
                  </span>
                  {unlockedTitles.length > 1 && <ChevronRight size={10} className={`text-red-500/50 transition-transform ${isTitleSelectorOpen ? 'rotate-90' : ''}`} />}
                </div>
              </button>

              <AnimatePresence>
                {isTitleSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 z-[100] bg-zinc-900 border border-red-900/50 rounded-xl p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] min-w-[150px] max-h-[200px] overflow-y-auto"
                  >
                    {unlockedTitles.map(title => (
                      <button
                        key={title.id}
                        onClick={() => {
                          audioService.playSound('click');
                          onSelectTitle(title.id);
                          setIsTitleSelectorOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest transition-colors ${
                          playerStats.selectedTitleId === title.id 
                            ? 'bg-red-900/40 text-white font-bold' 
                            : 'text-zinc-500 hover:bg-red-900/20 hover:text-red-300'
                        }`}
                      >
                        {t(title.title, lang)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Coins className="text-red-500" size={16} />
              <span className="text-sm font-bold text-white tabular-nums">{playerStats.bloodCoins}</span>
            </div>
            <button 
              onClick={() => {
                audioService.playSound('click');
                onOpenShop();
              }}
              className="p-1.5 hover:bg-red-900/30 rounded-full transition-colors text-red-400"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="flex justify-between items-center px-6 py-4 bg-black/80 rounded-2xl border-2 border-red-900/30 backdrop-blur-xl">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-[0.2em] text-red-500/70 font-semibold mb-1">
            {lang === 'pt' ? 'Essência de Sangue' : 'Blood Essence'}
          </span>
          <div className="flex items-center gap-3">
            <FlaskConical className="text-red-500 animate-pulse" size={20} />
            <span className="text-2xl font-bold text-white tabular-nums">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Goals Display */}
        <div className="flex gap-4 items-center bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/20">
          <Target size={14} className="text-red-500/50" />
          {goals.map((goal, idx) => {
            const Config = goal.type === 'score' ? { icon: Star, color: '#eab308' } : PIECE_CONFIG[goal.type as keyof typeof PIECE_CONFIG];
            const Icon = Config.icon;
            const isComplete = goal.current >= goal.target;
            
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon size={16} color={isComplete ? '#22c55e' : Config.color} />
                <span className={`text-sm font-bold tabular-nums ${isComplete ? 'text-green-500' : 'text-white'}`}>
                  {goal.type === 'score' ? `${Math.floor(goal.current/1000)}k/${Math.floor(goal.target/1000)}k` : `${goal.current}/${goal.target}`}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-red-500/70 font-semibold mb-1">
            {lang === 'pt' ? 'Passos Ritualísticos' : 'Ritual Steps'}
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold tabular-nums ${moves <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {moves}
            </span>
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 text-orange-600 blur-[2px]"
              >
                <Flame size={20} fill="currentColor" />
              </motion.div>
              <Skull className={`relative z-10 ${moves <= 5 ? 'text-red-500' : 'text-gray-500'}`} size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  bloodCoins: number;
  language: Language;
  onBuy: (type: PowerUpType, cost: number) => boolean;
  getPowerUpCost: (baseCost: number) => number;
  purchases: Record<string, number>;
}

export const Shop = ({ isOpen, onClose, bloodCoins, language, onBuy, getPowerUpCost, purchases }: ShopProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border-2 border-red-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,27,27,0.3)]"
          >
            <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-red-950/20">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-red-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  {language === 'pt' ? 'Mercado do Coven' : 'Coven Market'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {POWER_UPS.map((pu) => {
                const discountedCost = getPowerUpCost(pu.cost);
                const purchaseCount = purchases[pu.type] || 0;
                const isLimitReached = purchaseCount >= 2;

                return (
                  <div 
                    key={pu.type}
                    className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-red-900/20 hover:border-red-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-900/20 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
                        <pu.icon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{t(pu.name, language)}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isLimitReached ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-700 text-zinc-500'}`}>
                            {purchaseCount}/2
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{t(pu.description, language)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onBuy(pu.type, pu.cost)) {
                          audioService.playSound('buy');
                          onClose();
                        }
                      }}
                      disabled={bloodCoins < discountedCost || isLimitReached}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all
                        ${(bloodCoins >= discountedCost && !isLimitReached)
                          ? 'bg-red-900 text-white hover:bg-red-700 shadow-lg shadow-red-900/20' 
                          : 'bg-zinc-800 text-gray-600 cursor-not-allowed'}
                      `}
                    >
                      <Coins size={14} />
                      <div className="flex flex-col items-end">
                        {discountedCost < pu.cost && (
                          <span className="text-[10px] line-through text-gray-500 leading-none">{pu.cost}</span>
                        )}
                        <span>{discountedCost}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-black/40 border-t border-red-900/30 flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                {language === 'pt' ? 'Sua Riqueza' : 'Your Wealth'}
              </span>
              <div className="flex items-center gap-2">
                <Coins className="text-red-500" size={16} />
                <span className="text-xl font-bold text-white">{bloodCoins}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ScreenProps {
  onStart: () => void;
  onOpenRelics?: () => void;
  onOpenAchievements?: () => void;
  onOpenOptions?: () => void;
  onOpenBloodCodes?: () => void;
  score?: number;
  level?: number;
  xp?: number;
  bags?: number;
  relic?: Relic | null;
  language: Language;
}

const BloodDrop = ({ delay = 0, left = "50%" }: { delay?: number; left?: string }) => (
  <motion.div
    initial={{ y: -10, opacity: 0, scale: 0.5 }}
    animate={{ 
      y: [0, 100, 150], 
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.8]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      delay,
      ease: "easeIn"
    }}
    className="absolute w-2 h-4 bg-red-600 rounded-full blur-[1px]"
    style={{ left }}
  />
);

const GothicButton = ({ onClick, children, className = "", icon: Icon }: { onClick: () => void, children: React.ReactNode, className?: string, icon?: any }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => {
      audioService.playSound('click');
      onClick();
    }}
    className={`gothic-button w-full px-12 py-4 rounded-lg flex items-center justify-center gap-4 group ${className}`}
  >
    <div className="gothic-button-ornament tl" />
    <div className="gothic-button-ornament tr" />
    <div className="gothic-button-ornament bl" />
    <div className="gothic-button-ornament br" />
    
    {Icon && <Icon size={20} className="text-red-700 group-hover:text-red-500 transition-colors" />}
    <span className="archaic-text text-xl font-bold text-red-800 group-hover:text-red-500 transition-colors uppercase tracking-[0.2em]">
      {children}
    </span>
  </motion.button>
);

const BloodBubble = ({ x, y, onComplete }: { x: number, y: number, onComplete: () => void }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, x, y }}
    animate={{ 
      scale: [0, 1.2, 1], 
      opacity: [0, 0.6, 0.4],
    }}
    exit={{ 
      scale: 2, 
      opacity: 0,
      filter: "blur(10px)"
    }}
    transition={{ duration: 1 }}
    onAnimationComplete={() => setTimeout(onComplete, 1000)}
    className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-gradient-to-br from-red-500/40 to-red-900/60 border border-red-400/30 backdrop-blur-[2px] pointer-events-none z-50"
  >
    {/* Inner shine */}
    <div className="absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-full blur-[1px]" />
    
    {/* Explosion particles when exiting */}
    <AnimatePresence>
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        exit={{ opacity: 1 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
            exit={{ 
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
              scale: 0,
              opacity: 0
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  </motion.div>
);

export const IntroScreen = ({ onStart, onOpenRelics, onOpenAchievements, onOpenOptions, onOpenBloodCodes, language }: ScreenProps) => {
  const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number }[]>([]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (bubbles.length >= 3) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newBubble = { id: Date.now(), x, y };
    setBubbles(prev => [...prev, newBubble]);
    audioService.playSound('bubble');
  };

  const removeBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleBackgroundClick}
      className="relative flex flex-col items-center justify-center text-center p-8 min-h-screen w-full overflow-hidden cursor-crosshair"
    >
      <AnimatePresence>
        {bubbles.map(bubble => (
          <BloodBubble 
            key={bubble.id} 
            x={bubble.x} 
            y={bubble.y} 
            onComplete={() => removeBubble(bubble.id)} 
          />
        ))}
      </AnimatePresence>
      {/* Red Moon Background (Centered) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute top-[-50px] w-[400px] h-[400px] bg-gradient-to-b from-red-600 to-red-950 rounded-full blur-[60px] shadow-[0_0_120px_rgba(220,38,38,0.3)] z-0"
      />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-16 relative z-10"
      >
        <div className="relative">
          <h1 
            data-text="Crimson Relics"
            className="metallic-title text-8xl md:text-9xl font-black tracking-tighter mb-4"
          >
            Crimson Relics
          </h1>
          
          {/* Blood Dripping Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <BloodDrop left="15%" delay={0.5} />
            <BloodDrop left="45%" delay={0.2} />
            <BloodDrop left="85%" delay={0.8} />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex items-center justify-center gap-4 text-red-500 font-bold uppercase text-lg archaic-text"
        >
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-red-900" />
          <span>{language === 'pt' ? 'O Despertar de Drácula' : "Dracula's Awakening"}</span>
          <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-red-900" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-6 w-full max-w-md relative z-10">
        <GothicButton onClick={onStart}>
          {language === 'pt' ? 'Iniciar Ritual' : 'Begin Ritual'}
        </GothicButton>

        <div className="grid grid-cols-2 gap-4">
          <GothicButton onClick={onOpenRelics || (() => {})} icon={Trophy} className="px-6">
            {language === 'pt' ? 'Relíquias' : 'Relics'}
          </GothicButton>

          <GothicButton onClick={onOpenOptions || (() => {})} icon={Settings} className="px-6">
            {language === 'pt' ? 'Opções' : 'Options'}
          </GothicButton>
        </div>

        <GothicButton onClick={onOpenAchievements || (() => {})} icon={Medal}>
          {language === 'pt' ? 'Conquistas' : 'Achievements'}
        </GothicButton>

        <GothicButton onClick={onOpenBloodCodes || (() => {})} icon={Skull} className="py-2">
          <span className="text-sm">
            {language === 'pt' ? 'Códigos Sangrentos' : 'Blood Codes'}
          </span>
        </GothicButton>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-red-900/40 text-[10px] uppercase tracking-[0.4em] font-bold archaic-text z-10">
        © 2026 VAMPIRE GAMES | {language === 'pt' ? 'PRESSIONE PARA INICIAR' : 'PRESS TO START'}
      </div>
      
      {/* Sea of Blood Bottom Section */}
      <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden pointer-events-none z-0">
        {/* Wave Layer 1 */}
        <motion.div
          animate={{ 
            x: ["-25%", "0%"],
            y: [0, 5, 0]
          }}
          transition={{ 
            x: { duration: 10, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-0 left-0 w-[200%] h-full opacity-60"
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-red-900/80">
            <path d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 L1500,120 L0,120 Z" />
          </svg>
        </motion.div>

        {/* Wave Layer 2 */}
        <motion.div
          animate={{ 
            x: ["0%", "-25%"],
            y: [5, 0, 5]
          }}
          transition={{ 
            x: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-0 left-0 w-[200%] h-full opacity-40"
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-red-800/60">
            <path d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </motion.div>

        {/* Surface Glow/Mist */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-red-950/80 to-transparent" />
        
        {/* Bubbles/Drops in the sea */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: [100, -20],
              opacity: [0, 0.6, 0],
              scale: [0.4, 1.2, 0.8]
            }}
            transition={{ 
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeOut"
            }}
            className="absolute w-1.5 h-1.5 bg-red-400 rounded-full blur-[0.5px]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export const LoreScreen = ({ onStart, language }: { onStart: () => void, language: Language }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-[#d4c5a9] p-12 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3), 0 0 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Burnt edges effect */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent" style={{ boxShadow: 'inset 0 0 60px 20px rgba(60,40,20,0.4)' }} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-serif font-bold text-red-900 mb-8 uppercase tracking-tighter" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
            {t(LORE.title, language)}
          </h2>
          
          <div className="text-xl font-serif leading-relaxed text-red-950 mb-12 space-y-4 italic">
            {t(LORE.content, language).split('\n\n').map((para, i) => (
              <p key={i} className="relative">
                {para}
                {/* Blood splatter effect on text */}
                {i === 0 && <span className="absolute -top-4 -left-4 w-8 h-8 bg-red-900/10 rounded-full blur-md" />}
              </p>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, color: '#ff0000' }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-3 bg-red-900 text-[#d4c5a9] font-serif font-bold text-xl rounded border-2 border-red-950 shadow-lg hover:bg-red-800 transition-all uppercase tracking-widest"
          >
            {t(LORE.continue, language)}
          </motion.button>
        </div>

        {/* Blood stains */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-red-900/20 rounded-full blur-xl rotate-45" />
        <div className="absolute bottom-10 left-10 w-24 h-12 bg-red-900/15 rounded-full blur-2xl -rotate-12" />
      </motion.div>
    </motion.div>
  );
};

export const OptionsModal = ({ isOpen, onClose, currentLanguage, onSetLanguage, onExport, onImport, onReset }: { 
  isOpen: boolean, 
  onClose: () => void, 
  currentLanguage: Language, 
  onSetLanguage: (lang: Language) => void,
  onExport: () => string,
  onImport: (save: string) => void,
  onReset: () => void
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-zinc-900 border-2 border-red-900 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-red-950/20">
              <div className="flex items-center gap-3">
                <Settings className="text-red-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  {currentLanguage === 'pt' ? 'Opções' : 'Options'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-red-500 font-bold block">
                  {currentLanguage === 'pt' ? 'Idioma' : 'Language'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onSetLanguage('en')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all border-2 ${
                      currentLanguage === 'en' 
                        ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-black/40 border-zinc-800 text-gray-500 hover:border-red-900/50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onSetLanguage('pt')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all border-2 ${
                      currentLanguage === 'pt' 
                        ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-black/40 border-zinc-800 text-gray-500 hover:border-red-900/50'
                    }`}
                  >
                    Português BR
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-red-500 font-bold block">
                  {currentLanguage === 'pt' ? 'Dados do Jogo' : 'Game Data'}
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const data = onExport();
                        const blob = new Blob([data], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `crimson_relics_save_${new Date().getTime()}.sav`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-3 bg-red-900/40 border-2 border-red-500 rounded-xl font-bold text-white hover:bg-red-800/50 transition-all text-xs"
                    >
                      {currentLanguage === 'pt' ? 'Exportar Arquivo' : 'Export File'}
                    </button>
                    <div className="relative">
                      <input
                        type="file"
                        id="save-file-input"
                        className="hidden"
                        accept=".sav,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const content = ev.target?.result as string;
                              if (content) onImport(content);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <button
                        onClick={() => document.getElementById('save-file-input')?.click()}
                        className="w-full px-4 py-3 bg-black/40 border-2 border-zinc-800 rounded-xl font-bold text-gray-300 hover:border-red-900/50 transition-all text-xs"
                      >
                        {currentLanguage === 'pt' ? 'Importar Arquivo' : 'Import File'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="save-data-area"
                    className="w-full h-20 bg-black/60 border border-zinc-800 rounded-xl p-3 text-[10px] font-mono text-gray-400 focus:border-red-900 outline-none resize-none"
                    placeholder={currentLanguage === 'pt' ? 'Ou cole o código aqui...' : 'Or paste code here...'}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const area = document.getElementById('save-data-area') as HTMLTextAreaElement;
                        if (area) {
                          area.value = onExport();
                          area.select();
                          document.execCommand('copy');
                        }
                      }}
                      className="px-4 py-2 bg-black/20 border border-zinc-800 rounded-lg font-bold text-gray-500 hover:text-gray-300 transition-all text-[10px] uppercase"
                    >
                      {currentLanguage === 'pt' ? 'Copiar Código' : 'Copy Code'}
                    </button>
                    <button
                      onClick={() => {
                        const area = document.getElementById('save-data-area') as HTMLTextAreaElement;
                        if (area && area.value) {
                          onImport(area.value);
                        }
                      }}
                      className="px-4 py-2 bg-black/20 border border-zinc-800 rounded-lg font-bold text-gray-500 hover:text-gray-300 transition-all text-[10px] uppercase"
                    >
                      {currentLanguage === 'pt' ? 'Colar Código' : 'Paste Code'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                <label className="text-xs uppercase tracking-widest text-red-500 font-bold block">
                  {currentLanguage === 'pt' ? 'Zona de Perigo' : 'Danger Zone'}
                </label>
                
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full px-4 py-3 bg-red-950/20 border-2 border-red-900/30 rounded-xl font-bold text-red-500 hover:bg-red-900/40 hover:border-red-500 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Skull size={14} />
                    {currentLanguage === 'pt' ? 'Resetar Progresso' : 'Reset Progress'}
                  </button>
                ) : (
                  <div className="space-y-3 p-4 bg-red-950/40 rounded-2xl border border-red-500/30">
                    <p className="text-[10px] text-red-200 uppercase tracking-widest text-center font-bold">
                      {currentLanguage === 'pt' ? 'Tem certeza? Todo o sangue será perdido!' : 'Are you sure? All blood will be lost!'}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          onReset();
                          setShowResetConfirm(false);
                          onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-red-500 transition-all"
                      >
                        {currentLanguage === 'pt' ? 'Sim, Resetar' : 'Yes, Reset'}
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg font-bold text-[10px] uppercase hover:bg-zinc-700 transition-all"
                      >
                        {currentLanguage === 'pt' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-black/40 border-t border-red-900/30 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-2 bg-red-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-800 transition-colors"
              >
                {currentLanguage === 'pt' ? 'Fechar' : 'Close'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LevelWinScreen = ({ onStart, score, level, bags, language }: ScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 bg-black/90 rounded-3xl border-4 border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <div className="mb-4 p-4 bg-red-900/20 rounded-full">
        <Trophy className="text-yellow-500" size={48} />
      </div>
      <h2 className="text-5xl font-bold text-red-600 uppercase tracking-tighter mb-2">
        {language === 'pt' ? 'Ritual Completo' : 'Ritual Complete'}
      </h2>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">
        {language === 'pt' ? `Nível ${level} Dominado` : `Level ${level} Mastered`}
      </p>
      
      <div className="grid grid-cols-1 gap-8 mb-12 w-full max-w-xs">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">
            {language === 'pt' ? 'Moedas de Sangue Ganhas' : 'Blood Coins Earned'}
          </span>
          <div className="flex items-center justify-center gap-2">
            <Coins className="text-red-500" size={20} />
            <span className="text-3xl font-bold text-red-500">+{bags}</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#8b0000' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          audioService.playSound('click');
          onStart();
        }}
        className="px-12 py-4 bg-red-900 text-white font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest"
      >
        {language === 'pt' ? 'Próximo Ritual' : 'Next Ritual'}
      </motion.button>
    </motion.div>
  );
};

export const GameOverScreen = ({ onStart, score, language }: ScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 bg-black/90 rounded-3xl border-4 border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <h2 className="text-5xl font-bold text-red-600 uppercase tracking-tighter mb-4">
        {language === 'pt' ? 'Ritual Falhou' : 'Ritual Failed'}
      </h2>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">
        {language === 'pt' ? 'A lua de sangue desaparece...' : 'The blood moon fades...'}
      </p>
      
      <div className="mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2">
          {language === 'pt' ? 'Essência Final Coletada' : 'Final Essence Collected'}
        </span>
        <span className="text-6xl font-black text-white tracking-tighter">{score?.toLocaleString()}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#8b0000' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          audioService.playSound('click');
          onStart();
        }}
        className="px-12 py-4 bg-red-900 text-white font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest"
      >
        {language === 'pt' ? 'Tentar Novamente' : 'Try Again'}
      </motion.button>
    </motion.div>
  );
};

export const RelicsScreen = ({ onStart, playerStats }: { onStart: () => void, playerStats: PlayerStats }) => {
  const lang = playerStats.language;
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center w-full max-w-4xl p-8 bg-black/90 rounded-3xl border-4 border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl overflow-y-auto max-h-[90vh]"
    >
      <div className="flex justify-between items-center w-full mb-8">
        <button 
          onClick={() => {
            audioService.playSound('click');
            onStart();
          }} 
          className="text-red-500 hover:text-red-400 flex items-center gap-2 uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> {lang === 'pt' ? 'Voltar' : 'Back'}
        </button>
        <h2 className="text-4xl font-black text-red-600 uppercase tracking-widest">
          {lang === 'pt' ? 'Relíquias Antigas' : 'Ancient Relics'}
        </h2>
        <div className="w-16" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-8">
        {RELICS.map((relic) => {
          const isUnlocked = playerStats.unlockedRelics.includes(relic.id);
          const Icon = RELIC_ICONS[relic.icon];
          
          return (
            <motion.div 
              key={relic.id}
              whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && setSelectedRelic(relic)}
              className={`
                relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer
                ${isUnlocked 
                  ? 'bg-red-950/30 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-glow-red' 
                  : 'bg-zinc-900/50 border-zinc-800 opacity-50 grayscale'}
              `}
            >
              <div className={`p-3 rounded-full ${isUnlocked ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                <Icon size={32} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">
                {t(relic.name, lang)}
              </span>
              {!isUnlocked && <Lock size={12} className="absolute top-2 right-2 text-zinc-600" />}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRelic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedRelic(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-zinc-900 border-2 border-red-600 p-8 rounded-3xl max-w-md w-full relative shadow-[0_0_50px_rgba(220,38,38,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedRelic(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="p-6 bg-red-600 rounded-full text-white mb-6 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                  {(() => { const Icon = RELIC_ICONS[selectedRelic.icon]; return <Icon size={48} />; })()}
                </div>
                
                <h3 className="text-sm uppercase tracking-[0.4em] text-red-500 font-bold mb-2">
                  {lang === 'pt' ? 'Relíquia Desbloqueada' : 'Relic Unlocked'}
                </h3>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  {t(selectedRelic.name, lang)}
                </h2>
                
                <div className="w-12 h-1 bg-red-600 mb-6 rounded-full" />
                
                <p className="text-gray-400 italic mb-6 leading-relaxed">
                  "{t(selectedRelic.lore, lang)}"
                </p>
                
                <div className="bg-red-950/40 border border-red-600/30 p-6 rounded-2xl w-full">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold mb-2 block">
                    {lang === 'pt' ? 'Bônus Ativo' : 'Active Bonus'}
                  </span>
                  <p className="text-xl font-bold text-white uppercase tracking-widest">
                    {t(selectedRelic.bonus, lang)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ComboFeedback = ({ text, comboCount }: { text: string | null, comboCount: number }) => {
  const getComboStyle = (count: number) => {
    if (count >= 6) return { color: '#ff0000', size: 'text-6xl md:text-9xl', glow: 'rgba(255, 0, 0, 0.9)', shake: 10, stroke: '3px white' }; // x6
    if (count === 5) return { color: '#a855f7', size: 'text-5xl md:text-8xl', glow: 'rgba(168, 85, 247, 0.8)', shake: 6, stroke: '2px white' }; // x5
    if (count === 4) return { color: '#3b82f6', size: 'text-4xl md:text-7xl', glow: 'rgba(59, 130, 246, 0.8)', shake: 4, stroke: 'none' }; // x4
    if (count === 3) return { color: '#22c55e', size: 'text-3xl md:text-6xl', glow: 'rgba(34, 197, 94, 0.8)', shake: 3, stroke: 'none' }; // x3
    return { color: '#eab308', size: 'text-2xl md:text-5xl', glow: 'rgba(234, 179, 8, 0.8)', shake: 2, stroke: 'none' }; // x2
  };

  const style = getComboStyle(comboCount);

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: [1, 1.2, 1],
            x: [0, -style.shake, style.shake, -style.shake, style.shake, 0], // Shaking effect
          }}
          transition={{
            x: { duration: 0.1, repeat: Infinity },
            scale: { duration: 0.2 },
            default: { duration: 0.3 }
          }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
        >
          <div 
            className={`${style.size} font-black uppercase tracking-widest italic text-center drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
            style={{ 
              color: style.color,
              textShadow: `0 0 20px ${style.glow}, 0 0 40px ${style.glow}`,
              WebkitTextStroke: style.stroke
            }}
          >
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RelicUnlockScreen = ({ relic, onStart, language }: { relic: Relic, onStart: () => void, language: Language }) => {
  const Icon = RELIC_ICONS[relic.icon];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="flex flex-col items-center text-center max-w-lg"
      >
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-red-600/20 rounded-full blur-[60px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative p-10 bg-red-900 rounded-full border-4 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.5)] text-white"
          >
            <Icon size={80} />
          </motion.div>
        </div>

        <h3 className="text-red-500 uppercase tracking-[0.4em] text-sm font-bold mb-2">
          {language === 'pt' ? 'Relíquia Recuperada' : 'Relic Recovered'}
        </h3>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">{t(relic.name, language)}</h2>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
          <p className="text-gray-400 italic mb-4">"{t(relic.lore, language)}"</p>
          <div className="h-[1px] w-12 bg-red-900 mx-auto mb-4" />
          <p className="text-xl font-bold text-red-500 uppercase tracking-widest">{t(relic.bonus, language)}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#8b0000' }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-12 py-4 bg-red-900 text-white font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest"
        >
          {language === 'pt' ? 'Reivindicar Poder' : 'Claim Power'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export const AchievementNotification = ({ achievement, language }: { achievement: Achievement, language: Language }) => {
  const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Medal;
  
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-24 right-4 z-[150] flex items-center gap-4 bg-zinc-900 border-2 border-yellow-600 p-4 rounded-xl shadow-[0_0_20px_rgba(202,138,4,0.3)] max-w-xs"
    >
      <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/50 text-yellow-500">
        <Icon size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold mb-1">
          {language === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!'}
        </span>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{t(achievement.name, language)}</h4>
      </div>
    </motion.div>
  );
};

export const AchievementsScreen = ({ unlockedAchievements = [], language, onBack }: { unlockedAchievements: string[], language: Language, onBack: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(ACHIEVEMENTS.length / itemsPerPage);
  
  const currentAchievements = ACHIEVEMENTS.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center w-full max-w-5xl p-8 bg-black/90 rounded-3xl border-4 border-yellow-900/30 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <div className="w-full flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-black/40 hover:bg-yellow-900/40 rounded-full border border-yellow-900/20 text-yellow-500 text-sm uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={18} />
          {language === 'pt' ? 'Voltar' : 'Back'}
        </button>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
          {language === 'pt' ? 'Conquistas' : 'Achievements'}
        </h2>
        <div className="flex items-center gap-4">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            className={`p-2 rounded-full border transition-all ${currentPage === 0 ? 'opacity-20 border-zinc-800' : 'hover:bg-yellow-900/40 border-yellow-900/20 text-yellow-500'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-yellow-500 font-mono text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            className={`p-2 rounded-full border transition-all ${currentPage === totalPages - 1 ? 'opacity-20 border-zinc-800' : 'hover:bg-yellow-900/40 border-yellow-900/20 text-yellow-500'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full col-span-3"
          >
            {currentAchievements.map(achievement => {
              const isUnlocked = unlockedAchievements?.includes(achievement.id);
              const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Medal;
              
              return (
                <motion.div 
                  key={achievement.id}
                  whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                  className={`flex flex-col items-center text-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    isUnlocked 
                      ? 'bg-zinc-900/80 border-yellow-600/50 shadow-[0_0_15px_rgba(202,138,4,0.1)] animate-glow-gold' 
                      : 'bg-black/40 border-zinc-800 opacity-40 grayscale'
                  }`}
                >
                  <div className={`p-4 rounded-xl border ${
                    isUnlocked ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-500' : 'bg-zinc-800 border-zinc-700 text-gray-500'
                  }`}>
                    <Icon size={32} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className={`font-bold text-sm uppercase tracking-tight mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {t(achievement.name, language)}
                    </h4>
                    <p className="text-[10px] text-gray-400 italic leading-tight">{t(achievement.description, language)}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const PowerUpNotification = ({ notification, language }: { notification: { name: LocalizedString, color: string } | null, language: Language }) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1.2, y: 0 }}
          exit={{ opacity: 0, scale: 1.5, y: -50 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          <div className="relative">
            {/* Glow Effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 blur-3xl rounded-full"
              style={{ backgroundColor: notification.color }}
            />
            
            <h2 
              className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] relative z-10 text-center px-4"
              style={{ 
                WebkitTextStroke: `1px ${notification.color}`,
                textShadow: `0 0 30px ${notification.color}`
              }}
            >
              {t(notification.name, language)}
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const BloodCodesModal = ({ isOpen, onClose, onApplyCode, language }: { isOpen: boolean, onClose: () => void, onApplyCode: (code: string) => void, language: Language }) => {
  const [code, setCode] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-zinc-950 border-2 border-red-900 p-8 rounded-3xl max-w-md w-full relative shadow-[0_0_50px_rgba(220,38,38,0.2)]"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                audioService.playSound('click');
                onClose();
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-900/20 rounded-full text-red-500 mb-6 border border-red-900/50">
                <Skull size={48} />
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                {language === 'pt' ? 'Códigos Sangrentos' : 'Blood Codes'}
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                {language === 'pt' ? 'Insira um código antigo para despertar poderes ocultos.' : 'Enter an ancient code to awaken hidden powers.'}
              </p>

              <div className="w-full space-y-4">
                <input 
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder={language === 'pt' ? 'INSIRA O CÓDIGO...' : 'ENTER CODE...'}
                  className="w-full bg-black border-2 border-red-900/30 rounded-xl px-6 py-4 text-center text-xl font-bold text-red-500 focus:border-red-600 outline-none transition-all placeholder:text-red-900/30"
                />

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#8b0000' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onApplyCode(code);
                    setCode('');
                  }}
                  className="w-full py-4 bg-red-900 text-white font-bold text-lg rounded-xl border border-red-500/30 shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all uppercase tracking-widest"
                >
                  {language === 'pt' ? 'Despertar' : 'Awaken'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LowMovesWarning = ({ moves }: { moves: number }) => {
  const [displayMoves, setDisplayMoves] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (moves > 0 && moves <= 3) {
      setDisplayMoves(moves);
      setKey(prev => prev + 1);

      const timer = setTimeout(() => {
        setDisplayMoves(null);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setDisplayMoves(null);
    }
  }, [moves]);

  return (
    <AnimatePresence mode="wait">
      {displayMoves !== null && (
        <motion.div
          key={`${key}-${displayMoves}`}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 3, rotate: 0 }}
          exit={{ opacity: 0, scale: 5, rotate: 10 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
        >
          <span 
            className="text-red-600 font-black archaic-text drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]"
            style={{ fontSize: '15rem' }}
          >
            {displayMoves}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
