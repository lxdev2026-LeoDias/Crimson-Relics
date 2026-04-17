import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Ghost, Droplet, Star, Coins, Target, ShoppingCart, X, FlaskConical, ArrowLeft, Flame, CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart, Trophy, Settings, Medal, ChevronLeft, ChevronRight, Zap, Check, Volume2, VolumeX, Timer, LogOut, Eye, Cloud } from 'lucide-react';
import { LevelGoal, PlayerStats, PowerUpType, Relic, LocalizedString, Language, Achievement, SpeedRunRecord, ExportOptions } from '../types';
import { PIECE_CONFIG, POWER_UPS, RELICS, LORE, ACHIEVEMENTS, FINAL_LORE, RESOLUTIONS, RELIC_MAX_LEVELS, RELIC_UPGRADE_INCREMENTS } from '../constants';
import { audioService } from '../services/audioService';

const RELIC_ICONS: Record<string, any> = {
  CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart
};

const ACHIEVEMENT_ICONS: Record<string, any> = {
  CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart, Medal, Zap, Flame, Skull, Trophy, Star
};

const BloodSea = () => (
  <div className="blood-sea-container">
    <div className="blood-sea" />
    {Array.from({ length: 15 }).map((_, i) => (
      <div 
        key={i} 
        className="blood-bubble" 
        style={{ 
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          '--duration': `${Math.random() * 2 + 1}s`,
          '--delay': `${Math.random() * 5}s`
        } as any} 
      />
    ))}
  </div>
);

