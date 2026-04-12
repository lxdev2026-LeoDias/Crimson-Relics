export type PieceType = 'blood' | 'skull' | 'bat' | 'gem' | 'candle' | 'fang';

export type SpecialType = 'row' | 'column' | 'area' | 'color' | 'steps' | 'arrows' | 'chaos' | 'bomb' | 'soaked' | 'stained' | 'none';

export type Language = 'en' | 'pt';

export interface LocalizedString {
  en: string;
  pt: string;
}

export interface Piece {
  id: string;
  type: PieceType;
  row: number;
  col: number;
  specialType: SpecialType;
  isPowerful?: boolean; // For Match 5+ or L/T shapes
}

export type Grid = (Piece | null)[][];

export type GameState = 'intro' | 'lore' | 'playing' | 'gameover' | 'levelwin' | 'relics' | 'relicunlock' | 'achievements' | 'final_lore' | 'speedrun_stats';

export interface Position {
  row: number;
  col: number;
}

export type GoalType = 'score' | PieceType;

export interface LevelGoal {
  type: GoalType;
  target: number;
  current: number;
}

export interface Level {
  id: number;
  goals: LevelGoal[];
  moves: number;
  rewardXP: number; // Keeping for logic but will be hidden/unused in UI if requested
  rewardCoins: number;
}

export type PowerUpType = 'bomb' | 'arrow' | 'steps' | 'chaos' | 'hammer' | 'soaked' | 'stained' | 'bloody_twin';

export interface PowerUp {
  type: PowerUpType;
  name: LocalizedString;
  description: LocalizedString;
  cost: number;
  icon: any;
}

export interface SpeedRunRecord {
  levelTimes: number[];
  totalTime: number;
  date: string;
  playerName?: string;
  playerTitle?: string;
}

export interface PlayerStats {
  level: number;
  bloodCoins: number;
  unlockedRelics: string[]; // Array of relic IDs
  unlockedAchievements: string[]; // Array of achievement IDs
  selectedTitleId?: string;
  skipLore?: boolean;
  language: Language;
  speedRunUnlocked?: boolean;
  earnedRelics?: string[];
  bestSpeedRun?: SpeedRunRecord;
  speedRunRecords?: SpeedRunRecord[];
  musicEnabled?: boolean;
  sfxEnabled?: boolean;
  resolution?: string; // e.g., "1920x1080"
  fullscreen?: boolean;
}

export interface Achievement {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  title: LocalizedString;
  icon: string;
}

export interface ExportOptions {
  ritual: boolean;
  titles: boolean;
  relics: boolean;
  achievements: boolean;
  speedruns: boolean;
}

export interface Relic {
  id: string;
  name: LocalizedString;
  lore: LocalizedString;
  bonus: LocalizedString;
  icon: string; // Lucide icon name
  effect: RelicEffect;
}

export interface RelicEffect {
  type: 'score_boost' | 'extra_moves' | 'fail_protection' | 'combo_boost' | 'match4_boost' | 'timer_slow' | 'special_spawn' | 'clear_extra' | 'chain_reaction' | 'final_event' | 'combo_points_boost' | 'shop_discount';
  value: number;
}
