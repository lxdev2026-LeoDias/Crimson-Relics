import { motion, AnimatePresence } from 'motion/react';
import { Position } from '../types';

export interface GridEffect {
  id: string;
  type: 'bomb' | 'arrow-h' | 'arrow-v' | 'chaos' | 'hammer' | 'soaked' | 'stained';
  pos: Position;
}

interface GridEffectsProps {
  effects: GridEffect[];
  gridSize: number;
}

export const GridEffects = ({ effects, gridSize }: GridEffectsProps) => {
  const cellSize = 100 / gridSize;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-3xl">
      <AnimatePresence>
        {effects.map(effect => (
          <div 
            key={effect.id} 
            className="absolute"
            style={{ 
              left: `${effect.pos.col * cellSize}%`, 
              top: `${effect.pos.row * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
            }}
          >
            {effect.type === 'bomb' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute w-full h-full bg-orange-600/40 rounded-full blur-xl border-4 border-orange-500"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute w-full h-full bg-white/60 rounded-full blur-md"
                />
              </div>
            )}

            {effect.type === 'arrow-h' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scaleX: 0, opacity: 1 }}
                  animate={{ scaleX: 10, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                />
              </div>
            )}

            {effect.type === 'arrow-v' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scaleY: 0, opacity: 1 }}
                  animate={{ scaleY: 10, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute h-full w-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                />
              </div>
            )}

            {effect.type === 'chaos' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: 0, opacity: 1 }}
                  animate={{ scale: 2, rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-full h-full border-2 border-purple-500 rounded-lg blur-[1px]"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-full bg-purple-900/30 blur-md"
                />
              </div>
            )}

            {effect.type === 'hammer' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 2, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: [0, 1, 0], y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-full bg-white/40 rounded-full blur-sm"
                />
              </div>
            )}

            {effect.type === 'soaked' && (
              <div className="fixed inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-red-900/40 blur-3xl"
                />
              </div>
            )}

            {effect.type === 'stained' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-full h-full border-4 border-pink-500 rounded-full blur-sm"
                />
              </div>
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
