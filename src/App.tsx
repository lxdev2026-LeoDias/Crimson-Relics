/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMatch3 } from './hooks/useMatch3';
import { GridComponent } from './components/Grid';
import { HUD, IntroScreen, GameOverScreen, LevelWinScreen, Shop, RelicsScreen, RelicUnlockScreen, LoreScreen, OptionsModal, ComboFeedback, AchievementNotification, AchievementsScreen, PowerUpNotification, BloodCodesModal, LowMovesWarning } from './components/GameUI';
import { audioService } from './services/audioService';
import { SinisterEffects } from './components/SinisterEffects';
import { GameState, Language } from './types';
import { POWER_UPS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isBloodCodesOpen, setIsBloodCodesOpen] = useState(false);
  
  const {
    grid,
    score,
    moves,
    isProcessing,
    selectedPiece,
    currentLevel,
    goals,
    playerStats,
    activePowerUp,
    newRelicUnlocked,
    achievementNotification,
    powerUpNotification,
    lastComboText,
    comboCount,
    isShaking,
    hintPiece,
    effects,
    exportSave,
    importSave,
    setLanguage,
    setSelectedTitle,
    handleBloodCode,
    initLevel,
    handlePieceClick,
    getPowerUpCost,
    buyPowerUp,
    purchasesThisLevel,
    completeLevel,
    checkWinCondition,
    resetProgress,
    setNewRelicUnlocked,
  } = useMatch3();

  useEffect(() => {
    if (gameState === 'playing' && moves <= 0 && !isProcessing) {
      if (checkWinCondition()) {
        audioService.playSound('levelWin');
        handleLevelWin();
      } else {
        audioService.playSound('levelFail');
        setGameState('gameover');
      }
    } else if (gameState === 'playing' && checkWinCondition() && !isProcessing) {
      audioService.playSound('levelWin');
      handleLevelWin();
    }
  }, [moves, isProcessing, goals, gameState]);

  // Handle relic unlock
  useEffect(() => {
    if (newRelicUnlocked) {
      setGameState('relicunlock');
    }
  }, [newRelicUnlocked]);

  const handleLevelWin = () => {
    if (gameState !== 'playing') return;
    completeLevel();
    setGameState('levelwin');
  };

  const startRitual = () => {
    setGameState('lore');
  };

  const startPlaying = () => {
    initLevel(playerStats.level);
    setGameState('playing');
  };

  const restartGame = () => {
    initLevel(1);
    setGameState('playing');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        {/* Fog effect */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
      </div>

      {/* Sinister Visual Effects */}
      <SinisterEffects />

      {/* Blood Codes Modal */}
      <BloodCodesModal 
        isOpen={isBloodCodesOpen}
        onClose={() => setIsBloodCodesOpen(false)}
        onApplyCode={handleBloodCode}
        language={playerStats.language}
      />

      {/* Combo Feedback */}
      <ComboFeedback text={lastComboText} comboCount={comboCount} />

      {/* Achievement Notification */}
      <AnimatePresence>
        {achievementNotification && (
          <AchievementNotification 
            achievement={achievementNotification} 
            language={playerStats.language} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10"
          >
            <IntroScreen 
              onStart={startRitual} 
              onOpenRelics={() => setGameState('relics')}
              onOpenAchievements={() => setGameState('achievements')}
              onOpenOptions={() => setIsOptionsOpen(true)}
              onOpenBloodCodes={() => setIsBloodCodesOpen(true)}
              language={playerStats.language}
            />
          </motion.div>
        )}

        {gameState === 'lore' && (
          <motion.div
            key="lore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50"
          >
            <LoreScreen 
              onStart={startPlaying} 
              language={playerStats.language}
            />
          </motion.div>
        )}

        {gameState === 'relics' && (
          <motion.div
            key="relics"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-20"
          >
            <RelicsScreen 
              onStart={() => setGameState('intro')} 
              playerStats={playerStats}
            />
          </motion.div>
        )}

        {gameState === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-20"
          >
            <AchievementsScreen 
              unlockedAchievements={playerStats.unlockedAchievements} 
              language={playerStats.language} 
              onBack={() => setGameState('intro')} 
            />
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="z-10 flex flex-col items-center w-full max-w-4xl px-4 py-12 relative rounded-[40px] border-2 border-red-900/20 overflow-hidden bg-zinc-950/80 backdrop-blur-sm"
          >
            {/* Circulating Glow Border Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-150%] opacity-50 blur-xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 175deg, #ff0000 180deg, transparent 185deg, transparent 360deg)',
                }}
              />
              {/* Inner mask to keep glow only on edges */}
              <div className="absolute inset-[2px] bg-zinc-950/90 rounded-[38px]" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
              <HUD 
                score={score} 
                moves={moves} 
                goals={goals} 
                playerStats={playerStats}
                onOpenShop={() => setIsShopOpen(true)}
                onBackToMenu={() => setGameState('intro')}
                onSelectTitle={setSelectedTitle}
              />
              
              <div className="relative">
                <GridComponent
                  grid={grid}
                  selectedPiece={selectedPiece}
                  isProcessing={isProcessing}
                  isShaking={isShaking}
                  hintPiece={hintPiece}
                  effects={effects}
                  onPieceClick={handlePieceClick}
                />
                
                {/* Power-up Activation Overlay */}
                <AnimatePresence>
                  {activePowerUp && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-red-600/20 backdrop-blur-sm border-4 border-red-600 rounded-3xl inset-0 absolute animate-pulse" />
                      <div className="bg-black/60 px-6 py-3 rounded-full border border-red-500 text-red-500 font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        {(() => {
                          const pu = POWER_UPS.find(p => p.type === activePowerUp);
                          const name = pu ? (pu.name[playerStats.language] || pu.name['en']) : activePowerUp;
                          return playerStats.language === 'pt' ? `Selecione o Alvo para ${name}` : `Select Target for ${name}`;
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="mt-8 text-red-500/40 text-[10px] uppercase tracking-[0.4em] font-medium flex items-center gap-4">
              <div className="h-[1px] w-8 bg-red-900/30" />
              {playerStats.language === 'pt' ? 'O Ritual Exige Sacrifício' : 'The Ritual Demands Sacrifice'}
              <div className="h-[1px] w-8 bg-red-900/30" />
            </div>
          </motion.div>
        )}

        {gameState === 'levelwin' && (
          <motion.div
            key="levelwin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-20"
          >
            <LevelWinScreen 
              onStart={startPlaying} 
              score={score} 
              level={playerStats.level - 1}
              bags={currentLevel.rewardCoins}
              language={playerStats.language}
            />
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-20"
          >
            <GameOverScreen onStart={startPlaying} score={score} language={playerStats.language} />
          </motion.div>
        )}
      </AnimatePresence>

      {newRelicUnlocked && (
        <RelicUnlockScreen 
          relic={newRelicUnlocked} 
          language={playerStats.language}
          onStart={() => {
            setNewRelicUnlocked(null);
            setGameState('levelwin'); // Return to level win screen after claiming
          }} 
        />
      )}

      <Shop 
        isOpen={isShopOpen} 
        onClose={() => setIsShopOpen(false)} 
        bloodCoins={playerStats.bloodCoins}
        language={playerStats.language}
        onBuy={buyPowerUp}
        getPowerUpCost={getPowerUpCost}
        purchases={purchasesThisLevel}
      />

      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        currentLanguage={playerStats.language}
        onSetLanguage={setLanguage}
        onExport={exportSave}
        onImport={(save: string) => {
          if (importSave(save)) {
            setIsOptionsOpen(false);
          }
        }}
        onReset={resetProgress}
      />

      <PowerUpNotification 
        notification={powerUpNotification} 
        language={playerStats.language} 
      />

      <LowMovesWarning moves={moves} />

      {/* Decorative Borders */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-50" />
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-50" />
    </div>
  );
}