const SeaOfBloodEnhanced = ({ isRising }: { isRising: boolean }) => {
  return (
    <div className="absolute bottom-0 left-[-10%] w-[120%] h-full overflow-hidden pointer-events-none z-0">
      {/* Deep Blood Layer */}
      <motion.div 
        animate={{ 
          height: isRising ? '60%' : '25%',
          transition: { duration: 5, ease: "easeInOut" }
        }}
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-950 via-red-900 to-transparent backdrop-blur-sm"
      />

      {/* Wave 1 */}
      <motion.div
        animate={{ 
          x: ["-50%", "0%"],
          y: [0, 15, 0],
          height: isRising ? '65%' : '32%'
        }}
        transition={{ 
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          height: { duration: 5, ease: "easeInOut" }
        }}
        className="absolute bottom-0 left-0 w-[200%] opacity-60"
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-red-900/80 filter drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">
          <path d="M0,60 C150,110 350,10 500,60 C650,110 850,10 1000,60 C1150,110 1350,10 1500,60 L1500,120 L0,120 Z" />
        </svg>
      </motion.div>

      {/* Wave 2 */}
      <motion.div
        animate={{ 
          x: ["0%", "-50%"],
          y: [10, -10, 10],
          height: isRising ? '62%' : '29%'
        }}
        transition={{ 
          x: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          height: { duration: 5, ease: "easeInOut" }
        }}
        className="absolute bottom-0 left-0 w-[200%] opacity-40"
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-red-800/60">
          <path d="M0,80 C200,30 400,130 600,80 C800,30 1000,130 1200,80 L1200,120 L0,120 Z" />
        </svg>
      </motion.div>

      {/* Straighter Base Layer for full width coverage */}
      <motion.div
        animate={{ 
          height: isRising ? '55%' : '15%'
        }}
        transition={{ duration: 5 }}
        className="absolute bottom-0 left-0 w-full bg-red-950/40 border-t border-red-500/20"
      />

      {/* Rising Bubbles from Sea */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sea-bubble-${i}`}
          initial={{ x: `${Math.random() * 100}%`, y: "100%", opacity: 0 }}
          animate={{ 
            y: ["100%", `${20 + Math.random() * 40}%`],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 rounded-full border border-red-500/30 bg-red-600/10 blur-[1px]"
        />
      ))}

      {/* Mist/Particles */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0 }}
            animate={{ 
              y: ["100%", (Math.random() * 50 + 20) + "%"],
              opacity: [0, 0.4, 0],
              scale: [1, 1.5, 2]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute w-32 h-32 bg-red-600/10 rounded-full blur-3xl"
          />
        ))}
      </div>

      {/* Shadows/Hands (Rare) */}
      {isRising && (
        <div className="absolute inset-0 flex items-center justify-around opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: [100, -20, 100], opacity: [0, 1, 0] }}
              transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
            >
              <Ghost size={64} className="text-black" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const AtmosphereLayers = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Constant Floating Particles */}
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%", 
          opacity: 0,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{ 
          y: ["-10%", "110%"],
          opacity: [0, 0.3, 0],
          x: (Math.random() * 100) + "%"
        }}
        transition={{ 
          duration: Math.random() * 20 + 20,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * -20
        }}
        className="absolute w-1 h-1 bg-red-500 rounded-full blur-[1px]"
      />
    ))}

    {/* Horizontal Mist */}
    <motion.div 
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-red-900/5 to-transparent blur-3xl"
    />
    <motion.div 
      animate={{ x: ["100%", "-100%"] }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-red-900/5 to-transparent blur-3xl"
    />

    {/* Ambient Lighting - Subtler */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.2)_100%)]" />
  </div>
);

const GothicWalls = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Left Wall Elements - Transparent and subtle */}
    <div className="absolute left-0 top-0 h-full w-[25%] opacity-30">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-around py-24 opacity-20">
        <Skull size={80} className="text-red-900 blur-[1px]" />
        <div className="text-red-900 font-cinzel text-7xl rotate-90 tracking-[0.5em] select-none font-black">ᚱᚢᚾᛖᛋ</div>
        <Eye size={64} className="text-red-900 animate-pulse" />
        <div className="text-red-900 font-cinzel text-7xl -rotate-90 tracking-[0.5em] select-none font-black">ᛒᛚᛟᛟᛞ</div>
        <Skull size={80} className="text-red-900 blur-[1px]" />
      </div>
      
      {/* Depth Shadow */}
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black to-transparent" />
      
      {/* Occasional Blood Drip on wall */}
      <div className="absolute top-1/4 left-1/2 w-[2px] h-40 bg-gradient-to-b from-red-900/0 via-red-600/20 to-red-900/0 blur-[1px] animate-pulse" />
    </div>

    {/* Right Wall Elements - Transparent and subtle */}
    <div className="absolute right-0 top-0 h-full w-[25%] opacity-30">
      <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-around py-24 opacity-20">
        <Skull size={80} className="text-red-900 blur-[1px]" />
        <div className="text-red-900 font-cinzel text-7xl -rotate-90 tracking-[0.5em] select-none font-black">ᛞᚨᚱᚲ</div>
        <Eye size={64} className="text-red-900 animate-pulse" />
        <div className="text-red-900 font-cinzel text-7xl rotate-90 tracking-[0.5em] select-none font-black">ᛋᛟᚢᛚ</div>
        <Skull size={80} className="text-red-900 blur-[1px]" />
      </div>

      {/* Depth Shadow */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black to-transparent" />
      
      {/* Occasional Blood Drip on wall */}
      <div className="absolute top-1/3 right-1/2 w-[2px] h-40 bg-gradient-to-b from-red-900/0 via-red-600/20 to-red-900/0 blur-[1px] animate-pulse" />
    </div>
  </div>
);

const MouseTrail = ({ trail }: { trail: { id: number, x: number, y: number }[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ left: p.x, top: p.y }}
            className="absolute w-2 h-2 bg-red-600 rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const FlamingSkull = ({ size, isWarning }: { size: number, isWarning: boolean }) => (
  <div className="relative flex items-center justify-center">
    <Skull size={size} className={isWarning ? 'text-red-500' : 'text-zinc-500'} />
    {/* Precisely positioned eyes within the Lucide Skull icon sockets */}
    <div className="absolute top-[42%] left-[29%] w-[14%] h-[14%] rounded-full blur-[1px] flaming-eye shadow-[0_0_10px_#ff0000] z-10" />
    <div className="absolute top-[42%] right-[29%] w-[14%] h-[14%] rounded-full blur-[1px] flaming-eye shadow-[0_0_10px_#ff0000] z-10" />
    <div className="absolute inset-0 bg-red-600/5 blur-xl rounded-full animate-pulse" />
  </div>
);

interface HUDProps {
  score: number;
  currentMatchScore: number;
  moves: number;
  goals: LevelGoal[];
  playerStats: PlayerStats;
  onOpenShop: () => void;
  onBackToMenu: () => void;
  onSelectTitle: (titleId: string) => void;
  isSpeedRun?: boolean;
  speedRunLevelIndex?: number;
  currentLevelTime?: number;
  totalSpeedRunTime?: number;
  speedRunCoins?: number;
  onExplodeEntity?: () => void;
}

const t = (str: LocalizedString | string, lang: Language) => {
  if (typeof str === 'string') return str;
  return str[lang] || str['en'];
};

export const HUD = ({ 
  score, 
  currentMatchScore, 
  moves, 
  goals, 
  playerStats, 
  onOpenShop, 
  onBackToMenu, 
  onSelectTitle,
  isSpeedRun,
  speedRunLevelIndex,
  currentLevelTime,
  totalSpeedRunTime,
  speedRunCoins,
  onExplodeEntity
}: HUDProps) => {
  const lang = playerStats.language;
  const [isTitleSelectorOpen, setIsTitleSelectorOpen] = useState(false);

  const unlockedTitles = ACHIEVEMENTS.filter(a => playerStats.unlockedAchievements.includes(a.id));
  const currentTitle = unlockedTitles.find(a => a.id === playerStats.selectedTitleId) || unlockedTitles[0];

  return (
    <div className="flex flex-col w-full max-w-5xl gap-2 mb-2 relative z-50 p-3 bg-zinc-950/70 rounded-full border border-red-900/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      {/* Decorative Top Border */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      
      {/* Speedrun Timers - Compacted */}
      {isSpeedRun && currentLevelTime !== undefined && totalSpeedRunTime !== undefined && (
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black/90 px-4 py-1 rounded-full border border-yellow-600/40 backdrop-blur-xl z-50 shadow-[0_0_20px_rgba(202,138,4,0.2)]"
        >
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-widest text-yellow-500/80 font-black">{lang === 'pt' ? 'Fase' : 'Stage'}</span>
            <span className="text-[10px] font-mono font-black text-yellow-500">{currentLevelTime.toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-widest text-yellow-500/80 font-black">{lang === 'pt' ? 'Total' : 'Total'}</span>
            <span className="text-[10px] font-mono font-black text-yellow-500">{totalSpeedRunTime.toFixed(1)}s</span>
          </div>
        </motion.div>
      )}

      {/* Compact Top Bar */}
      <div className="flex justify-between items-center gap-6 px-4">
        <button 
          onClick={() => {
            audioService.playSound('click');
            onBackToMenu();
          }}
          className="flex items-center gap-2 px-8 py-4 bg-red-500/90 hover:bg-red-400 rounded-full border-2 border-red-400/50 text-white text-base uppercase tracking-[0.2em] transition-all font-black shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} />
          {lang === 'pt' ? 'Menu' : 'Menu'}
        </button>

        <div className="flex items-center gap-10">
          {/* Ritual Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <Sword className="text-red-500" size={34} />
              <span className="text-3xl font-black uppercase tracking-[0.4em] text-zinc-100 drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                {isSpeedRun ? `${lang === 'pt' ? 'Fase' : 'Stage'} ${(speedRunLevelIndex || 0) + 1}` : `Ritual ${playerStats.level}`}
              </span>
            </div>
            {/* Player Title */}
            {unlockedTitles.length > 0 && (
              <div className="relative mt-1">
                <button 
                  onClick={() => {
                    if (unlockedTitles.length > 1) {
                      audioService.playSound('click');
                      setIsTitleSelectorOpen(!isTitleSelectorOpen);
                    }
                  }}
                  className={`flex items-center gap-2 group ${unlockedTitles.length > 1 ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className="text-sm font-black text-red-500 uppercase tracking-[0.3em] group-hover:text-red-400 transition-colors">
                    {currentTitle ? t(currentTitle.title, lang) : '---'}
                  </span>
                  {unlockedTitles.length > 1 && <ChevronRight size={14} className={`text-red-600/40 transition-transform ${isTitleSelectorOpen ? 'rotate-90' : ''}`} />}
                </button>

                <AnimatePresence>
                  {isTitleSelectorOpen && (
                    <>
                      {/* Backdrop to close on outside click and ensure priority */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsTitleSelectorOpen(false)}
                        className="absolute inset-0 z-[1999] bg-black/40 backdrop-blur-sm"
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 z-[2000] bg-zinc-950 border-2 border-red-600/50 rounded-[2rem] p-6 shadow-[0_0_80px_rgba(0,0,0,1),0_0_30px_rgba(220,38,38,0.3)] min-w-[320px] max-h-[400px] overflow-y-auto backdrop-blur-3xl title-selector-overlay"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="text-[10px] uppercase tracking-[0.4em] text-red-500 font-black mb-2 text-center border-b border-red-900/30 pb-3">
                            {lang === 'pt' ? 'Escolha seu Título' : 'Choose your Title'}
                          </div>
                          {unlockedTitles.map(title => (
                            <motion.button
                              key={title.id}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                audioService.playSound('click');
                                onSelectTitle(title.id);
                                setIsTitleSelectorOpen(false);
                              }}
                              className={`w-full text-left px-5 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all border ${
                                playerStats.selectedTitleId === title.id 
                                  ? 'bg-red-600 text-white font-black border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                                  : 'text-zinc-400 border-zinc-800/50 hover:bg-red-900/40 hover:text-red-300 hover:border-red-900/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{t(title.title, lang)}</span>
                                {playerStats.selectedTitleId === title.id && <Check size={14} />}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Steps */}
          <div className="flex items-center gap-4 bg-black/60 px-5 py-2.5 rounded-3xl border border-red-900/40 shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]">
            <span className={`text-3xl font-black tabular-nums ${moves <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-100'}`}>
              {moves}
            </span>
            <FlamingSkull size={64} isWarning={moves <= 5} />
          </div>

          {/* Coins */}
          <div className="flex items-center gap-3 bg-black/70 px-4 py-2 rounded-full border border-red-900/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]">
            <Coins className="text-red-500" size={18} />
            <span className="text-base font-black text-zinc-100 tabular-nums">
              {isSpeedRun ? speedRunCoins : playerStats.bloodCoins}
            </span>
            <button 
              onClick={() => {
                audioService.playSound('click');
                onOpenShop();
              }}
              className="ml-2 p-1 hover:bg-red-900/50 rounded-full transition-all text-red-500 hover:scale-110 active:scale-95"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShadowEntityProps {
  comboCount: number;
  mistakeCount: number;
  language: Language;
  onExplode?: () => void;
  level: number;
}

const ShadowEntity = ({ comboCount, mistakeCount, language, onExplode, level }: ShadowEntityProps) => {
  const [state, setState] = useState<'idle' | 'low' | 'medium' | 'high' | 'extreme' | 'mistake' | 'angry' | 'exploded' | 'hungry' | 'recovering'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [idleTime, setIdleTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastExplosionTime, setLastExplosionTime] = useState(0);
  const [hasShownReturnMessage, setHasShownReturnMessage] = useState(false);
  const [hasExplodedThisLevel, setHasExplodedThisLevel] = useState(false);
  const lastComboRef = useRef(0);
  const lastMistakeRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const phrases = {
    idle: language === 'pt' ? 
      [
        'Estou esperando...', 'Não pare...', 'O tempo urge...', 'humm...', 'ham?', 'grrrr...', 
        'Sinto o cheiro do medo...', 'O vazio observa...', 'O silêncio é ensurdecedor.',
        'Vai chover hoje? Sangue, talvez...', 'Você já assistiu "True Blood?" É muito bom... nutritivo.',
        'The Walking Dead... Ah The Walking Dead... sinto falta do cheiro de carne fresca.',
        'American... Horror... Story? Minha vida é um horror constante.',
        'PANIC MUAHAHAHA! O medo é o melhor tempero.', '13 friday? hum... meu dia favorito.',
        'Onde está o seu Deus agora?', 'Sinto o gosto da sua alma... um pouco salgada.',
        'Você já viu o que tem debaixo da sua cama?', 'O escuro não é o problema... é o que vive nele.'
      ] : 
      [
        'I am waiting...', 'Do not stop...', 'Time is pressing...', 'humm...', 'ham?', 'grrrr...', 
        'I smell fear...', 'The void watches...', 'The silence is deafening.',
        'Will it rain today? Blood, perhaps...', 'Have you watched "True Blood?" It is very good... nutritious.',
        'The Walking Dead... Ah The Walking Dead... I miss the smell of fresh meat.',
        'American... Horror... Story? My life is a constant horror.',
        'PANIC MUAHAHAHA! Fear is the best seasoning.', '13 friday? hum... my favorite day.',
        'Where is your God now?', 'I can taste your soul... a bit salty.',
        'Have you seen what is under your bed?', 'The dark is not the problem... it is what lives in it.'
      ],
    hungry: language === 'pt' ?
      ['ESTOU COM FOME...', 'CADÊ O SANGUE?', 'NÃO ME DEIXE ESPERAR!', 'A SEDE AUMENTA...', 'ALIMENTE O VAZIO!'] :
      ['I AM HUNGRY...', 'WHERE IS THE BLOOD?', 'DO NOT MAKE ME WAIT!', 'THE THIRST GROWS...', 'FEED THE VOID!'],
    low: language === 'pt' ? ['Foi só isso?', 'Mais...', 'Fraco.', 'Apenas um começo.', 'Um pequeno sacrifício.'] : ['Was that all?', 'More...', 'Weak.', 'Just a beginning.', 'A small sacrifice.'],
    medium: language === 'pt' ? ['Interessante...', 'Continue...', 'Sinta o poder.', 'A essência flui.', 'Seu potencial desperta.'] : ['Interesting...', 'Continue...', 'Feel the power.', 'The essence flows.', 'Your potential awakens.'],
    high: language === 'pt' ? ['MAIS!', 'ALIMENTE-ME!', 'ISSO!', 'SANGUE!', 'MAGNÍFICO!', 'A ESCURIDÃO SE REGALEIA!'] : ['MORE!', 'FEED ME!', 'YES!', 'BLOOD!', 'MAGNIFICENT!', 'THE DARKNESS FEASTS!'],
    extreme: language === 'pt' ? ['BRUTAL', 'CARNIFICINA', 'DESTRUIDOR DE ALMAS', 'APOCALIPSE', 'DIVINDADE SOMBRIA', 'O CAOS REINA'] : ['BRUTAL', 'CARNAGE', 'SOUL DESTROYER', 'APOCALYPSE', 'DARK DIVINITY', 'CHAOS REIGNS'],
    mistake: language === 'pt' ? ['Decepcionante...', 'Fraqueza...', 'Tolo.', 'Errar é humano... e patético.', 'Minha paciência tem limites.'] : ['Disappointing...', 'Weakness...', 'Fool.', 'To err is human... and pathetic.', 'My patience has limits.'],
    annoyed: language === 'pt' ? ['Pare com isso.', 'Não me toque.', 'O que você quer?', 'Saia daqui.', 'Isso é irritante.'] : ['Stop that.', 'Do not touch me.', 'What do you want?', 'Get away.', 'This is annoying.'],
    angry: language === 'pt' ? ['VOCÊ OUSA?!', 'CHEGA!', 'VOU TE DESTRUIR!', 'NÃO ME PROVOQUE!', 'SUA ALMA SERÁ MINHA!'] : ['YOU DARE?!', 'ENOUGH!', 'I WILL DESTROY YOU!', 'DO NOT PROVOKE ME!', 'YOUR SOUL WILL BE MINE!'],
    laugh: language === 'pt' ? ['HAHAHAHA!', 'Você achou que se livraria de mim?', 'O sangue me fortalece!', 'Tolo mortal!', 'Eu sou eterno!'] : ['HAHAHAHA!', 'Did you think you would get rid of me?', 'The blood strengthens me!', 'Foolish mortal!', 'I am eternal!'],
    recovering: language === 'pt' ? ['Estou me recompondo...', 'Aguarde...', 'O sangue voltará.', 'Minha forma é eterna.'] : ['I am recovering...', 'Wait...', 'The blood will return.', 'My form is eternal.'],
  };

  const handleClick = () => {
    if (state === 'exploded' || state === 'recovering') {
      if (state === 'recovering' && !hasShownReturnMessage) {
        setHasShownReturnMessage(true);
        setMessage('...');
        setTimeout(() => {
          setMessage(language === 'pt' ? 'eu vou voltar...' : 'i will return...');
          setTimeout(() => setMessage(null), 2000);
        }, 1500);
      } else if (state === 'recovering') {
        setMessage(language === 'pt' ? 'Não agora... estou fraco.' : 'Not now... I am weak.');
        setTimeout(() => setMessage(null), 2000);
      }
      return;
    }

    setIdleTime(0);
    setClickCount(prev => prev + 1);

    // Reset click count after 2 seconds of no clicking
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setClickCount(0), 2000);

    const now = Date.now();
    const cooldown = 3 * 60 * 1000; // 3 minutes

    if (clickCount >= 15) {
      if (now - lastExplosionTime > cooldown) {
        explode();
      } else {
        setState('angry');
        setMessage(language === 'pt' ? 'AINDA NÃO... ESPERE!' : 'NOT YET... WAIT!');
        setTimeout(() => setMessage(null), 2000);
      }
      return;
    }

    if (clickCount > 10) {
      setState('angry');
      const possiblePhrases = phrases.angry;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
    } else if (clickCount > 3) {
      const possiblePhrases = phrases.annoyed;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
    }
    
    setTimeout(() => {
      if (state === 'angry' || state === 'idle' || state === 'hungry') setMessage(null);
    }, 2000);
  };

  const explode = (isVisualOnly: boolean = false) => {
    setState('exploded');
    setMessage(null);
    setLastExplosionTime(Date.now());
    setClickCount(0);
    setHasExplodedThisLevel(true);
    audioService.playSound('levelWin');
    if (onExplode && !isVisualOnly) onExplode();

    setTimeout(() => {
      setState('recovering');
      const possiblePhrases = phrases.laugh;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
      setTimeout(() => setMessage(null), 4000);
      
      // Recovery period: 3 minutes
      setTimeout(() => {
        setState('idle');
      }, 3 * 60 * 1000);
    }, 2500);
  };

  useEffect(() => {
    setHasExplodedThisLevel(false);
  }, [level]);

  useEffect(() => {
    if (state === 'exploded' || state === 'angry' || state === 'recovering') return;
    if (comboCount > 0) {
      setIdleTime(0);
      if (comboCount >= 10) {
        setState('extreme');
        if (!hasExplodedThisLevel) {
          explode(true);
        }
      }
      else if (comboCount >= 7) setState('high');
      else if (comboCount >= 4) setState('medium');
      else setState('low');

      if (comboCount > lastComboRef.current) {
        const category = comboCount >= 10 ? 'extreme' : comboCount >= 7 ? 'high' : comboCount >= 4 ? 'medium' : 'low';
        const possiblePhrases = phrases[category as keyof typeof phrases] as string[];
        setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
        setTimeout(() => setMessage(null), 3000);
      }
      lastComboRef.current = comboCount;
    } else {
      lastComboRef.current = 0;
      if (state !== 'mistake' && state !== 'hungry') setState('idle');
    }
  }, [comboCount, language, state]);

  useEffect(() => {
    if (state === 'exploded' || state === 'angry' || state === 'recovering') return;
    if (mistakeCount > lastMistakeRef.current) {
      setIdleTime(0);
      setState('mistake');
      const possiblePhrases = phrases.mistake;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
      setTimeout(() => {
        setMessage(null);
        setState('idle');
      }, 3000);
    }
    lastMistakeRef.current = mistakeCount;
  }, [mistakeCount, language, state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state === 'exploded' || state === 'angry' || state === 'recovering') return;
    
    if (idleTime > 20 && comboCount === 0) {
      setState('hungry');
      const possiblePhrases = phrases.hungry;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
      setIdleTime(0);
    } else if (idleTime > 8 && comboCount === 0 && state !== 'hungry') {
      const possiblePhrases = phrases.idle;
      setMessage(possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)]);
      setTimeout(() => setMessage(null), 3000);
      setIdleTime(0);
    }
  }, [idleTime, comboCount, language, state]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
      {/* Entity Shape */}
      <AnimatePresence>
        {state !== 'exploded' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: state === 'extreme' ? [1, 1.1, 1] : state === 'mistake' ? 0.8 : state === 'angry' || state === 'hungry' ? [1, 1.2, 1] : state === 'recovering' ? 0.9 : [1, 1.05, 1],
              rotate: state === 'extreme' ? [-2, 2, -2] : state === 'angry' || state === 'hungry' ? [-5, 5, -5] : 0,
              filter: state === 'mistake' ? 'hue-rotate(90deg) blur(10px)' : state === 'angry' || state === 'hungry' ? 'hue-rotate(-45deg) blur(5px)' : state === 'recovering' ? 'grayscale(0.8) blur(12px) opacity(0.5)' : 'hue-rotate(0deg) blur(8px)',
              opacity: state === 'recovering' ? 0.4 : 1,
            }}
            exit={{ scale: 2, opacity: 0, filter: 'blur(20px) brightness(2)' }}
            transition={{ duration: state === 'extreme' ? 0.2 : state === 'angry' || state === 'hungry' ? 0.1 : 3, repeat: state === 'idle' || state === 'extreme' || state === 'angry' || state === 'hungry' || state === 'recovering' ? Infinity : 0 }}
            onClick={handleClick}
            className={`w-32 h-32 rounded-full cursor-pointer pointer-events-auto bg-gradient-to-br from-red-950 via-black to-red-900/20 flex items-center justify-center relative ${
              state === 'extreme' ? 'shadow-[0_0_80px_rgba(220,38,38,0.6)]' : 
              state === 'angry' || state === 'hungry' ? 'shadow-[0_0_100px_rgba(255,0,0,0.8)]' : 
              state === 'recovering' ? 'shadow-none' : 'shadow-[0_0_50px_rgba(220,38,38,0.2)]'
            }`}
          >
            {/* Eyes */}
            <div className="flex gap-8">
              <motion.div 
                animate={{ 
                  scaleY: state === 'mistake' ? 0.2 : state === 'recovering' ? 0.1 : [1, 0.1, 1],
                  x: state === 'idle' ? [0, 2, -2, 0] : state === 'angry' || state === 'hungry' ? [0, 4, -4, 0] : 0,
                  boxShadow: state === 'extreme' || state === 'angry' || state === 'hungry' ? '0 0 20px #ff0000' : state === 'recovering' ? 'none' : '0 0 10px #990000',
                  backgroundColor: state === 'angry' || state === 'hungry' ? '#ff0000' : state === 'recovering' ? '#330000' : '#dc2626'
                }}
                transition={{ 
                  scaleY: { duration: 4, repeat: Infinity, delay: 1 },
                  x: { duration: state === 'angry' || state === 'hungry' ? 0.2 : 5, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`w-4 h-6 rounded-full ${state === 'mistake' ? 'bg-purple-900' : ''}`} 
              />
              <motion.div 
                animate={{ 
                  scaleY: state === 'mistake' ? 0.2 : state === 'recovering' ? 0.1 : [1, 0.1, 1],
                  x: state === 'idle' ? [0, 2, -2, 0] : state === 'angry' || state === 'hungry' ? [0, 4, -4, 0] : 0,
                  boxShadow: state === 'extreme' || state === 'angry' || state === 'hungry' ? '0 0 20px #ff0000' : state === 'recovering' ? 'none' : '0 0 10px #990000',
                  backgroundColor: state === 'angry' || state === 'hungry' ? '#ff0000' : state === 'recovering' ? '#330000' : '#dc2626'
                }}
                transition={{ 
                  scaleY: { duration: 4, repeat: Infinity, delay: 1.1 },
                  x: { duration: state === 'angry' || state === 'hungry' ? 0.2 : 5, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`w-4 h-6 rounded-full ${state === 'mistake' ? 'bg-purple-900' : ''}`} 
              />
            </div>

            {/* Particles */}
            {state !== 'recovering' && [...Array(state === 'extreme' || state === 'angry' || state === 'hungry' ? 16 : 8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-20, -100],
                  x: [0, (i % 2 === 0 ? 30 : -30)],
                  opacity: [0, 0.5, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: state === 'extreme' || state === 'angry' || state === 'hungry' ? 0.8 : 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className={`absolute w-1 h-1 rounded-full ${state === 'angry' || state === 'hungry' ? 'bg-red-400' : 'bg-red-500'}`}
                style={{ left: '50%', top: '50%' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blood Explosion Particles */}
      {state === 'exploded' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ 
                x: (Math.random() - 0.5) * 300, 
                y: (Math.random() - 0.5) * 300, 
                scale: [0, Math.random() * 4, 0],
                opacity: [1, 0.8, 0]
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-4 h-4 bg-red-700 rounded-full blur-[2px]"
            />
          ))}
        </div>
      )}

      {/* Dynamic Text */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className={`absolute bottom-4 text-center font-cinzel font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] ${
              state === 'extreme' || state === 'angry' || state === 'hungry' ? 'text-amber-400 text-xl shadow-amber-500/50' : 'text-amber-200/90 text-sm'
            }`}
            style={{
              textShadow: state === 'extreme' || state === 'angry' || state === 'hungry' ? '0 0 15px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.4)' : '0 0 10px rgba(251, 191, 36, 0.5)'
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidePanelProps {
  goals: LevelGoal[];
  playerStats: PlayerStats;
  score: number;
  currentMatchScore: number;
  comboCount: number;
  mistakeCount?: number;
  isSpeedRun?: boolean;
  levelTimes?: number[];
  currentLevelTime?: number;
  speedRunLevelIndex?: number;
  onExplodeEntity?: () => void;
}

export const GameplayPanel = ({ 
  goals, 
  playerStats, 
  comboCount,
  mistakeCount = 0,
  isSpeedRun, 
  levelTimes = [], 
  currentLevelTime = 0, 
  speedRunLevelIndex = 0,
  onExplodeEntity
}: SidePanelProps) => {
  const lang = playerStats.language;
  
  return (
    <div className="flex flex-col gap-6 w-80 h-[600px] p-8 bg-zinc-950/60 rounded-[3rem] border border-red-900/40 backdrop-blur-xl card-glow relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-4 border-b border-red-900/40 pb-4">
          <Target size={24} className="text-red-500" />
          <span className="text-sm uppercase tracking-[0.4em] text-red-500 font-black">
            {lang === 'pt' ? 'Objetivos' : 'Objectives'}
          </span>
        </div>
        <div className="space-y-4">
          {goals.map((goal, idx) => {
            const Config = goal.type === 'score' ? { icon: Star, color: '#eab308' } : PIECE_CONFIG[goal.type as keyof typeof PIECE_CONFIG];
            const Icon = Config.icon;
            const isComplete = goal.current >= goal.target;
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            
            return (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Icon size={20} color={isComplete ? '#22c55e' : Config.color} className={isComplete ? '' : 'icon-bright'} />
                    <span className={`text-sm font-black uppercase tracking-widest ${isComplete ? 'text-green-500' : 'text-zinc-200'}`}>
                      {goal.type === 'score' ? (lang === 'pt' ? 'Pontos' : 'Score') : (lang === 'pt' ? 'Essência' : 'Essence')}
                    </span>
                  </div>
                  <span className={`text-sm font-mono font-black ${isComplete ? 'text-green-500' : 'text-zinc-100'}`}>
                    {goal.type === 'score' ? `${Math.floor(goal.current/1000)}k/${Math.floor(goal.target/1000)}k` : `${goal.current}/${goal.target}`}
                  </span>
                </div>
                <div className="h-2 bg-black/80 rounded-full overflow-hidden border border-red-900/30 p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full progress-glow ${isComplete ? 'bg-green-500' : 'bg-red-600'} shadow-[0_0_20px_rgba(220,38,38,0.5)]`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shadow Entity Section */}
      <ShadowEntity 
        comboCount={comboCount} 
        mistakeCount={mistakeCount} 
        language={lang} 
        onExplode={onExplodeEntity} 
        level={playerStats.level}
      />

      {/* Speedrun Section - Integrated into Left Panel */}
      {isSpeedRun && (
        <div className="space-y-4 relative z-10 border-t border-red-900/20 pt-6">
          <div className="flex items-center gap-4 border-b border-yellow-900/40 pb-3">
            <Timer size={20} className="text-yellow-500" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-black">
              {lang === 'pt' ? 'Tempos do Ritual' : 'Ritual Times'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
            {Array.from({ length: 10 }).map((_, i) => {
              const time = i < levelTimes.length ? levelTimes[i] : (i === speedRunLevelIndex ? currentLevelTime : null);
              return (
                <div key={i} className={`flex flex-col p-1.5 rounded-lg border transition-all ${i === speedRunLevelIndex ? 'bg-yellow-900/30 border-yellow-600/50 shadow-[0_0_10px_rgba(202,138,4,0.1)]' : 'bg-black/40 border-yellow-900/10'}`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[7px] uppercase tracking-widest text-yellow-500/40 font-black">R{i + 1}</span>
                    {i === speedRunLevelIndex && <div className="w-1 h-1 bg-yellow-500 rounded-full animate-ping" />}
                  </div>
                  <span className={`text-[9px] font-mono font-black tabular-nums ${i === speedRunLevelIndex ? 'text-yellow-400' : (time !== null ? 'text-yellow-500/80' : 'text-yellow-900/20')}`}>
                    {time !== null ? formatTime(time) : '--:--:---'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BloodSea />
    </div>
  );
};

export const ProgressPanel = ({ score, playerStats, currentMatchScore }: SidePanelProps) => {
  const lang = playerStats.language;
  const progressToRelic = ((playerStats.level - 1) % 10) * 10;
  
  const [flyingPoints, setFlyingPoints] = useState<{ id: number, value: number }[]>([]);
  const [lastMatchScore, setLastMatchScore] = useState(0);

  useEffect(() => {
    if (currentMatchScore === 0 && lastMatchScore > 0) {
      const id = Date.now();
      setFlyingPoints(prev => [...prev, { id, value: lastMatchScore }]);
      setTimeout(() => {
        setFlyingPoints(prev => prev.filter(p => p.id !== id));
      }, 800);
    }
    setLastMatchScore(currentMatchScore);
  }, [currentMatchScore, lastMatchScore]);

  return (
    <div className="flex flex-col gap-8 w-80 h-[600px] p-8 bg-zinc-950/60 rounded-[3rem] border border-red-900/40 backdrop-blur-xl card-glow relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-4 border-b border-red-900/40 pb-4">
          <Droplet size={24} className="text-red-500" />
          <span className="text-sm uppercase tracking-[0.4em] text-red-500 font-black">
            {lang === 'pt' ? 'Essência Coletada' : 'Essence Collected'}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <motion.span 
            key={score}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            className="text-5xl font-black text-zinc-100 tabular-nums drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {score.toLocaleString()}
          </motion.span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-4 border-b border-red-900/40 pb-4">
          <Hourglass size={24} className="text-red-500" />
          <span className="text-sm uppercase tracking-[0.4em] text-red-500 font-black">
            {lang === 'pt' ? 'Progresso do Ritual' : 'Ritual Progress'}
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400 font-black">
            <span>{lang === 'pt' ? 'Ritual' : 'Ritual'} {playerStats.level}</span>
            <span>{lang === 'pt' ? 'Próxima Relíquia' : 'Next Relic'}</span>
          </div>
          <div className="h-3 bg-black/80 rounded-full overflow-hidden border border-red-900/40 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToRelic}%` }}
              className="h-full bg-gradient-to-r from-red-900 to-red-500 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)] progress-glow"
            />
          </div>
          <div className="text-center relative">
            <span className="text-sm font-black text-red-500 uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              {progressToRelic}%
            </span>

            {/* Real-time Score Display */}
            <AnimatePresence>
              {currentMatchScore > 0 && (
                <motion.div
                  key="real-time-score"
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    x: [0, -3, 3, -3, 3, 0],
                  }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute top-full left-0 right-0 mt-4 flex justify-center"
                >
                  <motion.span 
                    key={currentMatchScore}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -2, 2, -2, 2, 0]
                    }}
                    className="text-4xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] italic"
                  >
                    +{currentMatchScore.toLocaleString()}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flying Points Animation */}
            <AnimatePresence>
              {flyingPoints.map(fp => (
                <motion.div
                  key={fp.id}
                  initial={{ opacity: 1, scale: 1, y: 20, x: "-50%" }}
                  animate={{ 
                    opacity: 0, 
                    scale: 0.5, 
                    y: -350, // Fly up towards the total score
                    x: "-50%"
                  }}
                  transition={{ duration: 0.8, ease: "circIn" }}
                  className="absolute left-1/2 pointer-events-none z-50"
                >
                  <span className="text-4xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                    +{fp.value.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BloodSea />
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
  isSpeedRun?: boolean;
}

export const FinalLoreScreen = ({ onStart, language }: ScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-red-600 rounded-full blur-[80px] opacity-20 animate-pulse" />
          <Crown size={120} className="text-red-600 relative z-10 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-black text-red-600 uppercase tracking-widest mb-8 metallic-title"
        >
          {t(FINAL_LORE.title, language)}
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-zinc-300 text-lg leading-relaxed mb-12 italic font-serif"
        >
          {t(FINAL_LORE.content, language).split('\n\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </motion.div>

        <GothicButton onClick={onStart}>
          {language === 'pt' ? 'Reivindicar Legado' : 'Claim Legacy'}
        </GothicButton>
      </div>
    </motion.div>
  );
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
};


export const SpeedRunStats = ({ speedRunRecords = [], language, onBack }: { lastSpeedRun?: SpeedRunRecord | null, speedRunRecords?: SpeedRunRecord[], language: Language, onBack: () => void }) => {
  // Only top 3
  const top3 = speedRunRecords.slice(0, 3);

  const renderRecord = (rec: SpeedRunRecord, i: number) => {
    const isFirst = i === 0;
    const isSecond = i === 1;
    const isThird = i === 2;
    
    let trophyColor = "text-yellow-500";
    let glowColor = "rgba(234, 179, 8, 0.3)";
    let scale = 1;
    let fontSize = "text-2xl";
    let iconSize = 48;

    if (isFirst) {
      trophyColor = "text-yellow-400";
      glowColor = "rgba(234, 179, 8, 0.5)";
      scale = 1.1;
      fontSize = "text-3xl";
      iconSize = 64;
    } else if (isSecond) {
      trophyColor = "text-zinc-300";
      glowColor = "rgba(212, 212, 216, 0.3)";
      scale = 1;
      fontSize = "text-xl";
      iconSize = 48;
    } else if (isThird) {
      trophyColor = "text-amber-700";
      glowColor = "rgba(180, 83, 9, 0.2)";
      scale = 0.95;
      fontSize = "text-lg";
      iconSize = 40;
    }

    return (
      <motion.div
        key={i}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: i * 0.2 }}
        style={{ scale }}
        className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-500 w-full ${
          isFirst ? 'bg-yellow-900/10 border-yellow-600/40 shadow-[0_0_30px_rgba(234,179,8,0.15)]' :
          isSecond ? 'bg-zinc-900/10 border-zinc-600/30' :
          'bg-amber-900/5 border-amber-900/20'
        }`}
      >
        {isFirst && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl bg-yellow-500/5 blur-xl pointer-events-none" 
          />
        )}

        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={isFirst ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy size={iconSize} className={`${trophyColor} drop-shadow-[0_0_15px_${glowColor}]`} />
          </motion.div>

          <div className="flex flex-col items-center">
            <span className={`font-black uppercase tracking-widest font-cinzel ${fontSize} ${isFirst ? 'text-yellow-500' : isSecond ? 'text-zinc-300' : 'text-amber-700'}`}>
              {rec.playerTitle ? `${rec.playerTitle} ` : ''}{rec.playerName || (language === 'pt' ? 'Anônimo' : 'Anonymous')}
            </span>
            <span className={`font-mono font-black ${isFirst ? 'text-4xl text-yellow-400' : 'text-2xl text-zinc-400'}`}>
              {formatTime(rec.totalTime)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mt-2">
              {new Date(rec.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-hidden"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%",
              opacity: 0 
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ 
          scale: 1, 
          y: 0, 
          opacity: 1,
          boxShadow: [
            "0 0 100px rgba(0,0,0,1), 0 0 40px rgba(153,27,27,0.2)",
            "0 0 100px rgba(0,0,0,1), 0 0 60px rgba(153,27,27,0.3)",
            "0 0 100px rgba(0,0,0,1), 0 0 40px rgba(153,27,27,0.2)"
          ]
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          y: { duration: 0.5 },
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-full max-w-5xl"
      >
        {/* Gothic Frame */}
        <div className="relative bg-zinc-950/90 border-4 border-red-950 rounded-[3rem] p-8 md:p-12 overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-red-950/10 pointer-events-none" />
          
          {/* Ornaments */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 text-red-900/40 font-cinzel text-4xl">♰</div>
            <div className="absolute top-4 right-4 text-red-900/40 font-cinzel text-4xl">♰</div>
            <div className="absolute bottom-4 left-4 text-red-900/40 font-cinzel text-4xl">♰</div>
            <div className="absolute bottom-4 right-4 text-red-900/40 font-cinzel text-4xl">♰</div>
            
            {/* Decorative borders */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-black text-yellow-600 uppercase tracking-[0.3em] font-cinzel mb-8 md:mb-12 drop-shadow-[0_0_15px_rgba(202,138,4,0.3)] text-center">
              {language === 'pt' ? 'Speed Run / Recordes' : 'Speed Run / Records'}
            </h2>

            <div className="w-full flex flex-col items-center gap-8">
              {top3.length > 0 ? (
                <>
                  {/* 1st Place - Center Top */}
                  <div className="w-full max-w-md">
                    {renderRecord(top3[0], 0)}
                  </div>

                  {/* 2nd and 3rd - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="flex justify-center">
                      {top3[1] ? renderRecord(top3[1], 1) : (
                        <div className="w-full h-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-red-950/20 rounded-3xl p-6 text-red-900/20 uppercase tracking-widest text-[10px]">
                          {language === 'pt' ? 'Vago' : 'Vacant'}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {top3[2] ? renderRecord(top3[2], 2) : (
                        <div className="w-full h-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-red-950/20 rounded-3xl p-6 text-red-900/20 uppercase tracking-widest text-[10px]">
                          {language === 'pt' ? 'Vago' : 'Vacant'}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-red-900/40 uppercase tracking-[0.5em] text-sm font-cinzel">
                  {language === 'pt' ? 'Nenhum recorde lendário' : 'No legendary records'}
                </div>
              )}
            </div>

            <div className="mt-12 w-full max-w-xs">
              <GothicButton onClick={onBack} className="border-red-900/50 text-red-600 hover:text-red-500 hover:border-red-600">
                {language === 'pt' ? 'Voltar' : 'Back'}
              </GothicButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Shop = ({ isOpen, onClose, bloodCoins, language, onBuy, getPowerUpCost, purchases, isSpeedRun }: ShopProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border-2 border-[var(--color-secondary)] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,27,27,0.3)]"
          >
            <div className="p-4 border-b border-[var(--color-secondary)]/30 flex justify-between items-center bg-[var(--color-secondary)]/20">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold text-white uppercase tracking-widest font-cinzel">
                  {language === 'pt' ? 'Mercado do Coven' : 'Coven Market'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {isSpeedRun ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <Lock className="text-red-500/50" size={48} />
                  <p className="text-sm text-zinc-400 uppercase tracking-[0.2em] font-bold">
                    {language === 'pt' ? 'Mercado Fechado em Speed Run' : 'Market Closed in Speed Run'}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                    {language === 'pt' ? 'Poderes são proibidos neste ritual' : 'Power-ups are forbidden in this ritual'}
                  </p>
                </div>
              ) : (
                POWER_UPS.map((pu) => {
                  const discountedCost = getPowerUpCost(pu.cost);
                  const purchaseCount = purchases[pu.type] || 0;
                  const limit = 2;
                  const isLimitReached = purchaseCount >= limit;

                  return (
                    <div 
                      key={pu.type}
                      className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-[var(--color-secondary)]/20 hover:border-[var(--color-primary)]/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--color-primary)]/20 rounded-xl text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                          <pu.icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white">{t(pu.name, language)}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isLimitReached ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-zinc-700 text-zinc-500'}`}>
                              {purchaseCount}/{limit}
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
                            ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] shadow-lg shadow-[var(--color-primary)]/20' 
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
                })
              )}
            </div>

            <div className="p-4 bg-black/40 border-t border-[var(--color-secondary)]/30 flex justify-between items-center">
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
  score?: number;
  level?: number;
  xp?: number;
  bags?: number;
  relic?: Relic | null;
  language: Language;
  speedRunUnlocked?: boolean;
  bestSpeedRun?: SpeedRunRecord;
  onStartSpeedRun?: () => void;
  onOpenSpeedRunStats?: () => void;
  speedRunRecords?: SpeedRunRecord[];
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
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
      textShadow: "0 0 8px rgba(220, 38, 38, 0.8)"
    }}
    whileTap={{ 
      scale: 0.95,
      x: [0, -2, 2, -2, 0],
      transition: { duration: 0.1 }
    }}
    onClick={() => {
      audioService.playSound('click');
      onClick();
    }}
    className={`gothic-button w-full px-12 py-4 rounded-lg flex items-center justify-center gap-4 group font-cinzel text-[#ff3333] tracking-widest uppercase font-bold transition-all duration-300 ${className}`}
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

const BloodBubble = ({ x, y, onComplete }: { x: number, y: number, onComplete: () => void }) => {
  const [isRare] = useState(Math.random() > 0.9);
  const [transformation, setTransformation] = useState<'eye' | 'rune' | 'shadow' | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRare) {
        const types: ('eye' | 'rune' | 'shadow')[] = ['eye', 'rune', 'shadow'];
        setTransformation(types[Math.floor(Math.random() * types.length)]);
        setTimeout(() => onCompleteRef.current(), 3000); // Fade out after 3s
      } else {
        onCompleteRef.current();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isRare]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: transformation ? 1.2 : [0, 1.2, 1], 
        opacity: transformation ? 1 : [0, 0.8, 0.6],
        y: transformation ? -20 : 0
      }}
      exit={{ 
        scale: transformation ? 0.5 : 2, 
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.5 }
      }}
      style={{ 
        position: 'absolute',
        left: x,
        top: y,
        width: 48,
        height: 48,
        marginLeft: -24,
        marginTop: -24,
      }}
      className={`flex items-center justify-center rounded-full pointer-events-none z-50 transition-colors duration-500 ${
        transformation 
          ? 'bg-transparent' 
          : 'bg-gradient-to-br from-red-500/60 to-red-900/80 border border-red-400/40 backdrop-blur-[2px] shadow-[0_0_20px_rgba(220,38,38,0.4)]'
      }`}
    >
      {!transformation ? (
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full blur-[1px]" />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
        >
          {transformation === 'eye' && <Eye size={32} className="animate-pulse" />}
          {transformation === 'rune' && <div className="text-2xl font-black archaic-text">ᚱ</div>}
          {transformation === 'shadow' && <Ghost size={32} className="opacity-60" />}
        </motion.div>
      )}
      
      {/* Explosion particles (only if not transforming) */}
      {!transformation && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-600 rounded-full"
          initial={{ x: 0, y: 0, opacity: 0 }}
          exit={{ 
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * 150,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
};

const BloodRain = () => {
  const [wind, setWind] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWind(Math.random() * 20 - 10); // Random wind gust
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {[...Array(150)].map((_, i) => {
        const size = Math.random() > 0.8 ? 3 : 1.5;
        const duration = 0.8 + Math.random() * 0.7;
        const delay = Math.random() * 5;
        const leftPos = Math.random() * 120 - 10;
        
        return (
          <motion.div
            key={i}
            initial={{ y: "-10%", opacity: 0 }}
            animate={{ 
              y: ["0%", "110%"],
              x: [0, wind * 10],
              opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay,
              ease: "linear"
            }}
            style={{ 
              left: `${leftPos}%`,
              width: size, 
              height: size * 12,
              background: 'linear-gradient(to bottom, transparent, #991b1b)',
              position: 'absolute'
            }}
            className="rounded-full blur-[0.5px]"
          />
        );
      })}
    </div>
  );
};

const Fireballs = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {[...Array(3)].map((_, i) => {
        const startX = Math.random() > 0.5 ? -20 : 120;
        const endX = startX === -20 ? 120 : -20;
        const startY = Math.random() * 80;
        const endY = Math.random() * 80;
        const duration = 2 + Math.random() * 3;
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            initial={{ x: `${startX}%`, y: `${startY}%`, opacity: 0, scale: 0 }}
            animate={{ 
              x: `${endX}%`, 
              y: `${endY}%`,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1.2, 0.5],
              rotate: 360
            }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay,
              ease: "easeInOut"
            }}
            className="absolute w-16 h-16"
          >
            <div className="absolute inset-0 bg-orange-600 rounded-full blur-xl animate-pulse" />
            <div className="absolute inset-2 bg-yellow-400 rounded-full blur-md" />
            <div className="absolute -inset-4 bg-red-600/30 rounded-full blur-2xl" />
            {/* Tail */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-gradient-to-r from-orange-600 to-transparent blur-lg origin-left"
              style={{ rotate: startX < endX ? 0 : 180 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

const RandomEvents = ({ event, mousePos }: { event: string | null, mousePos: { x: number, y: number } }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {event === 'rain' && <BloodRain />}
        {event === 'fireballs' && <Fireballs />}
        {(event === 'eyes' || event === 'follow') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {[...Array(6)].map((_, i) => {
              const x = 20 + (i * 13) % 60;
              const y = 20 + (i * 17) % 60;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%` 
                  }}
                  className="absolute flex gap-2"
                >
                  <motion.div 
                    animate={event === 'follow' ? {
                      x: (mousePos.x - (window.innerWidth * (20 + (i * 13) % 60) / 100)) * 0.05,
                      y: (mousePos.y - (window.innerHeight * (20 + (i * 17) % 60) / 100)) * 0.05,
                    } : {}}
                    className="w-4 h-2 bg-red-600 rounded-full shadow-[0_0_10px_red]" 
                  />
                  <motion.div 
                    animate={event === 'follow' ? {
                      x: (mousePos.x - (window.innerWidth * (20 + (i * 13) % 60) / 100)) * 0.05,
                      y: (mousePos.y - (window.innerHeight * (20 + (i * 17) % 60) / 100)) * 0.05,
                    } : {}}
                    className="w-4 h-2 bg-red-600 rounded-full shadow-[0_0_10px_red]" 
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {event === 'glitch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0, 0.8, 0],
              x: [0, -10, 10, -5, 0],
              filter: ["none", "hue-rotate(90deg)", "none", "invert(1)", "none"]
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-red-600/10 mix-blend-overlay z-[200]"
          />
        )}

        {event === 'rune' && (
          <motion.div
            initial={{ opacity: 0, scale: 2, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              scale: [2, 1.5, 2],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black archaic-text text-red-900/20"
          >
            {['ᚦ', 'ᚱ', 'ᚼ', 'ᚿ', 'ᛅ', 'ᛋ'][Math.floor(Math.random() * 6)]}
          </motion.div>
        )}

        {event === 'special' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.3, 0.6, 0.3],
                filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Skull size={400} className="text-red-950/20" />
            </motion.div>
            <div className="grid grid-cols-4 gap-12">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                >
                  <Eye size={48} className="text-red-600" />
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-20 text-red-900 font-cinzel text-2xl tracking-[1em] uppercase"
            >
              Sanguis Est Vita
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SpeedRunSetupModal = ({ 
  isOpen, 
  onClose, 
  onStart, 
  language, 
  playerStats 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onStart: (name: string, title: string) => void, 
  language: Language,
  playerStats: PlayerStats
}) => {
  const [name, setName] = useState('');
  const [selectedTitleId, setSelectedTitleId] = useState(playerStats.selectedTitleId || '');

  const unlockedTitles = ACHIEVEMENTS.filter(a => playerStats.unlockedAchievements.includes(a.id));
  const currentTitle = unlockedTitles.find(a => a.id === selectedTitleId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-zinc-950 border-2 border-yellow-600/30 rounded-[40px] p-8 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-widest font-cinzel">
                {language === 'pt' ? 'Novo Speed Run' : 'New Speed Run'}
              </h2>
              <button onClick={onClose} className="text-yellow-900/40 hover:text-yellow-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/50 font-bold block ml-2">
                  {language === 'pt' ? 'Seu Nome' : 'Your Name'}
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'pt' ? 'Digite seu nome...' : 'Enter your name...'}
                  className="w-full bg-black/40 border border-yellow-900/30 rounded-2xl px-6 py-4 text-yellow-500 placeholder:text-yellow-900/30 focus:outline-none focus:border-yellow-600/50 transition-colors font-mono"
                  maxLength={20}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/50 font-bold block ml-2">
                  {language === 'pt' ? 'Escolha seu Título' : 'Choose your Title'}
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {unlockedTitles.length > 0 ? unlockedTitles.map(title => (
                    <button
                      key={title.id}
                      onClick={() => setSelectedTitleId(title.id)}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all border ${
                        selectedTitleId === title.id 
                          ? 'bg-yellow-600/20 border-yellow-600 text-yellow-500 font-black' 
                          : 'bg-black/20 border-yellow-900/10 text-yellow-900/40 hover:border-yellow-900/30 hover:text-yellow-900/60'
                      }`}
                    >
                      {t(title.title, language)}
                    </button>
                  )) : (
                    <div className="text-center py-4 text-yellow-900/20 text-[10px] uppercase tracking-widest italic">
                      {language === 'pt' ? 'Nenhum título desbloqueado' : 'No titles unlocked'}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <div className="text-center mb-6">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500/30 font-bold block mb-1">
                    {language === 'pt' ? 'Você será conhecido como:' : 'You will be known as:'}
                  </span>
                  <span className="text-lg font-black text-yellow-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    {currentTitle ? `${t(currentTitle.title, language)} ` : ''}{name || (language === 'pt' ? 'Anônimo' : 'Anonymous')}
                  </span>
                </div>

                <GothicButton 
                  onClick={() => onStart(name, currentTitle ? t(currentTitle.title, language) : '')}
                  className="border-yellow-600 text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                >
                  {language === 'pt' ? 'Iniciar Ritual' : 'Start Ritual'}
                </GothicButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const IntroScreen = ({ 
  onStart, 
  onOpenRelics, 
  onOpenAchievements, 
  onOpenOptions, 
  language,
  speedRunUnlocked,
  bestSpeedRun,
  speedRunRecords,
  onStartSpeedRun,
  onOpenSpeedRunStats,
  level
}: ScreenProps) => {
  const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number }[]>([]);
  const [trail, setTrail] = useState<{ id: number, x: number, y: number }[]>([]);
  const [showSpeedRunMenu, setShowSpeedRunMenu] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [isSeaRising, setIsSeaRising] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [idleTimer, setIdleTimer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      setIdleTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Random Event System
    const eventInterval = setInterval(() => {
      if (currentEvent || isSeaRising) return;

      // Much rarer recurring events
      const baseChance = 0.05 + (timeSpent / 1200); 
      const roll = Math.random();

      if (roll < baseChance) {
        const events = ['eyes', 'follow', 'glitch', 'rune', 'mist', 'shake', 'rain', 'fireballs'];
        if (roll < 0.005) events.push('special');
        
        const selectedEvent = events[Math.floor(Math.random() * events.length)];
        
        if (selectedEvent === 'shake') {
          setCurrentEvent('shake');
          setTimeout(() => setCurrentEvent(null), 1000);
        } else if (selectedEvent === 'mist') {
          setCurrentEvent('mist');
          setIsSeaRising(true);
          setTimeout(() => {
            setIsSeaRising(false);
            setCurrentEvent(null);
          }, 8000);
        } else if (selectedEvent === 'special') {
          setCurrentEvent('special');
          audioService.playSound('ritual_complete');
          setTimeout(() => setCurrentEvent(null), 10000);
        } else if (selectedEvent === 'rain') {
          setCurrentEvent('rain');
          if (Math.random() < 0.3) audioService.playSound('laugh');
          setTimeout(() => setCurrentEvent(null), 10000);
        } else {
          setCurrentEvent(selectedEvent);
          if (Math.random() < 0.3) audioService.playSound('laugh');
          setTimeout(() => setCurrentEvent(null), 4000);
        }

        // Randomly freeze
        if (Math.random() < 0.03) {
          setIsFrozen(true);
          setTimeout(() => setIsFrozen(false), 1200);
        }
      }
    }, 15000); // Increased interval to 15s

    // Initial random events on visit - 15% chance
    const initialRoll = Math.random();
    if (initialRoll < 0.15) {
      const initialEvents = ['eyes', 'mist', 'rune', 'rain', 'fireballs'];
      const event = initialEvents[Math.floor(Math.random() * initialEvents.length)];
      if (event === 'mist') {
        setCurrentEvent('mist');
        setIsSeaRising(true);
        setTimeout(() => {
          setIsSeaRising(false);
          setCurrentEvent(null);
        }, 8000);
      } else {
        setCurrentEvent(event);
        setTimeout(() => setCurrentEvent(null), 4000);
      }
      if (Math.random() < 0.5) audioService.playSound('laugh');
    }

    return () => clearInterval(eventInterval);
  }, [timeSpent, currentEvent, isSeaRising]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    setTrail(prev => [...prev.slice(-20), { id: Date.now() + Math.random(), x, y }]);
    setIdleTimer(0);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Don't spawn bubble if clicking on a button or interactive element
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (bubbles.length >= 3) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newBubble = { id: Date.now(), x, y };
    setBubbles(prev => [...prev, newBubble]);
    audioService.playSound('bubble');
  };

  const removeBubble = useCallback((id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleExit = () => {
    if (confirm(language === 'pt' ? 'Deseja realmente sair do ritual?' : 'Do you really want to leave the ritual?')) {
      window.close();
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isFrozen ? 0.8 : 1,
        filter: isFrozen ? 'grayscale(1) contrast(2)' : 'none',
        x: currentEvent === 'shake' ? [0, -5, 5, -5, 5, 0] : 0,
        y: currentEvent === 'shake' ? [0, 5, -5, 5, -5, 0] : 0
      }}
      onMouseMove={handleMouseMove}
      onClick={handleBackgroundClick}
      className="relative flex flex-col items-center justify-center text-center h-screen w-screen overflow-hidden cursor-crosshair bg-black"
    >
      {/* Background Layers */}
      <AtmosphereLayers />
      <GothicWalls />
      <SeaOfBloodEnhanced isRising={isSeaRising} />
      <MouseTrail trail={trail} />
      <RandomEvents event={currentEvent} mousePos={mousePos} />

      {/* Idle Effect near mouse */}
      {idleTimer > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          style={{ left: mousePos.x, top: mousePos.y }}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          <Eye size={24} className="text-red-900 animate-pulse" />
        </motion.div>
      )}

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

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: 1 + Math.sin(timeSpent * 0.5) * 0.01 // Subtle pulse
        }}
        transition={{ delay: 0.2 }}
        className="mb-16 relative z-10"
      >
        <div className="relative group">
          <h1 
            data-text="Crimson Relics"
            className="text-8xl md:text-9xl mb-4 metallic-title tracking-[0.2em] relative z-10"
          >
            Crimson Relics
          </h1>
          
          {/* Title Reflection */}
          <div className="absolute top-full left-0 w-full opacity-20 scale-y-[-0.8] blur-md pointer-events-none select-none">
            <h1 className="text-8xl md:text-9xl metallic-title tracking-[0.2em]">Crimson Relics</h1>
          </div>

          {/* Blood Dripping Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <BloodDrop left="15%" delay={0.5} />
            <BloodDrop left="45%" delay={0.2} />
            <BloodDrop left="85%" delay={0.8} />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex flex-col items-center justify-center gap-2 text-[#ff4d4d] font-bold uppercase font-cinzel-decorative"
        >
          <div className="flex items-center gap-6 text-xl tracking-[0.3em]">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-red-600 bg-black" />
            </div>
            <span>{language === 'pt' ? 'O Despertar de Drácula' : "Dracula's Awakening"}</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent via-red-600 to-transparent relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-red-600 bg-black" />
            </div>
          </div>
          <span className="text-sm tracking-[0.4em] text-[#ff4d4d]">
            {language === 'pt' ? `Ritual ${level}` : `Ritual ${level}`}
          </span>
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-6 w-full max-w-md relative z-10">
        <GothicButton onClick={onStart}>
          {language === 'pt' ? 'Iniciar Ritual' : 'Begin Ritual'}
        </GothicButton>

        <AnimatePresence mode="wait">
          <div className="flex flex-col gap-2">
            {!showSpeedRunMenu ? (
              <GothicButton 
                onClick={() => setShowSpeedRunMenu(true)} 
                icon={Hourglass} 
                className="border-yellow-600/50 text-yellow-500 hover:border-yellow-400 shadow-[0_0_15px_rgba(202,138,4,0.3)]"
              >
                {language === 'pt' ? 'Modo Speed Run' : 'Speed Run Mode'}
              </GothicButton>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 p-4 bg-yellow-900/10 rounded-2xl border border-yellow-600/20"
              >
                <GothicButton 
                  onClick={onStartSpeedRun || (() => {})} 
                  className="border-yellow-600/50 text-yellow-500 hover:border-yellow-400 text-sm"
                >
                  {language === 'pt' ? 'Novo Speed Run' : 'New Speed Run'}
                </GothicButton>
                <GothicButton 
                  onClick={onOpenSpeedRunStats} 
                  className="border-yellow-600/30 text-yellow-600 hover:text-yellow-500 text-sm"
                >
                  {language === 'pt' ? 'Recordes (Top 3)' : 'Records (Top 3)'}
                </GothicButton>
                <button 
                  onClick={() => setShowSpeedRunMenu(false)}
                  className="text-[10px] uppercase tracking-widest text-yellow-900 hover:text-yellow-700 transition-colors mt-1"
                >
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

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

        <GothicButton onClick={handleExit} icon={LogOut} className="border-zinc-800 text-zinc-500 hover:border-red-900 hover:text-red-700">
          {language === 'pt' ? 'Sair do Jogo' : 'Exit Game'}
        </GothicButton>
      </div>
    </motion.div>
  );
};

export const LoreScreen = ({ onStart, onSkipLore, language }: { onStart: () => void, onSkipLore: (skip: boolean) => void, language: Language }) => {
  const [skipNext, setSkipNext] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-[#d4c5a9] p-8 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3), 0 0 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Burnt edges effect */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent" style={{ boxShadow: 'inset 0 0 60px 20px rgba(60,40,20,0.4)' }} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-unifraktur font-bold text-red-900 mb-8 uppercase tracking-widest" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
            {t(LORE.title, language)}
          </h2>
          
          <div className="text-xl font-serif leading-relaxed text-red-950 mb-6 space-y-4 italic">
            {t(LORE.content, language).split('\n\n').map((para, i) => (
              <p key={i} className="relative">
                {para}
                {/* Blood splatter effect on text */}
                {i === 0 && <span className="absolute -top-4 -left-4 w-8 h-8 bg-red-900/10 rounded-full blur-md" />}
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05, color: '#ff0000' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSkipLore(skipNext);
                onStart();
              }}
              className="px-10 py-3 bg-red-900 text-[#d4c5a9] font-serif font-bold text-xl rounded border-2 border-red-950 shadow-lg hover:bg-red-800 transition-all uppercase tracking-widest"
            >
              {t(LORE.continue, language)}
            </motion.button>

            <button 
              onClick={() => setSkipNext(!skipNext)}
              className="flex items-center gap-2 text-red-900/60 hover:text-red-900 transition-colors group"
            >
              <div className={`w-4 h-4 border border-red-900 flex items-center justify-center rounded-sm transition-colors ${skipNext ? 'bg-red-900' : 'bg-transparent'}`}>
                {skipNext && <X size={12} className="text-[#d4c5a9]" />}
              </div>
              <span className="text-xs font-serif uppercase tracking-widest">
                {language === 'pt' ? 'Pular da próxima vez' : 'Skip next time'}
              </span>
            </button>
          </div>
        </div>

        {/* Blood stains */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-red-900/20 rounded-full blur-xl rotate-45" />
        <div className="absolute bottom-10 left-10 w-24 h-12 bg-red-900/15 rounded-full blur-2xl -rotate-12" />
      </motion.div>
    </motion.div>
  );
};

export const OptionsModal = ({ 
  isOpen, 
  onClose, 
  currentLanguage, 
  onSetLanguage, 
  onOpenExport, 
  onImport, 
  onReset, 
  musicEnabled,
  sfxEnabled,
  onToggleMusic,
  onToggleSfx,
  resolution,
  onSetResolution
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  currentLanguage: Language, 
  onSetLanguage: (lang: Language) => void,
  onOpenExport: () => void,
  onImport: (save: string) => void,
  onReset: () => void,
  musicEnabled: boolean,
  sfxEnabled: boolean,
  onToggleMusic: (enabled: boolean) => void,
  onToggleSfx: (enabled: boolean) => void,
  resolution: string,
  onSetResolution: (res: string) => void
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResolutionDropdownOpen, setIsResolutionDropdownOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-zinc-900 border-2 border-red-900 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-[var(--color-secondary)]/30 flex justify-between items-center bg-[var(--color-secondary)]/20">
              <div className="flex items-center gap-3">
                <Settings className="text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  {currentLanguage === 'pt' ? 'Opções' : 'Options'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold block">
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
                <label className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold block">
                  {currentLanguage === 'pt' ? 'Áudio' : 'Audio'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      onToggleMusic(!musicEnabled);
                      audioService.playSound('click');
                    }}
                    className={`px-4 py-3 rounded-xl font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                      musicEnabled 
                        ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-black/40 border-zinc-800 text-gray-500 hover:border-red-900/50'
                    }`}
                  >
                    {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    {currentLanguage === 'pt' ? 'Música' : 'Music'}
                  </button>
                  <button
                    onClick={() => {
                      onToggleSfx(!sfxEnabled);
                      audioService.playSound('click');
                    }}
                    className={`px-4 py-3 rounded-xl font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                      sfxEnabled 
                        ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-black/40 border-zinc-800 text-gray-500 hover:border-red-900/50'
                    }`}
                  >
                    {sfxEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    {currentLanguage === 'pt' ? 'Efeitos' : 'SFX'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold block">
                  {currentLanguage === 'pt' ? 'Vídeo' : 'Video'}
                </label>
                <div className="space-y-3">
                  {/* Resolution Selection */}
                  <div className="relative">
                    <button
                      onClick={() => setIsResolutionDropdownOpen(!isResolutionDropdownOpen)}
                      className="w-full px-4 py-3 rounded-xl font-bold transition-all border-2 bg-black/40 border-zinc-800 text-white flex items-center justify-between hover:border-red-900/50"
                    >
                      <span>{resolution}</span>
                      <Settings size={16} className="text-red-500" />
                    </button>

                    <AnimatePresence>
                      {isResolutionDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 w-full mb-2 bg-zinc-900 border-2 border-red-900 rounded-xl overflow-hidden z-[120] shadow-2xl"
                        >
                          {RESOLUTIONS.map((res) => (
                            <button
                              key={res.label}
                              onClick={() => {
                                onSetResolution(`${res.width}x${res.height}`);
                                setIsResolutionDropdownOpen(false);
                                audioService.playSound('click');
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-red-900/20 transition-colors text-sm font-bold ${
                                resolution === `${res.width}x${res.height}` ? 'text-red-500' : 'text-gray-400'
                              }`}
                            >
                              {res.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-red-500 font-bold block">
                  {currentLanguage === 'pt' ? 'Dados do Jogo' : 'Game Data'}
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={onOpenExport}
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
      className="flex flex-col items-center justify-center text-center p-8 bg-black/90 rounded-3xl border-4 border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <div className="mb-4 p-4 bg-red-900/20 rounded-full">
        <Trophy className="text-yellow-500" size={48} />
      </div>
      <h2 className="text-5xl mb-2 font-bloody text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
        {language === 'pt' ? 'Ritual Completo' : 'Ritual Complete'}
      </h2>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">
        {language === 'pt' ? `Nível ${level} Dominado` : `Level ${level} Mastered`}
      </p>
      
      <div className="grid grid-cols-1 gap-8 mb-6 w-full max-w-xs">
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
        className="px-8 py-3 bg-red-900 text-white font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest"
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
      className="flex flex-col items-center justify-center text-center p-8 bg-black/90 rounded-3xl border-4 border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <h2 className="text-5xl mb-4 metallic-title">
        {language === 'pt' ? 'Ritual Falhou' : 'Ritual Failed'}
      </h2>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">
        {language === 'pt' ? 'A lua de sangue desaparece...' : 'The blood moon fades...'}
      </p>
      
      <div className="mb-6">
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
        className="px-8 py-3 bg-red-900 text-white font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest"
      >
        {language === 'pt' ? 'Tentar Novamente' : 'Try Again'}
      </motion.button>
    </motion.div>
  );
};

const Candle = ({ className, glowSize }: { className?: string, glowSize?: string }) => (
  <div className={`flex flex-col items-center pointer-events-none ${className}`}>
    {/* Wall Sconce / Support - Integrated into wall */}
    <div className="absolute w-12 h-4 bg-gradient-to-b from-[#1a1a1a] to-black rounded-full translate-y-24 shadow-2xl skew-x-12 ring-1 ring-white/5" />
    
    {/* Flickering Light Glow on nearby wall */}
    <div 
      className="absolute bg-orange-600/20 rounded-full -top-32 blur-3xl ambient-flicker" 
      style={{ width: glowSize || '400px', height: glowSize || '400px' }}
    />
    
    {/* Flame & Wick */}
    <div className="relative mb-0.5 z-10">
      <div className="candle-flame" />
      <div className="candle-wick" />
    </div>
    
    {/* Candle Body */}
    <div className="w-5 h-28 candle-body-texture relative z-0" />
    
    {/* Base Shadow / Pooling Wax Shadow */}
    <div className="w-12 h-3 bg-black/80 rounded-full blur-[3px] -mt-1.5" />
  </div>
);

const TombBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
    {/* The Physical Chamber Walls with 3D perspective effect */}
    <div 
      className="absolute inset-0 tomb-wall-pattern opacity-90 transition-opacity"
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
    </div>
    
    {/* Centered Deep Shadow (The Abyss) */}
    <div className="absolute inset-x-0 top-0 bottom-0 bg-radial-[circle_at_center] from-transparent via-black/30 to-black/95 z-[1]" />

    {/* Vignette - Looking deeply into the Tomb */}
    <div className="absolute inset-0 stone-shadow z-[2]" />

    {/* Imperfections: Cracks integrated into the stone bricks */}
    {[...Array(8)].map((_, i) => (
      <div 
        key={`crack-${i}`}
        className="stone-crack z-[1]"
        style={{
          left: `${Math.random() * 90 + 5}%`,
          top: `${Math.random() * 90 + 5}%`,
          width: `${30 + Math.random() * 120}px`,
          transform: `rotate(${Math.random() * 180 - 90}deg)`,
          opacity: 0.2 + Math.random() * 0.3
        }}
      />
    ))}

    {/* Ambient Light Pulses (Global) */}
    <div className="absolute inset-0 bg-orange-950/5 ambient-flicker mix-blend-overlay z-[3]" />

    {/* Dust Particles - Subtle and influenced by light */}
    {[...Array(20)].map((_, i) => (
      <div 
        key={`dust-${i}`}
        className="absolute w-1 h-1 bg-white/10 rounded-full z-[4] blur-[0.5px]"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `dust-float ${20 + Math.random() * 20}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`
        }}
      />
    ))}

    {/* Integrated Candles at different depths */}
    <Candle className="absolute left-6 md:left-20 bottom-16 z-[5] scale-110" glowSize="500px" />
    <Candle className="absolute right-6 md:right-24 bottom-32 z-[5] scale-125" glowSize="600px" />
    <Candle className="absolute left-1/4 top-1/4 z-[4] scale-50 opacity-30 blur-[2px]" glowSize="300px" />
    <Candle className="absolute right-1/4 top-1/3 z-[4] scale-40 opacity-20 blur-[3px]" glowSize="200px" />
    
    {/* Deep Room Fog & Ground Mist */}
    <div className="absolute bottom-0 w-full h-[60%] tomb-fog z-[6] opacity-80" />
    
    {/* Center Glow (Where cards are) */}
    <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/5 to-transparent blur-3xl z-[0] opacity-30" />
  </div>
);

export const RelicsScreen = ({ onStart, playerStats }: { onStart: () => void, playerStats: PlayerStats }) => {
  const lang = playerStats.language;
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);

  const getRelicBonusDescription = (relicId: string, level: number, lang: Language) => {
    const relic = RELICS.find(r => r.id === relicId);
    if (!relic) return '';
    
    const baseValue = relic.effect.value;
    const increment = RELIC_UPGRADE_INCREMENTS[relicId] || 0;
    const currentValue = baseValue + (level - 1) * increment;

    switch (relicId) {
      case 'chalice':
        return lang === 'pt' ? `+${Math.round(currentValue * 100)}% de Pontuação Total` : `+${Math.round(currentValue * 100)}% Total Score`;
      case 'ring':
        return lang === 'pt' ? `+${currentValue} Movimentos Extras` : `+${currentValue} Extra Moves`;
      case 'pendant':
        return lang === 'pt' ? `${(2.0 + (level - 1) * 0.5).toFixed(1)}x + Pontos de Combo` : `${(2.0 + (level - 1) * 0.5).toFixed(1)}x + Combo Points`;
      case 'grimoire':
        return lang === 'pt' ? `-${Math.round(currentValue * 100)}% no preço dos itens da loja` : `-${Math.round(currentValue * 100)}% Shop Item Prices`;
      case 'crown':
        return lang === 'pt' ? `+${Math.round(currentValue * 100)}% de Pontos em Match 4 ou Superior` : `+${Math.round(currentValue * 100)}% Points on Match 4 or Higher`;
      case 'hourglass':
        return lang === 'pt' ? `+${currentValue} Movimentos Extras` : `+${currentValue} Extra Moves`;
      case 'orb':
        return lang === 'pt' ? `${Math.round(currentValue * 100)}% de chance de gerar peças especiais` : `${Math.round(currentValue * 100)}% Chance of special pieces`;
      case 'dagger':
        const pieces = level === 1 ? 1 : 1 + (level - 1) * 3;
        return lang === 'pt' ? `Combinações limpam ${pieces} blocos extras` : `Matches clear ${pieces} extra tiles`;
      case 'seal':
        return lang === 'pt' ? `${Math.round(currentValue * 100)}% de chance de reações adicionais` : `${Math.round(currentValue * 100)}% Chance of additional reactions`;
      case 'heart':
        return lang === 'pt' ? `+${Math.round(currentValue * 100)}% de Bônus de Pontuação` : `+${Math.round(currentValue * 100)}% Score Bonus`;
      default:
        return t(relic.bonus, lang);
    }
  };

  return (
    <div className="fixed inset-0 w-full min-h-screen bg-black overflow-hidden flex items-center justify-center p-4">
      <TombBackground />
      
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center min-h-[600px]">
        <AnimatePresence mode="wait">
          {!selectedRelic ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center w-full p-6"
          >
            <div className="flex justify-between items-center w-full mb-12">
              <button 
                onClick={() => {
                  audioService.playSound('click');
                  onStart();
                }} 
                className="text-red-500 hover:text-red-400 flex items-center gap-2 uppercase tracking-[0.3em] text-[10px] font-black bg-red-950/20 px-5 py-2.5 rounded-full border border-red-900/30 transition-all hover:bg-red-950/40"
              >
                <ArrowLeft size={14} /> {lang === 'pt' ? 'Voltar' : 'Back'}
              </button>
              <h2 className="text-5xl metallic-title tracking-[0.2em] font-black uppercase">
                {lang === 'pt' ? 'Relíquias Antigas' : 'Ancient Relics'}
              </h2>
              <div className="w-24" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full">
              {RELICS.map((relic) => {
                const isUnlocked = playerStats.unlockedRelics.includes(relic.id);
                const Icon = RELIC_ICONS[relic.icon];
                const currentLevel = (playerStats.relicLevels && playerStats.relicLevels[relic.id]) || 1;
                const maxLevel = RELIC_MAX_LEVELS[relic.id] || 5;
                const isMaxLevel = currentLevel >= maxLevel;
                
                return (
                  <motion.div 
                    key={relic.id}
                    whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && setSelectedRelic(relic)}
                    className={`
                      relative p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-5 transition-all cursor-pointer
                      ${isUnlocked 
                        ? (isMaxLevel ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_50px_rgba(234,179,8,0.4)]' : 'bg-red-950/40 border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.2)]') 
                        : 'bg-zinc-900/20 border-zinc-800/40 opacity-30 grayscale'}
                    `}
                  >
                    {isMaxLevel && (
                      <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-[2.5rem] bg-yellow-500/10 blur-xl pointer-events-none" 
                      />
                    )}
                    <div className={`p-5 rounded-full ${isUnlocked ? (isMaxLevel ? 'bg-amber-500 shadow-[0_0_30px_rgba(234,179,8,0.6)] text-black' : 'bg-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)] text-white') : 'bg-zinc-800 text-zinc-600'}`}>
                      <Icon size={40} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-center leading-tight text-zinc-100">
                        {t(relic.name, lang)}
                      </span>
                      {isUnlocked && (
                        <span className={`text-[10px] font-bold mt-2 px-3 py-1 rounded-full ${isMaxLevel ? 'bg-amber-500 text-black' : 'bg-red-900/40 text-red-100'}`}>
                          {isMaxLevel ? 'MAX' : `LVL ${currentLevel}`}
                        </span>
                      )}
                    </div>
                    {!isUnlocked && <Lock size={16} className="absolute top-4 right-4 text-zinc-600" />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
              relic-modal-bg border-4 p-12 rounded-[3.5rem] max-w-xl w-full relative shadow-[0_0_120px_rgba(220,38,38,0.6)]
              ${((playerStats.relicLevels && playerStats.relicLevels[selectedRelic.id]) || 1) >= (RELIC_MAX_LEVELS[selectedRelic.id] || 5) 
                ? 'border-amber-500 shadow-[0_0_120px_rgba(234,179,8,0.4)]' 
                : 'border-red-500/60 shadow-[0_0_120px_rgba(220,38,38,0.6)]'}
            `}
          >
            <button 
              onClick={() => setSelectedRelic(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-90"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`p-12 rounded-full mb-10 shadow-[0_0_60px_rgba(220,38,38,0.8)] animate-pulse ${((playerStats.relicLevels && playerStats.relicLevels[selectedRelic.id]) || 1) >= (RELIC_MAX_LEVELS[selectedRelic.id] || 5) ? 'bg-amber-500 text-black shadow-[0_0_60px_rgba(234,179,8,0.6)]' : 'bg-red-600 text-white'}`}>
                {(() => { const Icon = RELIC_ICONS[selectedRelic.icon]; return <Icon size={76} />; })()}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg uppercase tracking-[0.6em] text-red-400 font-black drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                  {lang === 'pt' ? 'Relíquia Desbloqueada' : 'Relic Unlocked'}
                </h3>
                <span className={`text-sm font-black px-4 py-1.5 rounded-full ${((playerStats.relicLevels && playerStats.relicLevels[selectedRelic.id]) || 1) >= (RELIC_MAX_LEVELS[selectedRelic.id] || 5) ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'}`}>
                  {lang === 'pt' ? 'Nível' : 'Level'} {(playerStats.relicLevels && playerStats.relicLevels[selectedRelic.id]) || 1}
                </span>
              </div>
              
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                {t(selectedRelic.name, lang)}
              </h2>
              
              <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-10 rounded-full" />
              
              <p className="text-zinc-100 italic mb-12 leading-relaxed text-lg font-medium max-w-md">
                "{t(selectedRelic.lore, lang)}"
              </p>
              
              <div className="bg-black/50 backdrop-blur-3xl border-2 border-red-600/40 p-10 rounded-[3rem] w-full shadow-[inset_0_0_40px_rgba(220,38,38,0.3)]">
                <span className="text-xs uppercase tracking-[0.5em] text-red-400 font-black mb-4 block">
                  {lang === 'pt' ? 'Bônus Ativo' : 'Active Bonus'}
                </span>
                <p className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  {getRelicBonusDescription(selectedRelic.id, (playerStats.relicLevels && playerStats.relicLevels[selectedRelic.id]) || 1, lang)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export const ExportModal = ({ isOpen, onClose, onConfirm, language }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (options: ExportOptions) => void,
  language: Language 
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    ritual: true,
    titles: true,
    relics: true,
    achievements: true,
    speedruns: true
  });

  const toggleOption = (key: keyof ExportOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const t = (en: string, pt: string) => language === 'pt' ? pt : en;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-md bg-gradient-to-b from-red-950 to-black border-2 border-red-600 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] relative"
          >
            {/* Shiny border effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border border-red-500/30 rounded-[2rem] animate-pulse" />
            </div>

            <div className="p-4 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] font-serif">
                  {t('Export Ritual', 'Exportar Ritual')}
                </h2>
                <button onClick={onClose} className="text-red-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { id: 'ritual', en: 'Current Ritual - Coins - Etc', pt: 'Salvar Ritual atual - Moedas - Etc' },
                  { id: 'titles', en: 'Save Titles', pt: 'Salvar Títulos' },
                  { id: 'relics', en: 'Save Relics', pt: 'Salvar Relíquias' },
                  { id: 'achievements', en: 'Save Achievements', pt: 'Salvar Conquistas' },
                  { id: 'speedruns', en: 'Save Speed Runs', pt: 'Salvar Speed Runs' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleOption(item.id as keyof ExportOptions)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-black/40 border border-red-900/30 hover:border-red-600 transition-all group"
                  >
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">
                      {t(item.en, item.pt)}
                    </span>
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${options[item.id as keyof ExportOptions] ? 'bg-red-600 border-red-500' : 'border-zinc-700'}`}>
                      {options[item.id as keyof ExportOptions] && <Check size={16} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => onConfirm(options)}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.3em] rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-95"
              >
                {t('Confirm Export', 'Confirmar Exportação')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ComboFeedback = ({ text, comboCount }: { text: string | null, comboCount: number }) => {
  const getComboStyle = (count: number) => {
    if (count >= 6) return { color: '#ff1a1a', size: 'text-7xl md:text-9xl', glow: 'rgba(255, 0, 0, 0.9)', shake: 12, stroke: '2px white' };
    if (count === 5) return { color: '#ef4444', size: 'text-6xl md:text-8xl', glow: 'rgba(239, 68, 68, 0.8)', shake: 8, stroke: '1px white' };
    if (count === 4) return { color: '#dc2626', size: 'text-5xl md:text-7xl', glow: 'rgba(220, 38, 38, 0.8)', shake: 6, stroke: 'none' };
    if (count === 3) return { color: '#991b1b', size: 'text-4xl md:text-6xl', glow: 'rgba(153, 27, 27, 0.8)', shake: 4, stroke: 'none' };
    return { color: '#7f1d1d', size: 'text-3xl md:text-5xl', glow: 'rgba(127, 29, 29, 0.8)', shake: 2, stroke: 'none' };
  };

  const style = getComboStyle(comboCount);

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -15 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: [1, 1.3, 1],
            rotate: [0, 5, -5, 0],
            x: [0, -style.shake, style.shake, -style.shake, style.shake, 0],
          }}
          transition={{
            x: { duration: 0.1, repeat: Infinity },
            scale: { duration: 0.3 },
            rotate: { duration: 0.2 },
            default: { duration: 0.4, ease: "easeOut" }
          }}
          exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none"
        >
          <div 
            className={`${style.size} font-black uppercase tracking-tighter italic text-center drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] metallic-title`}
            style={{ 
              color: style.color,
              filter: `drop-shadow(0 0 20px ${style.glow})`,
              WebkitTextStroke: style.stroke,
              fontFamily: '"UnifrakturCook", cursive'
            } as any}
          >
            {text}
            <div className="text-xl md:text-3xl mt-2 font-sans not-italic tracking-[0.5em] opacity-80">
              x{comboCount}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RelicUnlockScreen = ({ relic, level, onStart, language }: { relic: Relic, level: number, onStart: () => void, language: Language }) => {
  const Icon = RELIC_ICONS[relic.icon];
  const isEvolution = level > 1;

  const getBonusText = () => {
    const baseValue = relic.effect.value;
    const increment = RELIC_UPGRADE_INCREMENTS[relic.id] || 0;
    const currentValue = baseValue + (level - 1) * increment;

    switch (relic.id) {
      case 'chalice':
        return language === 'pt' ? `+${Math.round(currentValue * 100)}% de Pontuação Total` : `+${Math.round(currentValue * 100)}% Total Score`;
      case 'ring':
        return language === 'pt' ? `+${currentValue} Movimentos Extras` : `+${currentValue} Extra Moves`;
      case 'pendant':
        return language === 'pt' ? `${(2.0 + (level - 1) * 0.5).toFixed(1)}x + Pontos de Combo` : `${(2.0 + (level - 1) * 0.5).toFixed(1)}x + Combo Points`;
      case 'grimoire':
        return language === 'pt' ? `-${Math.round(currentValue * 100)}% no preço dos itens da loja` : `-${Math.round(currentValue * 100)}% Shop Item Prices`;
      case 'crown':
        return language === 'pt' ? `+${Math.round(currentValue * 100)}% de Pontos em Match 4 ou Superior` : `+${Math.round(currentValue * 100)}% Points on Match 4 or Higher`;
      case 'hourglass':
        return language === 'pt' ? `+${currentValue} Movimentos Extras` : `+${currentValue} Extra Moves`;
      case 'orb':
        return language === 'pt' ? `${Math.round(currentValue * 100)}% de chance de gerar peças especiais` : `${Math.round(currentValue * 100)}% Chance of special pieces`;
      case 'dagger':
        const pieces = level === 1 ? 1 : 1 + (level - 1) * 3;
        return language === 'pt' ? `Combinações limpam ${pieces} blocos extras` : `Matches clear ${pieces} extra tiles`;
      case 'seal':
        return language === 'pt' ? `${Math.round(currentValue * 100)}% de chance de reações adicionais` : `${Math.round(currentValue * 100)}% Chance of additional reactions`;
      case 'heart':
        return language === 'pt' ? `+${Math.round(currentValue * 100)}% de Bônus de Pontuação` : `+${Math.round(currentValue * 100)}% Score Bonus`;
      default:
        return t(relic.bonus, language);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4"
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
            className={`absolute inset-0 ${isEvolution ? 'bg-amber-600/30' : 'bg-red-600/20'} rounded-full blur-[60px]`}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`relative p-6 ${isEvolution ? 'bg-amber-600' : 'bg-red-900'} rounded-full border-4 ${isEvolution ? 'border-amber-400' : 'border-red-500'} shadow-[0_0_50px_rgba(220,38,38,0.5)] text-white`}
          >
            <Icon size={80} className={isEvolution ? 'text-black' : 'text-white'} />
          </motion.div>
        </div>

        <h3 className={`uppercase tracking-[0.4em] text-xl font-bloody mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] ${isEvolution ? 'text-amber-500' : 'text-red-600'}`}>
          {isEvolution 
            ? (language === 'pt' ? `Relíquia Evoluída (Nível ${level})` : `Relic Evolved (Level ${level})`)
            : (language === 'pt' ? 'Relíquia Recuperada' : 'Relic Recovered')}
        </h3>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">{t(relic.name, language)}</h2>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
          <p className="text-gray-400 italic mb-4">"{t(relic.lore, language)}"</p>
          <div className={`h-[1px] w-12 mx-auto mb-4 ${isEvolution ? 'bg-amber-900' : 'bg-red-900'}`} />
          <p className={`text-xl font-bold uppercase tracking-widest ${isEvolution ? 'text-amber-500' : 'text-red-500'}`}>
            {getBonusText()}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: isEvolution ? '#92400e' : '#8b0000' }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className={`px-12 py-4 ${isEvolution ? 'bg-amber-600 text-black' : 'bg-red-900 text-white'} font-bold text-xl rounded-full border-2 border-red-500/30 shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-300 uppercase tracking-widest`}
        >
          {isEvolution 
            ? (language === 'pt' ? 'Reivindicar Evolução' : 'Claim Evolution')
            : (language === 'pt' ? 'Reivindicar Poder' : 'Claim Power')}
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
        <span className="text-[10px] uppercase tracking-widest text-red-500 font-bloody mb-1">
          {language === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!'}
        </span>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight font-cinzel">{t(achievement.name, language)}</h4>
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
      className="relative flex flex-col items-center w-full max-w-7xl p-4 bg-black/90 rounded-3xl border-4 border-yellow-900/30 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-2xl"
    >
      <div className="w-full flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-black/40 hover:bg-yellow-900/40 rounded-full border border-yellow-900/20 text-yellow-500 text-sm uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={18} />
          {language === 'pt' ? 'Voltar' : 'Back'}
        </button>
        <h2 className="text-4xl metallic-title tracking-widest">
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
          className="absolute inset-0 z-[200] flex items-center justify-center pointer-events-none"
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
          className="absolute inset-0 z-[300] flex items-center justify-center pointer-events-none"
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
