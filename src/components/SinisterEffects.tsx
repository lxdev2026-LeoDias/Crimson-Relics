import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Skull, Moon, Cat, Eye, Pentagon, Triangle, Sparkles } from 'lucide-react';

const EFFECTS = [
  { icon: Eye, color: 'text-red-600' },
  { icon: Pentagon, color: 'text-purple-900' },
  { icon: Triangle, color: 'text-red-900' },
  { icon: Ghost, color: 'text-gray-800' },
  { icon: Skull, color: 'text-zinc-900' },
  { icon: Moon, color: 'text-indigo-950' },
  { icon: Cat, color: 'text-black' },
  { icon: Sparkles, color: 'text-red-500' },
];

interface ActiveEffect {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  type: number;
}

export const SinisterEffects = () => {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);

  useEffect(() => {
    const spawnEffect = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const newEffect: ActiveEffect = {
        id,
        x: Math.random() * 90 + 5, // 5% to 95%
        y: Math.random() * 90 + 5,
        scale: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * 360,
        type: Math.floor(Math.random() * EFFECTS.length),
      };

      setActiveEffects(prev => [...prev, newEffect]);

      // Remove after some time
      setTimeout(() => {
        setActiveEffects(prev => prev.filter(e => e.id !== id));
      }, 3000 + Math.random() * 2000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance to spawn every interval
        spawnEffect();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {activeEffects.map(effect => {
          const EffectIcon = EFFECTS[effect.type].icon;
          const colorClass = EFFECTS[effect.type].color;

          return (
            <motion.div
              key={effect.id}
              initial={{ opacity: 0, scale: 0, rotate: effect.rotation }}
              animate={{ opacity: [0, 0.2, 0.1, 0], scale: effect.scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 4, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
              className={`${colorClass} blur-[1px]`}
            >
              <EffectIcon size={48 + effect.scale * 20} />
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Random Eye Flashes */}
      <AnimatePresence>
        {activeEffects.length % 3 === 0 && activeEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-red-950/5 mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
