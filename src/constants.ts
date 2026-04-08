import { Droplet, Skull, Ghost, Diamond, Flame, Zap, Bomb, MoveRight, PlusCircle, Shuffle, Hammer, CupSoda, CircleDot, Shield, Book, Crown, Hourglass, Orbit, Sword, Lock, Heart, Users } from 'lucide-react';
import { PieceType, PowerUp, Level, Relic, Achievement } from './types';

export const GRID_SIZE = 8;
export const PIECE_TYPES: PieceType[] = ['blood', 'skull', 'bat', 'gem', 'candle', 'fang'];

export const PIECE_CONFIG = {
  blood: {
    color: '#ff0000',
    icon: Droplet,
    label: { en: 'Blood Drop', pt: 'Gota de Sangue' },
    glow: 'rgba(255, 0, 0, 0.5)',
  },
  skull: {
    color: '#00ff00',
    icon: Skull,
    label: { en: 'Skull', pt: 'Caveira' },
    glow: 'rgba(0, 255, 0, 0.4)',
  },
  bat: {
    color: '#9370db',
    icon: Ghost,
    label: { en: 'Purple Ghost', pt: 'Fantasma Roxo' },
    glow: 'rgba(147, 112, 219, 0.5)',
  },
  gem: {
    color: '#ff69b4',
    icon: Diamond,
    label: { en: 'Pink Square', pt: 'Quadrado Rosa' },
    glow: 'rgba(255, 105, 180, 0.5)',
  },
  candle: {
    color: '#ffd700',
    icon: Flame,
    label: { en: 'Yellow Flame', pt: 'Chama Amarela' },
    glow: 'rgba(255, 215, 0, 0.5)',
  },
  fang: {
    color: '#ffffff',
    icon: Zap,
    label: { en: 'White Lightning', pt: 'Raio Branco' },
    glow: 'rgba(255, 255, 255, 0.5)',
  },
};

export const LORE = {
  title: {
    en: "The Legend of Crimson Relics",
    pt: "A Lenda das Relíquias Carmesim"
  },
  content: {
    en: "Long ago, the ancient vampire lord Dracula was defeated and his power was sealed into 10 mystical relics. Each relic contains a fragment of his essence. As the player progresses, they recover these relics, slowly restoring Dracula’s power.\n\nWhen all 10 relics are collected, the final ritual can awaken Dracula!",
    pt: "Há muito tempo, o antigo lorde vampiro Drácula foi derrotado e seu poder foi selado em 10 relíquias místicas. Cada relíquia contém um fragmento de sua essência. Conforme o jogador progride, ele recupera essas relíquias, restaurando lentamente o poder de Drácula.\n\nQuando todas as 10 relíquias forem coletadas, o ritual final poderá despertar Drácula!"
  },
  continue: {
    en: "Continue Ritual",
    pt: "Continuar Ritual"
  }
};

