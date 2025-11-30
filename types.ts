export interface Resource {
  name: string;
  amount: number;
}

export interface Generator {
  id: string;
  name: string; // Keeps default english name for internal logic if needed, but display will use translation
  description: string;
  baseCost: number;
  baseProduction: number; // Matter per second
  count: number;
  icon: string;
  color: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: string;
}

export interface GameState {
  matter: number;
  totalMatterGenerated: number;
  clickCount: number;
  startTime: number;
}

export type Language = 'en' | 'zh';
