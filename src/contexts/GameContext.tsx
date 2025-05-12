
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CardType, ElementType, PlayerType } from '@/types/game';
import { generateDeck } from '@/utils/deckUtils';

// Определяем типы для контекста
interface GameState {
  playerDeck: CardType[];
  playerHand: CardType[];
  playerScore: number;
  capibaraDeck: CardType[];
  capibaraHand: CardType[];
  capibaraScore: number;
  currentTurn: PlayerType;
  gameStatus: 'waiting' | 'playing' | 'playerWon' | 'capibaraWon' | 'draw';
  selectedCard: CardType | null;
  playedCards: {player: CardType | null, capibara: CardType | null};
}

type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'DRAW_CARD', player: PlayerType }
  | { type: 'SELECT_CARD', card: CardType }
  | { type: 'PLAY_CARD' }
  | { type: 'CAPIBARA_PLAY_CARD' }
  | { type: 'EVALUATE_ROUND' }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET_GAME' };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  drawCard: (player: PlayerType) => void;
  selectCard: (card: CardType) => void;
  playCard: () => void;
  capibaraPlayCard: () => void;
  evaluateRound: () => void;
  startGame: () => void;
  resetGame: () => void;
}

// Создаем начальное состояние
const initialState: GameState = {
  playerDeck: [],
  playerHand: [],
  playerScore: 0,
  capibaraDeck: [],
  capibaraHand: [],
  capibaraScore: 0,
  currentTurn: 'player',
  gameStatus: 'waiting',
  selectedCard: null,
  playedCards: {player: null, capibara: null}
};

// Создаем контекст
const GameContext = createContext<GameContextType | undefined>(undefined);

// Редьюсер для управления состоянием игры
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const playerDeck = generateDeck();
      const capibaraDeck = generateDeck();
      
      return {
        ...state,
        playerDeck: playerDeck.slice(5),
        playerHand: playerDeck.slice(0, 5),
        capibaraDeck: capibaraDeck.slice(5),
        capibaraHand: capibaraDeck.slice(0, 5),
        gameStatus: 'playing',
        currentTurn: 'player',
      };
    }
    
    case 'DRAW_CARD': {
      if (action.player === 'player') {
        if (state.playerDeck.length === 0) return state;
        const newCard = state.playerDeck[0];
        return {
          ...state,
          playerDeck: state.playerDeck.slice(1),
          playerHand: [...state.playerHand, newCard]
        };
      } else {
        if (state.capibaraDeck.length === 0) return state;
        const newCard = state.capibaraDeck[0];
        return {
          ...state,
          capibaraDeck: state.capibaraDeck.slice(1),
          capibaraHand: [...state.capibaraHand, newCard]
        };
      }
    }
    
    case 'SELECT_CARD': {
      return {
        ...state,
        selectedCard: action.card
      };
    }
    
    case 'PLAY_CARD': {
      if (!state.selectedCard) return state;
      return {
        ...state,
        playerHand: state.playerHand.filter(card => card.id !== state.selectedCard?.id),
        playedCards: { ...state.playedCards, player: state.selectedCard },
        selectedCard: null,
      };
    }
    
    case 'CAPIBARA_PLAY_CARD': {
      if (state.capibaraHand.length === 0) return state;
      // Для простоты, капибара просто играет первую карту из руки
      const card = state.capibaraHand[0];
      return {
        ...state,
        capibaraHand: state.capibaraHand.slice(1),
        playedCards: { ...state.playedCards, capibara: card }
      };
    }
    
    case 'EVALUATE_ROUND': {
      const { player, capibara } = state.playedCards;
      if (!player || !capibara) return state;
      
      // Расчет победителя раунда на основе типа стихии
      let playerScoreIncrease = 0;
      let capibaraScoreIncrease = 0;
      
      // Упрощенная логика: вода побеждает огонь, огонь побеждает воздух, воздух побеждает землю, земля побеждает воду
      if (player.element === 'water' && capibara.element === 'fire' ||
          player.element === 'fire' && capibara.element === 'air' ||
          player.element === 'air' && capibara.element === 'earth' ||
          player.element === 'earth' && capibara.element === 'water') {
        playerScoreIncrease = 1;
      } else if (player.element === capibara.element) {
        // Ничья - сравниваем значения
        if (player.value > capibara.value) {
          playerScoreIncrease = 1;
        } else if (capibara.value > player.value) {
          capibaraScoreIncrease = 1;
        }
      } else {
        capibaraScoreIncrease = 1;
      }
      
      // Проверка на окончание игры
      const newPlayerScore = state.playerScore + playerScoreIncrease;
      const newCapibaraScore = state.capibaraScore + capibaraScoreIncrease;
      let gameStatus = state.gameStatus;
      
      if (newPlayerScore >= 10) {
        gameStatus = 'playerWon';
      } else if (newCapibaraScore >= 10) {
        gameStatus = 'capibaraWon';
      } else if (state.playerDeck.length === 0 && state.playerHand.length === 0 && 
                state.capibaraDeck.length === 0 && state.capibaraHand.length === 0) {
        gameStatus = 'draw';
      }
      
      return {
        ...state,
        playerScore: newPlayerScore,
        capibaraScore: newCapibaraScore,
        playedCards: { player: null, capibara: null },
        gameStatus,
        currentTurn: 'player' // Возвращаем ход игроку после оценки раунда
      };
    }
    
    case 'NEXT_TURN': {
      return {
        ...state,
        currentTurn: state.currentTurn === 'player' ? 'capibara' : 'player'
      };
    }
    
    case 'RESET_GAME': {
      return initialState;
    }
    
    default:
      return state;
  }
}

// Провайдер контекста
export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Вспомогательные функции для взаимодействия с игрой
  const drawCard = (player: PlayerType) => {
    dispatch({ type: 'DRAW_CARD', player });
  };
  
  const selectCard = (card: CardType) => {
    dispatch({ type: 'SELECT_CARD', card });
  };
  
  const playCard = () => {
    dispatch({ type: 'PLAY_CARD' });
    dispatch({ type: 'NEXT_TURN' });
  };
  
  const capibaraPlayCard = () => {
    dispatch({ type: 'CAPIBARA_PLAY_CARD' });
    dispatch({ type: 'NEXT_TURN' });
  };
  
  const evaluateRound = () => {
    dispatch({ type: 'EVALUATE_ROUND' });
  };
  
  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <GameContext.Provider 
      value={{ 
        state, 
        dispatch, 
        drawCard, 
        selectCard, 
        playCard, 
        capibaraPlayCard, 
        evaluateRound, 
        startGame,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Хук для использования контекста
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