export const RELICS: Relic[] = [
  {
    id: 'chalice',
    name: { en: 'Chalice of Eternal Blood', pt: 'Cálice de Sangue Eterno' },
    lore: { en: 'A golden cup that never empties, used in the first rituals.', pt: 'Uma taça de ouro que nunca esvazia, usada nos primeiros rituais.' },
    bonus: { en: '+10% Total Score', pt: '+10% de Pontuação Total' },
    icon: 'CupSoda',
    effect: { type: 'score_boost', value: 0.1 }
  },
  {
    id: 'ring',
    name: { en: 'Ring of the Dark Count', pt: 'Anel do Conde das Trevas' },
    lore: { en: 'A signet ring that grants authority over the night.', pt: 'Um anel de sinete que concede autoridade sobre a noite.' },
    bonus: { en: '+1 Move per Level', pt: '+1 Movimento por Nível' },
    icon: 'CircleDot',
    effect: { type: 'extra_moves', value: 1 }
  },
  {
    id: 'pendant',
    name: { en: 'Pendant of the Night Veil', pt: 'Pingente do Véu da Noite' },
    lore: { en: 'Hides the wearer from the eyes of destiny.', pt: 'Esconde o usuário dos olhos do destino.' },
    bonus: { en: '1.5x more combo points', pt: '1.5x mais pontos de combo' },
    icon: 'Shield',
    effect: { type: 'combo_points_boost', value: 0.5 }
  },
  {
    id: 'grimoire',
    name: { en: 'Forbidden Grimoire', pt: 'Grimório Proibido' },
    lore: { en: 'Contains spells that distort time and space.', pt: 'Contém feitiços que distorcem o tempo e o espaço.' },
    bonus: { en: 'Decreases shop item prices by 20%', pt: 'Diminui o valor dos itens na loja em 20%' },
    icon: 'Book',
    effect: { type: 'shop_discount', value: 0.2 }
  },
  {
    id: 'crown',
    name: { en: 'Crown of Eternal Dominion', pt: 'Coroa do Domínio Eterno' },
    lore: { en: 'The crown of the first vampire king.', pt: 'A coroa do primeiro rei vampiro.' },
    bonus: { en: '+15% Bonus score on Match 4+', pt: '+15% de Pontuação bônus em Match 4+' },
    icon: 'Crown',
    effect: { type: 'match4_boost', value: 0.15 }
  },
  {
    id: 'hourglass',
    name: { en: 'Hourglass of Immortality', pt: 'Ampulheta da Imortalidade' },
    lore: { en: 'The sand inside is ground bone of ancient saints.', pt: 'A areia interna é osso moído de santos antigos.' },
    bonus: { en: '+2 Extra Moves per Level', pt: '+2 Movimentos Extras por Nível' },
    icon: 'Hourglass',
    effect: { type: 'extra_moves', value: 2 }
  },
  {
    id: 'orb',
    name: { en: 'Crimson Orb', pt: 'Orbe Carmesim' },
    lore: { en: 'A pulsating eye that sees all possible futures.', pt: 'Um olho pulsante que vê todos os futuros possíveis.' },
    bonus: { en: '5% Chance to spawn special pieces randomly', pt: '5% de Chance de gerar peças especiais aleatoriamente' },
    icon: 'Orbit',
    effect: { type: 'special_spawn', value: 0.05 }
  },
  {
    id: 'dagger',
    name: { en: 'Ritual Dagger', pt: 'Adaga de Ritual' },
    lore: { en: 'A blade that thirsts for the essence of life.', pt: 'Uma lâmina que tem sede da essência da vida.' },
    bonus: { en: 'Matches clear extra tiles', pt: 'Combinações limpam blocos extras' },
    icon: 'Sword',
    effect: { type: 'clear_extra', value: 1 }
  },
  {
    id: 'seal',
    name: { en: 'Arcane Blood Seal', pt: 'Selo de Sangue Arcano' },
    lore: { en: 'A seal that binds the blood of the fallen.', pt: 'Um selo que vincula o sangue dos caídos.' },
    bonus: { en: '10% Chance to trigger additional chain reactions', pt: '10% de Chance de desencadear reações em cadeia adicionais' },
    icon: 'Lock',
    effect: { type: 'chain_reaction', value: 0.1 }
  },
  {
    id: 'heart',
    name: { en: 'Heart of Dark Crystal', pt: 'Coração de Cristal Negro' },
    lore: { en: 'The crystallized remains of Dracula’s original heart.', pt: 'Os restos cristalizados do coração original de Drácula.' },
    bonus: { en: 'Massive score boost (+25%)', pt: 'Aumento massivo de pontuação (+25%)' },
    icon: 'Heart',
    effect: { type: 'score_boost', value: 0.25 }
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'relic_chalice',
    name: { en: 'The First Sip', pt: 'O Primeiro Gole' },
    description: { en: 'Recover the Chalice of Eternal Blood', pt: 'Recupere o Cálice de Sangue Eterno' },
    title: { en: 'Blood Initiate', pt: 'Iniciado do Sangue' },
    icon: 'CupSoda'
  },
  {
    id: 'relic_ring',
    name: { en: 'Authority of the Night', pt: 'Autoridade da Noite' },
    description: { en: 'Recover the Ring of the Dark Count', pt: 'Recupere o Anel do Conde das Trevas' },
    title: { en: 'Dark Noble', pt: 'Nobre das Trevas' },
    icon: 'CircleDot'
  },
  {
    id: 'relic_pendant',
    name: { en: 'Veil of Shadows', pt: 'Véu das Sombras' },
    description: { en: 'Recover the Pendant of the Night Veil', pt: 'Recupere o Pingente do Véu da Noite' },
    title: { en: 'Shadow Walker', pt: 'Caminhante das Sombras' },
    icon: 'Shield'
  },
  {
    id: 'relic_grimoire',
    name: { en: 'Forbidden Knowledge', pt: 'Conhecimento Proibido' },
    description: { en: 'Recover the Forbidden Grimoire', pt: 'Recupere o Grimório Proibido' },
    title: { en: 'Arcane Scholar', pt: 'Erudito Arcano' },
    icon: 'Book'
  },
  {
    id: 'relic_crown',
    name: { en: 'Eternal Dominion', pt: 'Domínio Eterno' },
    description: { en: 'Recover the Crown of Eternal Dominion', pt: 'Recupere a Coroa do Domínio Eterno' },
    title: { en: 'Night Sovereign', pt: 'Soberano da Noite' },
    icon: 'Crown'
  },
  {
    id: 'relic_hourglass',
    name: { en: 'Master of Time', pt: 'Mestre do Tempo' },
    description: { en: 'Recover the Hourglass of Immortality', pt: 'Recupere a Ampulheta da Imortalidade' },
    title: { en: 'Eternal One', pt: 'O Eterno' },
    icon: 'Hourglass'
  },
  {
    id: 'relic_orb',
    name: { en: 'All-Seeing Eye', pt: 'Olho que Tudo Vê' },
    description: { en: 'Recover the Crimson Orb', pt: 'Recupere o Orbe Carmesim' },
    title: { en: 'Crimson Seer', pt: 'Vidente Carmesim' },
    icon: 'Orbit'
  },
  {
    id: 'relic_dagger',
    name: { en: 'Thirst for Essence', pt: 'Sede de Essência' },
    description: { en: 'Recover the Ritual Dagger', pt: 'Recupere a Adaga de Ritual' },
    title: { en: 'Blood Butcher', pt: 'Açougueiro de Sangue' },
    icon: 'Sword'
  },
  {
    id: 'relic_seal',
    name: { en: 'Bound in Blood', pt: 'Vinculado em Sangue' },
    description: { en: 'Recover the Arcane Blood Seal', pt: 'Recupere o Selo de Sangue Arcano' },
    title: { en: 'Soul Binder', pt: 'Vinculador de Almas' },
    icon: 'Lock'
  },
  {
    id: 'relic_heart',
    name: { en: 'Dracula’s Legacy', pt: 'Legado de Drácula' },
    description: { en: 'Recover the Heart of Dark Crystal', pt: 'Recupere o Coração de Cristal Negro' },
    title: { en: 'Vampire Lord', pt: 'Senhor Vampiro' },
    icon: 'Heart'
  },
  {
    id: 'score_10k',
    name: { en: 'Sanguine Novice', pt: 'Novato Sanguíneo' },
    description: { en: 'Reach 10,000 points in a single Ritual', pt: 'Alcance 10.000 pontos em um único Ritual' },
    title: { en: 'Acolyte', pt: 'Acólito' },
    icon: 'Droplet'
  },
  {
    id: 'score_50k',
    name: { en: 'High Priest of Blood', pt: 'Sumo Sacerdote do Sangue' },
    description: { en: 'Reach 50,000 points in a single Ritual', pt: 'Alcance 50.000 pontos em um único Ritual' },
    title: { en: 'Hierophant', pt: 'Hierofante' },
    icon: 'Flame'
  },
  {
    id: 'match_5',
    name: { en: 'Pentagram of Power', pt: 'Pentagrama de Poder' },
    description: { en: 'Make a match of 5 pieces', pt: 'Faça uma combinação de 5 peças' },
    title: { en: 'Star-Touched', pt: 'Tocado pelas Estrelas' },
    icon: 'Star'
  },
  {
    id: 'combo_x6',
    name: { en: 'Sanguine Symphony', pt: 'Sinfonia Sanguínea' },
    description: { en: 'Reach a Combo x6 (Maestro of Blood)', pt: 'Alcance um Combo x6 (Maestro do Sangue)' },
    title: { en: 'Maestro of Blood', pt: 'Maestro do Sangue' },
    icon: 'Trophy'
  },
  {
    id: 'score_100k',
    name: { en: 'Eternal Sovereign of Blood', pt: 'Soberano Eterno do Sangue' },
    description: { en: 'Reach 100,000 points in a single Ritual', pt: 'Alcance 100.000 pontos em um único Ritual' },
    title: { en: 'Blood God', pt: 'Deus do Sangue' },
    icon: 'Crown'
  },
  {
    id: 'score_150k',
    name: { en: 'Blood Eclipse', pt: 'Eclipse de Sangue' },
    description: { en: 'Reach 150,000 points in a single Ritual', pt: 'Alcance 150.000 pontos em um único Ritual' },
    title: { en: 'The Immortal', pt: 'O Imortal' },
    icon: 'Zap'
  }
];

