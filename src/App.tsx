/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMatch3 } from './hooks/useMatch3';
import { GridComponent } from './components/Grid';
import { HUD, IntroScreen, GameOverScreen, LevelWinScreen, Shop, RelicsScreen, RelicUnlockScreen, LoreScreen, OptionsModal, ExportModal, ComboFeedback, AchievementNotification, AchievementsScreen, PowerUpNotification, LowMovesWarning, FinalLoreScreen, SpeedRunStats, SpeedRunSetupModal, GameplayPanel, ProgressPanel } from './components/GameUI';
import { audioService } from './services/audioService';
import { SinisterEffects } from './components/SinisterEffects';
import { GameState, Language, ExportOptions } from './types';
import { POWER_UPS } from './constants';

const PARTICLES_COUNT = 20;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSpeedRunSetupOpen, setIsSpeedRunSetupOpen] = useState(false);
  
  const {
    grid,
    score,
    moves,
    currentMatchScore,
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
    mistakeCount,
    isShaking,
    hintPiece,
    effects,
    exportSave,
    importSave,
    setLanguage,
    setSelectedTitle,
    setResolution,
    setFullscreen,
    initLevel,
    handlePieceClick,
    getPowerUpCost,
    buyPowerUp,
    purchasesThisLevel,
    completeLevel,
    checkWinCondition,
    resetProgress,
    setNewRelicUnlocked,
    setSkipLore,
    isSpeedRun,
    speedRunCoins,
    lastSpeedRun,
    speedRunLevelIndex,
    speedRunTimers,
    speedRunStartTime,
    currentLevelStartTime,
    startSpeedRun,
    cancelSpeedRun,
    setMusicEnabled,
    setSfxEnabled,
    unlockAchievement,
  } = useMatch3();

  const [currentLevelTime, setCurrentLevelTime] = useState(0);
  const [totalSpeedRunTime, setTotalSpeedRunTime] = useState(0);
  const [scale, setScale] = useState(1);

  // Resolution logic
  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1920;
      const baseHeight = 1080;
      
      let targetWidth = window.innerWidth;
      let targetHeight = window.innerHeight;

      if (playerStats.resolution) {
        const [w, h] = playerStats.resolution.split('x').map(Number);
        targetWidth = w;
        targetHeight = h;
      }

      const scaleX = targetWidth / baseWidth;
      const scaleY = targetHeight / baseHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [playerStats.resolution]);

  useEffect(() => {
    if (playerStats.musicEnabled) {
      audioService.playMusic('main');
    }
    return () => audioService.stopMusic();
  }, [playerStats.musicEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && isSpeedRun) {
      interval = setInterval(() => {
        const now = Date.now();
        setCurrentLevelTime((now - currentLevelStartTime) / 1000);
        setTotalSpeedRunTime((now - speedRunStartTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, isSpeedRun, currentLevelStartTime, speedRunStartTime]);

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
    const result = completeLevel();
    
    if (result === 'next_speedrun') {
      // Logic handled inside completeLevel (initLevel called)
      return;
    }
    
    if (result === 'speedrun_complete') {
      setGameState('speedrun_stats');
      return;
    }

    if (result === 'game_complete') {
      setGameState('final_lore');
      return;
    }

    setGameState('levelwin');
  };

  const startRitual = () => {
    if (playerStats.skipLore) {
      startPlaying();
    } else {
      setGameState('lore');
    }
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans select-none bg-black">
      {/* Scaling Container */}
      <div 
        className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
          gameState === 'playing' ? '' : 'w-full h-full'
        }`}
        style={gameState === 'playing' ? { 
          width: '1920px', 
          height: '1080px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        } : {}}
      >
        {/* Sinister Visual Effects - Only in Intro */}
        {gameState === 'intro' && <SinisterEffects />}

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
                  language={playerStats.language}
                  speedRunUnlocked={playerStats.speedRunUnlocked}
                  bestSpeedRun={playerStats.bestSpeedRun}
                  speedRunRecords={playerStats.speedRunRecords}
                  onStartSpeedRun={() => setIsSpeedRunSetupOpen(true)}
                  onOpenSpeedRunStats={() => setGameState('speedrun_stats')}
                  level={playerStats.level}
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
                onSkipLore={setSkipLore}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-10 flex flex-col items-center w-full max-w-full px-4 py-2 relative overflow-hidden"
            >
              <div className="relative z-10 w-full flex flex-col items-center gap-2">
                <HUD 
                  score={score} 
                  currentMatchScore={currentMatchScore}
                  moves={moves} 
                  goals={goals} 
                  playerStats={playerStats}
                  onOpenShop={() => setIsShopOpen(true)}
                  onBackToMenu={() => {
                    if (isSpeedRun) cancelSpeedRun();
                    setGameState('intro');
                  }}
                  onSelectTitle={setSelectedTitle}
                  isSpeedRun={isSpeedRun}
                  speedRunLevelIndex={speedRunLevelIndex}
                  currentLevelTime={currentLevelTime}
                  totalSpeedRunTime={totalSpeedRunTime}
                  speedRunCoins={speedRunCoins}
                  onExplodeEntity={() => unlockAchievement('shadow_explosion')}
                />
                
                <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 w-full max-w-[1600px]">
                  {/* Left Panel: Gameplay Info */}
                  <div className="w-full xl:w-80 mt-2 xl:mt-4 order-2 xl:order-1">
                    <GameplayPanel 
                      goals={goals} 
                      playerStats={playerStats} 
                      score={score}
                      currentMatchScore={currentMatchScore}
                      comboCount={comboCount}
                      mistakeCount={mistakeCount}
                      isSpeedRun={isSpeedRun}
                      levelTimes={speedRunTimers}
                      currentLevelTime={currentLevelTime}
                      speedRunLevelIndex={speedRunLevelIndex}
                      onExplodeEntity={() => unlockAchievement('shadow_explosion')}
                    />
                  </div>

                  {/* Center: Grid */}
                  <div className="relative flex-1 flex justify-center order-1 xl:order-2 -mt-6 xl:-mt-14">
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
                          <div className="bg-red-600/20 backdrop-blur-sm border-4 border-red-600 rounded-[40px] inset-8 absolute animate-pulse" />
                          <div className="bg-black/80 px-6 py-3 rounded-full border border-red-500 text-red-500 font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(220,38,38,0.6)]">
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

                  {/* Right Panel: Progress Info */}
                  <div className="w-full xl:w-80 flex flex-col gap-6 mt-2 xl:mt-4 order-3">
                    <ProgressPanel 
                      goals={goals} 
                      playerStats={playerStats} 
                      score={score}
                      currentMatchScore={currentMatchScore}
                      comboCount={comboCount}
                      isSpeedRun={isSpeedRun}
                    />
                  </div>
                </div>
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

          {gameState === 'final_lore' && (
            <FinalLoreScreen 
              onStart={() => setGameState('intro')} 
              language={playerStats.language} 
            />
          )}

          {gameState === 'speedrun_stats' && (
            <SpeedRunStats 
              lastSpeedRun={lastSpeedRun}
              speedRunRecords={playerStats.speedRunRecords}
              language={playerStats.language} 
              onBack={() => {
                if (isSpeedRun) cancelSpeedRun();
                setGameState('intro');
              }} 
            />
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
          bloodCoins={isSpeedRun ? speedRunCoins : playerStats.bloodCoins}
          language={playerStats.language}
          onBuy={buyPowerUp}
          getPowerUpCost={getPowerUpCost}
          purchases={purchasesThisLevel}
          isSpeedRun={isSpeedRun}
        />

        <OptionsModal
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          currentLanguage={playerStats.language}
          onSetLanguage={setLanguage}
          onOpenExport={() => setIsExportModalOpen(true)}
          onImport={(save: string) => {
            if (importSave(save)) {
              setIsOptionsOpen(false);
            }
          }}
          onReset={resetProgress}
          musicEnabled={playerStats.musicEnabled ?? true}
          sfxEnabled={playerStats.sfxEnabled ?? true}
          onToggleMusic={setMusicEnabled}
          onToggleSfx={setSfxEnabled}
          resolution={playerStats.resolution || '1920x1080'}
          onSetResolution={setResolution}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          language={playerStats.language}
          onConfirm={(options) => {
            const data = exportSave(options);
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `crimson_relics_save_${new Date().getTime()}.sav`;
            a.click();
            URL.revokeObjectURL(url);
            setIsExportModalOpen(false);
          }}
        />

        <PowerUpNotification 
          notification={powerUpNotification} 
          language={playerStats.language} 
        />

        <LowMovesWarning moves={moves} />

        <SpeedRunSetupModal
          isOpen={isSpeedRunSetupOpen}
          onClose={() => setIsSpeedRunSetupOpen(false)}
          onStart={(name, title) => {
            startSpeedRun(name, title);
            setIsSpeedRunSetupOpen(false);
            setGameState('playing');
          }}
          language={playerStats.language}
          playerStats={playerStats}
        />

        {/* Decorative Borders */}
        <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-50" />
        <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-50" />
      </div>
    </div>
  );
}
