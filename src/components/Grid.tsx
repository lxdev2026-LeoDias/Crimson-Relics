import { AnimatePresence, motion } from 'motion/react';
import { Grid, Position } from '../types';
import { PieceComponent } from './Piece';
import { GridEffect, GridEffects } from './GridEffects';

interface GridProps {
  grid: Grid;
  selectedPiece: Position | null;
  isProcessing: boolean;
  isShaking?: boolean;
  hintPiece?: Position | null;
  effects: GridEffect[];
  onPieceClick: (row: number, col: number) => void;
}

export const GridComponent = ({ grid, selectedPiece, isProcessing, isShaking, hintPiece, effects, onPieceClick }: GridProps) => {
  const gridSize = grid.length;

  return (
    <motion.div 
      animate={isShaking ? {
        x: [-2, 2, -2, 2, 0],
        y: [-2, 2, -2, 2, 0],
      } : {}}
      transition={{ duration: 0.2, repeat: isShaking ? Infinity : 0 }}
      className="relative p-4"
    >
      <GridEffects effects={effects} gridSize={gridSize} />

      <div 
        className="relative p-1 rounded-[32px] bg-gradient-to-br from-red-900/20 via-zinc-900 to-red-900/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
      >
        <div 
          className="relative overflow-hidden rounded-[28px] border border-red-900/30"
          style={{ 
            width: 'min(85vw, 65vh, 600px)',
            aspectRatio: '1/1'
          }}
        >
          {/* Background Grid Cells */}
        <div 
          className="absolute inset-0 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div key={`cell-${i}`} className="aspect-square bg-red-950/10 rounded-xl border border-red-900/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
          ))}
        </div>

        {/* Pieces Layer */}
        <AnimatePresence mode="popLayout">
          {grid.flat().filter((p): p is NonNullable<typeof p> => p !== null).map((piece) => (
            <motion.div
              key={piece.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: `${piece.col * 100}%`,
                y: `${piece.row * 100}%`,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${100 / gridSize}%`,
                height: `${100 / gridSize}%`,
                padding: '4px', // Gap equivalent
              }}
            >
              <PieceComponent
                type={piece.type}
                isSelected={selectedPiece?.row === piece.row && selectedPiece?.col === piece.col}
                isHint={hintPiece?.row === piece.row && hintPiece?.col === piece.col}
                isProcessing={isProcessing}
                specialType={piece.specialType}
                onClick={() => onPieceClick(piece.row, piece.col)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
