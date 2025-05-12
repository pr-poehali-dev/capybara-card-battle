
// Типы стихий для карт
export type ElementType = 'water' | 'earth' | 'fire' | 'air';

// Тип карты
export interface CardType {
  id: string;
  name: string;
  element: ElementType;
  value: number; // Значение силы карты (1-10)
  description: string;
  imageUrl?: string;
}

// Тип игрока
export type PlayerType = 'player' | 'capibara';

// Тип для результата раунда
export type RoundResult = 'player' | 'capibara' | 'draw';

// Тип для анимации карты
export type CardAnimationType = 'idle' | 'hover' | 'selected' | 'played' | 'flipped';
