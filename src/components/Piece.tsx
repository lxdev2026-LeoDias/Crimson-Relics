import { motion } from 'motion/react';
import { PieceType, SpecialType } from '../types';
import { PIECE_CONFIG } from '../constants';

interface PieceProps {
  type: PieceType;
  isSelected: boolean;
  isHint?: boolean;
  isProcessing: boolean;
  specialType: SpecialType;
  onClick: () => void;
}

export const PieceComponent = ({ type, isSelected, isHint, isProcessing, specialType, onClick }: PieceProps) => {
  const config = PIECE_CONFIG[type];
  const Icon = config.icon;

  const isSpecial = specialType !== 'none';
  const isPowerful = specialType === 'stained';

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0, rotate: -45 }}
      animate={{ 
        scale: isSelected ? 1.1 : (isHint ? [1, 1.1, 1] : 1), 
        opacity: 1,
        rotate: 0,
        boxShadow: isSelected ? `0 0 20px ${config.glow}` : (isHint ? `0 0 15px ${config.glow}` : (isPowerful ? `0 0 15px #ff00ff` : (isSpecial ? `0 0 10px ${config.color}` : 'none'))),
        borderColor: isSelected ? config.color : (isHint ? config.color : (isPowerful ? '#ff00ff' : (isSpecial ? config.color : 'transparent')))
      }}
      transition={isHint ? { duration: 1, repeat: Infinity } : {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      exit={{ 
        scale: 1.5, 
        opacity: 0, 
        rotate: 45,
        filter: "blur(10px)",
        transition: { duration: 0.5, ease: "easeOut" }
      }}
      whileHover={!isProcessing ? { scale: 1.05, boxShadow: `0 0 15px ${config.glow}` } : {}}
      onClick={onClick}
      className={`
        relative w-full h-full flex items-center justify-center cursor-pointer
        rounded-xl border-2 transition-colors duration-200
        ${isPowerful ? 'bg-purple-900/40' : (isSpecial ? 'bg-red-900/20' : 'bg-black/40')}
        backdrop-blur-sm
      `}
    >
      <Icon 
        size={isPowerful ? "75%" : (isSpecial ? "65%" : "60%")}
        color={config.color} 
        style={{ filter: `drop-shadow(0 0 5px ${config.glow})` }}
      />
      
      {isPowerful && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-purple-500 rounded-xl opacity-50"
        />
      )}
      
      {isSpecial && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 border border-red-500/30 rounded-xl"
        />
      )}

      {/* Special Visuals based on type */}
      {specialType === 'row' && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/50 blur-[1px]" />
      )}
      {specialType === 'column' && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/50 blur-[1px]" />
      )}
      {(specialType === 'area' || specialType === 'bomb') && (
        <div className="absolute inset-0 border-2 border-red-500/30 rounded-xl animate-pulse" />
      )}
      {specialType === 'arrows' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-white/40" />
          <div className="absolute h-full w-[1px] bg-white/40" />
        </div>
      )}
      {specialType === 'steps' && (
        <div className="absolute bottom-1 right-1 text-[10px] font-bold text-green-400">+5</div>
      )}
      {specialType === 'chaos' && (
        <div className="absolute inset-0 border border-yellow-500/30 rounded-xl animate-spin-slow" />
      )}
      {specialType === 'soaked' && (
        <div className="absolute inset-0 bg-red-600/20 rounded-xl animate-pulse" />
      )}
      {specialType === 'stained' && (
        <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-xl" />
      )}

      {isSelected && (
        <motion.div
          layoutId="selection-ring"
          className="absolute inset-0 rounded-xl border-2 border-white/50 pointer-events-none"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
};
