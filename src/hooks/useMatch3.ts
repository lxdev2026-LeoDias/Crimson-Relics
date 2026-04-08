import { useState, useCallback, useEffect, useRef } from 'react';
import { Grid, Piece, PieceType, Position, Level, LevelGoal, PlayerStats, PowerUpType, Relic, Language, SpecialType, Achievement, LocalizedString } from '../types';
import { GRID_SIZE, PIECE_TYPES, SCORE_BASE, SCORE_MATCH_4_MULT, SCORE_MATCH_5_MULT, SCORE_SHAPE_BONUS, COMBO_MULTIPLIERS, LEVELS, RELICS, ACHIEVEMENTS, POWER_UPS } from '../constants';
import { GridEffect } from '../components/GridEffects';
import { audioService } from '../services/audioService';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createPiece = (row: number, col: number, type?: PieceType, specialType: SpecialType = 'none', isPowerful: boolean = false): Piece => ({
  id: generateId(),
  type: type || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
  row,
  col,
  specialType,
  isPowerful,
});

const STORAGE_KEY = 'blood_coven_stats';

export const useMatch3 = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [goals, setGoals] = useState<LevelGoal[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const stats = JSON.parse(saved);
        return {
          level: stats.level || 1,
          bloodCoins: stats.bloodCoins || stats.bloodBags || 1000,
          unlockedRelics: stats.unlockedRelics || [],
          unlockedAchievements: stats.unlockedAchievements || [],
          selectedTitleId: stats.selectedTitleId,
          language: stats.language || 'en',
        };
      } catch (e) {
        console.error('Failed to parse saved stats', e);
      }
    }
    return {
      level: 1,
      bloodCoins: 1000,
      unlockedRelics: [],
      unlockedAchievements: [],
      selectedTitleId: undefined,
      language: 'en',
    };
  });

  const setLanguage = useCallback((lang: Language) => {
    setPlayerStats(prev => ({ ...prev, language: lang }));
  }, []);

  const setSelectedTitle = useCallback((titleId: string) => {
    setPlayerStats(prev => ({ ...prev, selectedTitleId: titleId }));
  }, []);

  const handleBloodCode = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DRACULA') {
      setPlayerStats(prev => ({ ...prev, bloodCoins: prev.bloodCoins + 5000 }));
      return true;
    }
    if (cleanCode === 'NOSFERATU') {
      setPlayerStats(prev => ({ ...prev, level: prev.level + 1 }));
      return true;
    }
    return false;
  }, []);
  const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null);
  const [bloodyTwinFirstType, setBloodyTwinFirstType] = useState<PieceType | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [lastComboText, setLastComboText] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [newRelicUnlocked, setNewRelicUnlocked] = useState<Relic | null>(null);
  const [achievementNotification, setAchievementNotification] = useState<Achievement | null>(null);
  const [powerUpNotification, setPowerUpNotification] = useState<{ name: LocalizedString, color: string } | null>(null);
  const [hintPiece, setHintPiece] = useState<Position | null>(null);
  const [effects, setEffects] = useState<GridEffect[]>([]);
  const [purchasesThisLevel, setPurchasesThisLevel] = useState<Record<string, number>>({});
  const lastMoveTime = useRef(Date.now());

  const getRelicBonus = useCallback((type: string) => {
    return playerStats.unlockedRelics.reduce((acc, relicId) => {
      const relic = RELICS.find(r => r.id === relicId);
      if (relic?.effect.type === type) return acc + relic.effect.value;
      return acc;
    }, 0);
  }, [playerStats.unlockedRelics]);

  // Helper to apply gravity and refill the grid
  const applyGravityAndRefill = useCallback((currentGrid: Grid, isPowerUp: boolean = false): Grid => {
    const nextGrid = currentGrid.map(row => [...row]);
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (nextGrid[r][c] !== null) {
          const piece = nextGrid[r][c]!;
          nextGrid[r][c] = null;
          nextGrid[emptyRow][c] = { ...piece, row: emptyRow, col: c };
          emptyRow--;
        }
      }
      for (let r = emptyRow; r >= 0; r--) {
        let sType: SpecialType = 'none';
        if (!isPowerUp) {
          const specialSpawnChance = getRelicBonus('special_spawn');
          if (Math.random() < specialSpawnChance) {
            sType = Math.random() > 0.5 ? 'row' : 'column';
          }
        }
        nextGrid[r][c] = createPiece(r, c, undefined, sType);
      }
    }
    return nextGrid;
  }, [getRelicBonus]);

  // Helper to calculate score for a set of cleared pieces
  const calculateScoreForMatch = useCallback((match: Position[], matchGrid: Grid, combo: number): number => {
    const matchCount = match.length;
    const firstPos = match[0];
    const type = matchGrid[firstPos.row][firstPos.col]?.type;
    if (!type) return 0;

    const rows = new Set(match.map(p => p.row));
    const cols = new Set(match.map(p => p.col));
    const isShape = rows.size > 1 && cols.size > 1;

    let points = SCORE_BASE;
    if (matchCount === 4) points *= SCORE_MATCH_4_MULT;
    else if (matchCount >= 5) points *= SCORE_MATCH_5_MULT;
    if (isShape) points *= SCORE_SHAPE_BONUS;

    const scoreBoost = getRelicBonus('score_boost');
    points *= (1 + scoreBoost);

    if (matchCount >= 4) {
      const match4Boost = getRelicBonus('match4_boost');
      points *= (1 + match4Boost);
    }

    const comboRelicBoost = getRelicBonus('combo_boost');
    const comboMult = COMBO_MULTIPLIERS[Math.min(combo - 1, COMBO_MULTIPLIERS.length - 1)] + comboRelicBoost;
    points = Math.floor(points * comboMult);

    if (combo > 1) {
      const comboPointsBoost = getRelicBonus('combo_points_boost');
      points = Math.floor(points * (1 + comboPointsBoost));
    }

    return points;
  }, [getRelicBonus]);

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStats));
    } catch (e) {
      console.error('Failed to save stats to localStorage', e);
    }
  }, [playerStats]);

  const unlockAchievement = useCallback((id: string) => {
    setPlayerStats(prev => {
      const nextAchievements = [...(prev.unlockedAchievements || [])];
      if (!nextAchievements.includes(id)) {
        nextAchievements.push(id);
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (achievement) {
          setAchievementNotification(achievement);
          setTimeout(() => setAchievementNotification(null), 5000);
        }
        return { ...prev, unlockedAchievements: nextAchievements };
      }
      return prev;
    });
  }, []);

  const powerUpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showPowerUpNotification = useCallback((name: LocalizedString, color: string) => {
    if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current);
    setPowerUpNotification({ name, color });
    powerUpTimeoutRef.current = setTimeout(() => {
      setPowerUpNotification(null);
      powerUpTimeoutRef.current = null;
    }, 1200);
  }, []);

  // Check for score achievements
  useEffect(() => {
    if (score >= 10000) {
      unlockAchievement('score_10k');
    }
    if (score >= 50000) {
      unlockAchievement('score_50k');
    }
    if (score >= 100000) {
      unlockAchievement('score_100k');
    }
    if (score >= 150000) {
      unlockAchievement('score_150k');
    }
  }, [score, unlockAchievement]);

  // Initialize grid and level
  const initLevel = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setCurrentLevel(level);
    setGoals(level.goals.map(g => ({ ...g, current: 0 })));
    
    // Apply extra moves relic bonus
    const extraMoves = getRelicBonus('extra_moves');
    setMoves(level.moves + Math.floor(extraMoves));
    
    setScore(0);
    setComboCount(0);
    setLastComboText(null);
    setIsProcessing(false);
    setSelectedPiece(null);
    setActivePowerUp(null);
    setPurchasesThisLevel({});

    let newGrid: Grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        let type: PieceType;
        do {
          type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
        } while (
          (r >= 2 && newGrid[r - 1][c]?.type === type && newGrid[r - 2][c]?.type === type) ||
          (c >= 2 && newGrid[r][c - 1]?.type === type && newGrid[r][c - 2]?.type === type)
        );
        newGrid[r][c] = createPiece(r, c, type);
      }
    }
    setGrid(newGrid);
  }, [getRelicBonus]);

  // Update goals progress
  const updateGoals = useCallback((matchedPieces: Piece[], currentScore: number) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.type === 'score') {
        return { ...goal, current: currentScore };
      } else {
        const count = matchedPieces.filter(p => p.type === goal.type).length;
        return { ...goal, current: Math.min(goal.target, goal.current + count) };
      }
    }));
  }, []);

  // Check if level is won
  const checkWinCondition = useCallback(() => {
    return goals.every(goal => goal.current >= goal.target);
  }, [goals]);

  // Find matches with shape detection
  const findMatches = useCallback((currentGrid: Grid) => {
    const matches: Position[][] = [];
    const matchedIds = new Set<string>();

    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const p1 = currentGrid[r][c];
        const p2 = currentGrid[r][c + 1];
        const p3 = currentGrid[r][c + 2];
        if (p1 && p2 && p3 && p1.type === p2.type && p1.type === p3.type) {
          const match = [p1, p2, p3];
          let nextC = c + 3;
          while (nextC < GRID_SIZE && currentGrid[r][nextC]?.type === p1.type) {
            match.push(currentGrid[r][nextC]!);
            nextC++;
          }
          matches.push(match.map(p => ({ row: p.row, col: p.col })));
          c = nextC - 1;
        }
      }
    }

    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const p1 = currentGrid[r][c];
        const p2 = currentGrid[r + 1][c];
        const p3 = currentGrid[r + 2][c];
        if (p1 && p2 && p3 && p1.type === p2.type && p1.type === p3.type) {
          const match = [p1, p2, p3];
          let nextR = r + 3;
          while (nextR < GRID_SIZE && currentGrid[nextR][c]?.type === p1.type) {
            match.push(currentGrid[nextR][c]!);
            nextR++;
          }
          matches.push(match.map(p => ({ row: p.row, col: p.col })));
          r = nextR - 1;
        }
      }
    }

    // Merge overlapping matches to detect L/T shapes
    const mergedMatches: Position[][] = [];
    const matchMap = new Map<string, number>();

    matches.forEach((match, idx) => {
      let merged = false;
      for (const pos of match) {
        const key = `${pos.row},${pos.col}`;
        if (matchMap.has(key)) {
          const existingIdx = matchMap.get(key)!;
          mergedMatches[existingIdx] = Array.from(new Set([...mergedMatches[existingIdx], ...match].map(p => JSON.stringify(p)))).map(s => JSON.parse(s));
          match.forEach(p => matchMap.set(`${p.row},${p.col}`, existingIdx));
          merged = true;
          break;
        }
      }
      if (!merged) {
        const newIdx = mergedMatches.length;
        mergedMatches.push(match);
        match.forEach(p => matchMap.set(`${p.row},${p.col}`, newIdx));
      }
    });

    return mergedMatches;
  }, []);

  // Helper to find a possible match for hints
  const findPossibleMatch = useCallback((currentGrid: Grid) => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        // Try swapping with right
        if (c < GRID_SIZE - 1) {
          const tempGrid = currentGrid.map(row => [...row]);
          const p1 = tempGrid[r][c];
          const p2 = tempGrid[r][c+1];
          if (p1 && p2) {
            tempGrid[r][c] = { ...p2, row: r, col: c };
            tempGrid[r][c+1] = { ...p1, row: r, col: c+1 };
            if (findMatches(tempGrid).length > 0) return { row: r, col: c };
          }
        }
        // Try swapping with down
        if (r < GRID_SIZE - 1) {
          const tempGrid = currentGrid.map(row => [...row]);
          const p1 = tempGrid[r][c];
          const p2 = tempGrid[r+1][c];
          if (p1 && p2) {
            tempGrid[r][c] = { ...p2, row: r, col: c };
            tempGrid[r+1][c] = { ...p1, row: r+1, col: c };
            if (findMatches(tempGrid).length > 0) return { row: r, col: c };
          }
        }
      }
    }
    return null;
  }, [findMatches]);

  // Hint timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isProcessing && grid.length > 0 && Date.now() - lastMoveTime.current > 10000 && !hintPiece) {
        const hint = findPossibleMatch(grid);
        if (hint) setHintPiece(hint);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [grid, isProcessing, hintPiece, findPossibleMatch]);

  const resetHint = useCallback(() => {
    lastMoveTime.current = Date.now();
    setHintPiece(null);
  }, []);

  const getPowerUpCost = useCallback((baseCost: number) => {
    const discount = getRelicBonus('shop_discount');
    return Math.floor(baseCost * (1 - discount));
  }, [getRelicBonus]);

  const addEffect = useCallback((type: GridEffect['type'], pos: Position) => {
    const id = Math.random().toString(36).substr(2, 9);
    setEffects(prev => [...prev, { id, type, pos }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 1000);
  }, []);

  // Secret key for save obfuscation
  const SECRET_KEY = "CRIMSON_RELICS_SECRET";

  const encrypt = useCallback((text: string) => {
    return btoa(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
    ).join(''));
  }, []);

  const decrypt = useCallback((encoded: string) => {
    try {
      const text = atob(encoded);
      return text.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
      ).join('');
    } catch (e) {
      return null;
    }
  }, []);

  // Export/Import
  const exportSave = useCallback(() => {
    const saveData = {
      level: playerStats.level,
      bloodCoins: playerStats.bloodCoins,
      unlockedRelics: playerStats.unlockedRelics,
      language: playerStats.language,
    };
    return encrypt(JSON.stringify(saveData));
  }, [playerStats, encrypt]);

  const importSave = useCallback((saveStr: string) => {
    try {
      const decrypted = decrypt(saveStr);
      if (!decrypted) return false;
      
      const saveData = JSON.parse(decrypted);
      if (saveData.level !== undefined && saveData.bloodCoins !== undefined) {
        setPlayerStats(prev => ({
          ...prev,
          level: saveData.level,
          bloodCoins: saveData.bloodCoins,
          unlockedRelics: saveData.unlockedRelics || [],
          language: saveData.language || prev.language,
        }));
        initLevel(saveData.level);
        return true;
      }
    } catch (e) {
      console.error('Failed to import save', e);
    }
    return false;
  }, [initLevel, decrypt]);

  // Helper to trigger special pieces and their effects recursively
  const addPiecesToClear = useCallback((pos: Position, nextGrid: Grid, piecesToClear: Position[], processedInMatch: Set<string>, allMatchedPieces: Piece[], isInitial: boolean = false) => {
    const key = `${pos.row},${pos.col}`;
    if (processedInMatch.has(key)) return;
    processedInMatch.add(key);

    const p = nextGrid[pos.row][pos.col];
    if (!p) return;

    piecesToClear.push(pos);

    if (isInitial && p.specialType !== 'none') {
      const specialNames: Record<string, LocalizedString> = {
        row: { en: 'Horizontal Cleave', pt: 'Corte Horizontal' },
        column: { en: 'Vertical Cleave', pt: 'Corte Vertical' },
        area: { en: 'Blood Bomb', pt: 'Bomba de Sangue' },
        bomb: { en: 'Blood Bomb', pt: 'Bomba de Sangue' },
        arrows: { en: 'Sanguine Arrows', pt: 'Flechas Sanguíneas' },
        chaos: { en: 'Chaotic Blood', pt: 'Sangue Caótico' },
        soaked: { en: 'Bloodsoaked', pt: 'Encharcado de Sangue' },
        stained: { en: 'Bloodstained', pt: 'Manchado de Sangue' },
        steps: { en: 'Ritual Steps', pt: 'Passos Ritualísticos' }
      };
      const specialColors: Record<string, string> = {
        row: '#f97316', column: '#f97316', area: '#ef4444', bomb: '#ef4444', 
        arrows: '#fb923c', chaos: '#a855f7', soaked: '#dc2626', stained: '#991b1b', steps: '#22c55e'
      };
      
      if (specialNames[p.specialType]) {
        showPowerUpNotification(specialNames[p.specialType], specialColors[p.specialType] || '#ef4444');
      }
    }

    if (p.specialType === 'row') {
      addEffect('arrow-h', pos);
      audioService.playSound('lightning');
      for (let c = 0; c < GRID_SIZE; c++) addPiecesToClear({ row: pos.row, col: c }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
    } else if (p.specialType === 'column') {
      addEffect('arrow-v', pos);
      audioService.playSound('lightning');
      for (let r = 0; r < GRID_SIZE; r++) addPiecesToClear({ row: r, col: pos.col }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
    } else if (p.specialType === 'area' || p.specialType === 'bomb') {
      addEffect('bomb', pos);
      audioService.playSound('bomb');
      for (let r = pos.row - 1; r <= pos.row + 1; r++) {
        for (let c = pos.col - 1; c <= pos.col + 1; c++) {
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
        }
      }
    } else if (p.specialType === 'arrows') {
      addEffect('arrow-h', pos);
      addEffect('arrow-v', pos);
      audioService.playSound('lightning');
      for (let i = 0; i < GRID_SIZE; i++) {
        addPiecesToClear({ row: pos.row, col: i }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
        addPiecesToClear({ row: i, col: pos.col }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
      }
    } else if (p.specialType === 'chaos') {
      addEffect('chaos', pos);
      audioService.playSound('ghost');
      const randomPositions: Position[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) randomPositions.push({ row: r, col: c });
      }
      for (let i = 0; i < 10; i++) {
        if (randomPositions.length === 0) break;
        const idx = Math.floor(Math.random() * randomPositions.length);
        addPiecesToClear(randomPositions.splice(idx, 1)[0], nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
      }
    } else if (p.specialType === 'soaked') {
      addEffect('soaked', pos);
      audioService.playSound('bubble');
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
      }
    } else if (p.specialType === 'stained' || p.specialType === 'color') {
      addEffect('stained', pos);
      audioService.playSound('bubble');
      const targetType = p.type;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (nextGrid[r][c]?.type === targetType) addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processedInMatch, allMatchedPieces);
        }
      }
    } else if (p.specialType === 'steps') {
      audioService.playSound('buy');
      setMoves(m => m + 5);
    }
  }, [addEffect, showPowerUpNotification]);

  // Process matches and gravity
  const processMatches = useCallback(async (currentGrid: Grid, combo: number = 0) => {
    const matches = findMatches(currentGrid);
    if (matches.length === 0) {
      setIsProcessing(false);
      setComboCount(0);
      setLastComboText(null);
      return;
    }

    setIsProcessing(true);
    audioService.playSound('match');
    let currentCombo = combo;
    const nextGrid = currentGrid.map(row => [...row]);
    let totalPoints = 0;
    const allMatchedPieces: Piece[] = [];
    
    // 1. Calculate scores and identify special pieces to create
    const specialPiecesToCreate: { pos: Position, type: PieceType, specialType: SpecialType, isPowerful: boolean }[] = [];
    const allPiecesToClearPositions = new Set<string>();

    for (const match of matches) {
      currentCombo++;
      const matchCount = match.length;
      const firstPos = match[0];
      const type = nextGrid[firstPos.row][firstPos.col]?.type;
      if (!type) continue;

      const rows = new Set(match.map(p => p.row));
      const cols = new Set(match.map(p => p.col));
      const isShape = rows.size > 1 && cols.size > 1;

      if (matchCount >= 5) unlockAchievement('match_5');

      totalPoints += calculateScoreForMatch(match, nextGrid, currentCombo);

      // Identify special piece creation
      if (matchCount >= 4) {
        const isPowerful = matchCount >= 5 || isShape;
        let specialType: SpecialType = 'none';
        switch (type) {
          case 'skull': specialType = 'steps'; break;
          case 'fang': specialType = 'arrows'; break;
          case 'blood': specialType = 'chaos'; break;
          case 'candle': specialType = 'bomb'; break;
          case 'bat': specialType = 'soaked'; break;
          case 'gem': specialType = 'stained'; break;
        }
        specialPiecesToCreate.push({ pos: firstPos, type, specialType, isPowerful });
      }

      // Identify all pieces to clear (including chain reactions)
      const piecesToClear: Position[] = [];
      const processedInMatch = new Set<string>();

      match.forEach(m => {
        addPiecesToClear(m, nextGrid, piecesToClear, processedInMatch, allMatchedPieces, true);
        
        const neighbors = [
          { row: m.row - 1, col: m.col },
          { row: m.row + 1, col: m.col },
          { row: m.row, col: m.col - 1 },
          { row: m.row, col: m.col + 1 },
        ];
        neighbors.forEach(n => {
          if (n.row >= 0 && n.row < GRID_SIZE && n.col >= 0 && n.col < GRID_SIZE) {
            const neighborPiece = nextGrid[n.row][n.col];
            if (neighborPiece && neighborPiece.specialType !== 'none') {
              addPiecesToClear(n, nextGrid, piecesToClear, processedInMatch, allMatchedPieces, true);
            }
          }
        });
      });

      piecesToClear.forEach(p => allPiecesToClearPositions.add(`${p.row},${p.col}`));
    }

    // 2. Actually clear the pieces and update allMatchedPieces
    allPiecesToClearPositions.forEach(key => {
      const [r, c] = key.split(',').map(Number);
      const p = nextGrid[r][c];
      if (p) {
        allMatchedPieces.push(p);
        nextGrid[r][c] = null;
      }
    });

    // 3. Create new special pieces
    specialPiecesToCreate.forEach(sp => {
      // Only create if the spot is empty (it should be, as it was part of a match)
      if (nextGrid[sp.pos.row][sp.pos.col] === null) {
        nextGrid[sp.pos.row][sp.pos.col] = createPiece(sp.pos.row, sp.pos.col, sp.type, sp.specialType, sp.isPowerful);
      }
    });

    setComboCount(currentCombo);
    
    if (currentCombo > 1) {
      if (currentCombo >= 6) unlockAchievement('combo_x6');
      const comboText = playerStats.language === 'pt' 
        ? (currentCombo >= 6 ? 'COMBO VAMPÍRICO' : `COMBO x${currentCombo}`)
        : (currentCombo >= 6 ? 'VAMPIRIC COMBO' : `COMBO x${currentCombo}`);
      setLastComboText(comboText);
    }

    const nextScore = score + totalPoints + (allMatchedPieces.length * 10);
    setScore(nextScore);
    updateGoals(allMatchedPieces, nextScore);
    setGrid(nextGrid);

    const maxMatchSize = Math.max(...matches.map(m => m.length));
    if (maxMatchSize >= 5) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const afterGravity = applyGravityAndRefill(nextGrid);
    setGrid(afterGravity);
    await new Promise(resolve => setTimeout(resolve, 300));
    await processMatches(afterGravity, currentCombo);
  }, [findMatches, score, updateGoals, getRelicBonus, playerStats.language, unlockAchievement, calculateScoreForMatch, applyGravityAndRefill, addPiecesToClear]);

  const swapPieces = useCallback(async (pos1: Position, pos2: Position) => {
    if (isProcessing || moves <= 0) return;
    resetHint();

    const nextGrid = grid.map(row => [...row]);
    const p1 = nextGrid[pos1.row][pos1.col];
    const p2 = nextGrid[pos2.row][pos2.col];

    if (!p1 || !p2) return;

    // Special piece interaction
    if (p1.specialType !== 'none' && p2.specialType !== 'none') {
      setMoves(m => m - 1);
      setIsProcessing(true);
      
      const piecesToClear: Position[] = [];
      const processed = new Set<string>();
      const matched: Piece[] = [];
      
      // Trigger both special pieces at their current positions
      addPiecesToClear(pos1, nextGrid, piecesToClear, processed, matched, true);
      addPiecesToClear(pos2, nextGrid, piecesToClear, processed, matched, true);
      
      // Add a massive area clear for the combo
      for (let r = Math.min(pos1.row, pos2.row) - 2; r <= Math.max(pos1.row, pos2.row) + 2; r++) {
        for (let c = Math.min(pos1.col, pos2.col) - 2; c <= Math.max(pos1.col, pos2.col) + 2; c++) {
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processed, matched);
          }
        }
      }

      piecesToClear.forEach(m => {
        const p = nextGrid[m.row][m.col];
        if (p) {
          matched.push(p);
          nextGrid[m.row][m.col] = null;
        }
      });

      setGrid(nextGrid);
      const points = (matched.length * SCORE_BASE) + (matched.length * 10);
      setScore(s => s + points);
      updateGoals(matched, score + points);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      const afterGravity = applyGravityAndRefill(nextGrid, true);
      setGrid(afterGravity);
      await new Promise(resolve => setTimeout(resolve, 300));
      await processMatches(afterGravity);
      return;
    }

    nextGrid[pos1.row][pos1.col] = { ...p2, row: pos1.row, col: pos1.col };
    nextGrid[pos2.row][pos2.col] = { ...p1, row: pos2.row, col: pos2.col };

    setGrid(nextGrid);
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = findMatches(nextGrid);
    const isSpecialTrigger = p1.specialType !== 'none' || p2.specialType !== 'none';
    
    if (matches.length > 0 || isSpecialTrigger) {
      setMoves(m => m - 1);
      await processMatches(nextGrid);
    } else {
      const backGrid = grid.map(row => [...row]);
      setGrid(backGrid);
      setIsProcessing(false);
    }
  }, [grid, isProcessing, moves, findMatches, processMatches, getRelicBonus, addPiecesToClear, applyGravityAndRefill, score, updateGoals]);

  // Power-up implementations
  const usePowerUp = useCallback(async (type: PowerUpType, pos?: Position) => {
    if (isProcessing) return;

    let matchedPieces: Piece[] = [];
    try {
      setIsProcessing(true);
      const nextGrid = grid.map(row => [...row]);
      const piecesToClear: Position[] = [];
      const processed = new Set<string>();

      const pu = POWER_UPS.find(p => p.type === type);
      if (pu) {
        const colors: Record<string, string> = {
          bomb: '#ef4444', arrow: '#f97316', steps: '#22c55e', chaos: '#a855f7', 
          hammer: '#3b82f6', soaked: '#dc2626', stained: '#991b1b', bloody_twin: '#7f1d1d'
        };
        showPowerUpNotification(pu.name, colors[type] || '#ef4444');
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      switch (type) {
        case 'bomb':
          if (!pos) break;
          for (let r = pos.row - 1; r <= pos.row + 1; r++) {
            for (let c = pos.col - 1; c <= pos.col + 1; c++) {
              if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processed, matchedPieces);
              }
            }
          }
          break;
        case 'arrow':
          if (!pos) break;
          for (let i = 0; i < GRID_SIZE; i++) {
            addPiecesToClear({ row: pos.row, col: i }, nextGrid, piecesToClear, processed, matchedPieces);
            addPiecesToClear({ row: i, col: pos.col }, nextGrid, piecesToClear, processed, matchedPieces);
          }
          break;
        case 'steps':
          setMoves(m => m + 5);
          setIsProcessing(false);
          setActivePowerUp(null);
          return;
        case 'chaos':
          const positions: Position[] = [];
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              positions.push({ row: r, col: c });
            }
          }
          for (let i = 0; i < 10; i++) {
            if (positions.length === 0) break;
            const idx = Math.floor(Math.random() * positions.length);
            const p = positions.splice(idx, 1)[0];
            addPiecesToClear(p, nextGrid, piecesToClear, processed, matchedPieces);
          }
          break;
        case 'hammer':
          if (!pos) break;
          addPiecesToClear(pos, nextGrid, piecesToClear, processed, matchedPieces, true);
          break;
        case 'soaked':
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processed, matchedPieces);
            }
          }
          break;
        case 'stained':
          if (!pos) break;
          const targetType = nextGrid[pos.row][pos.col]?.type;
          if (targetType) {
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (nextGrid[r][c]?.type === targetType) {
                  addPiecesToClear({ row: r, col: c }, nextGrid, piecesToClear, processed, matchedPieces);
                }
              }
            }
          }
          break;
        case 'bloody_twin':
          if (!pos || !bloodyTwinFirstType) break;
          const secondType = nextGrid[pos.row][pos.col]?.type;
          if (secondType && secondType !== bloodyTwinFirstType) {
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                const piece = nextGrid[r][c];
                if (piece && piece.type === secondType) {
                  nextGrid[r][c] = { ...piece, type: bloodyTwinFirstType };
                  addEffect('chaos', { row: r, col: c });
                }
              }
            }
            setGrid(nextGrid);
            await new Promise(resolve => setTimeout(resolve, 600));
            await processMatches(nextGrid);
            setActivePowerUp(null);
            setBloodyTwinFirstType(null);
            return;
          }
          break;
      }

      piecesToClear.forEach(m => {
        const p = nextGrid[m.row][m.col];
        if (p) {
          matchedPieces.push(p);
          nextGrid[m.row][m.col] = null;
        }
      });

      if (matchedPieces.length > 0) {
        setGrid(nextGrid);
        const points = (matchedPieces.length * SCORE_BASE) + (matchedPieces.length * 10);
        const nextScore = score + points;
        setScore(nextScore);
        updateGoals(matchedPieces, nextScore);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const afterGravity = applyGravityAndRefill(nextGrid, true);
        setGrid(afterGravity);
        await new Promise(resolve => setTimeout(resolve, 300));
        await processMatches(afterGravity);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error using power-up:', error);
      setIsProcessing(false);
    } finally {
      setActivePowerUp(null);
      // Ensure processing is false if we didn't trigger processMatches (which handles its own state)
      // or if an error occurred. If matchedPieces.length > 0, processMatches will eventually set it to false.
      if (matchedPieces.length === 0) {
        setIsProcessing(false);
      }
    }
  }, [grid, isProcessing, score, updateGoals, processMatches, showPowerUpNotification, addPiecesToClear, bloodyTwinFirstType, addEffect, applyGravityAndRefill]);

  const handlePieceClick = (row: number, col: number) => {
    if (isProcessing || moves <= 0) return;
    resetHint();

    if (activePowerUp) {
      if (['bomb', 'arrow', 'hammer', 'stained'].includes(activePowerUp)) {
        usePowerUp(activePowerUp, { row, col });
        return;
      }
      if (activePowerUp === 'bloody_twin') {
        if (!bloodyTwinFirstType) {
          const piece = grid[row][col];
          if (piece) {
            setBloodyTwinFirstType(piece.type);
            addEffect('chaos', { row, col });
            showPowerUpNotification({ en: 'Select target type', pt: 'Selecione o tipo alvo' }, '#ef4444');
          }
        } else {
          usePowerUp('bloody_twin', { row, col });
        }
        return;
      }
    }

    if (!selectedPiece) {
      setSelectedPiece({ row, col });
    } else {
      const isAdjacent = 
        (Math.abs(selectedPiece.row - row) === 1 && selectedPiece.col === col) ||
        (Math.abs(selectedPiece.col - col) === 1 && selectedPiece.row === row);

      if (isAdjacent) {
        swapPieces(selectedPiece, { row, col });
        setSelectedPiece(null);
      } else {
        setSelectedPiece({ row, col });
      }
    }
  };

  const buyPowerUp = (powerUp: PowerUpType, baseCost: number) => {
    const currentPurchases = purchasesThisLevel[powerUp] || 0;
    if (currentPurchases >= 2) return false;

    const cost = getPowerUpCost(baseCost);
    if (playerStats.bloodCoins >= cost) {
      setPlayerStats(prev => ({ ...prev, bloodCoins: prev.bloodCoins - cost }));
      setPurchasesThisLevel(prev => ({
        ...prev,
        [powerUp]: (prev[powerUp] || 0) + 1
      }));
      
      if (powerUp === 'steps') {
        usePowerUp('steps');
      } else if (powerUp === 'chaos') {
        usePowerUp('chaos');
      } else if (powerUp === 'soaked') {
        usePowerUp('soaked');
      } else {
        setActivePowerUp(powerUp);
        setBloodyTwinFirstType(null);
      }
      return true;
    }
    return false;
  };

  const completeLevel = () => {
    const nextLevel = playerStats.level + 1;
    let unlockedRelic: Relic | null = null;

    // Relic unlock every 10 levels
    if (nextLevel % 10 === 1 && nextLevel > 1) {
      const relicIndex = Math.floor((nextLevel - 1) / 10) - 1;
      if (relicIndex >= 0 && relicIndex < RELICS.length) {
        const relic = RELICS[relicIndex];
        if (!playerStats.unlockedRelics.includes(relic.id)) {
          unlockedRelic = relic;
        }
      }
    }

    setPlayerStats(prev => {
      const nextUnlockedRelics = unlockedRelic ? [...prev.unlockedRelics, unlockedRelic.id] : prev.unlockedRelics;
      
      return {
        ...prev,
        level: nextLevel,
        bloodCoins: prev.bloodCoins + currentLevel.rewardCoins,
        unlockedRelics: nextUnlockedRelics,
      };
    });

    if (unlockedRelic) {
      unlockAchievement(`relic_${unlockedRelic.id}`);
      setNewRelicUnlocked(unlockedRelic);
    }
  };

  return {
    grid,
    score,
    moves,
    isProcessing,
    selectedPiece,
    currentLevel,
    goals,
    playerStats,
    activePowerUp,
    comboCount,
    lastComboText,
    isShaking,
    newRelicUnlocked,
    setNewRelicUnlocked,
    achievementNotification,
    powerUpNotification,
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
    resetProgress: () => {
      const defaultStats: PlayerStats = {
        level: 1,
        bloodCoins: 1000,
        unlockedRelics: [],
        unlockedAchievements: [],
        language: playerStats.language,
      };
      setPlayerStats(defaultStats);
      localStorage.removeItem(STORAGE_KEY);
      initLevel(1);
    },
  };
};