export const POWER_UPS: PowerUp[] = [
  {
    type: 'bomb',
    name: { en: 'Blood Bomb', pt: 'Bomba de Sangue' },
    description: { en: 'Destroys surrounding pieces (3x3 area)', pt: 'Destrói peças ao redor (área 3x3)' },
    cost: 500,
    icon: Bomb,
  },
  {
    type: 'arrow',
    name: { en: 'Sanguine Arrows', pt: 'Flechas Sanguíneas' },
    description: { en: 'Destroys pieces in a cross pattern', pt: 'Destrói peças em padrão de cruz' },
    cost: 400,
    icon: MoveRight,
  },
  {
    type: 'steps',
    name: { en: 'Ritual Steps', pt: 'Passos Ritualísticos' },
    description: { en: 'Adds 5 extra moves', pt: 'Adiciona 5 movimentos extras' },
    cost: 300,
    icon: PlusCircle,
  },
  {
    type: 'chaos',
    name: { en: 'Chaotic Blood', pt: 'Sangue Caótico' },
    description: { en: 'Destroys 10 random pieces', pt: 'Destrói 10 peças aleatórias' },
    cost: 600,
    icon: Shuffle,
  },
  {
    type: 'hammer',
    name: { en: 'Bone Hammer', pt: 'Martelo de Osso' },
    description: { en: 'Destroys a single selected piece', pt: 'Destrói uma única peça selecionada' },
    cost: 200,
    icon: Hammer,
  },
  {
    type: 'soaked',
    name: { en: 'Bloodsoaked', pt: 'Encharcado de Sangue' },
    description: { en: 'Destroys all pieces on the board', pt: 'Destrói todas as peças no quadro atual' },
    cost: 1000,
    icon: Shuffle, // Or another icon
  },
  {
    type: 'stained',
    name: { en: 'Bloodstained', pt: 'Manchado de Sangue' },
    description: { en: 'Destroys all pieces of the same type', pt: 'Destrói todas as peças iguais à selecionada' },
    cost: 500,
    icon: CircleDot, // Or another icon
  },
  {
    type: 'bloody_twin',
    name: { en: 'Bloody Twin', pt: 'Gêmeo Sangrento' },
    description: { en: 'Select two pieces: transforms all of the second type into the first type', pt: 'Selecione duas peças: transforma todas do segundo tipo no primeiro tipo' },
    cost: 1000,
    icon: Users,
  },
];

export const LEVELS: Level[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  moves: Math.max(10, 30 - Math.floor(i / 5)),
  rewardXP: 0,
  rewardCoins: 500 + i * 100,
  goals: [
    { type: 'score', target: 2000 + i * 3000, current: 0 },
    { type: PIECE_TYPES[i % PIECE_TYPES.length], target: 15 + Math.floor(i / 2), current: 0 },
    ...(i > 5 ? [{ type: PIECE_TYPES[(i + 2) % PIECE_TYPES.length], target: 10 + Math.floor(i / 3), current: 0 }] : []),
  ],
}));

export const SCORE_BASE = 400;
export const SCORE_MATCH_4_MULT = 2.5;
export const SCORE_MATCH_5_MULT = 4;
export const SCORE_SHAPE_BONUS = 3.0; // +200% for L/T shapes

export const COMBO_MULTIPLIERS = [1, 3.5, 4.5, 5.5, 6.5, 7.5];
