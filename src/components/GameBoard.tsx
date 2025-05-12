import React, { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import Card from "@/components/Card";
import CapibaraOpponent from "@/components/CapibaraOpponent";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GameBoard: React.FC = () => {
  const {
    state,
    startGame,
    selectCard,
    playCard,
    capibaraPlayCard,
    evaluateRound,
    resetGame,
  } = useGame();

  const {
    playerHand,
    capibaraHand,
    playerScore,
    capibaraScore,
    gameStatus,
    currentTurn,
    selectedCard,
    playedCards,
  } = state;

  // Автоматический ход капибары
  useEffect(() => {
    if (gameStatus === "playing" && currentTurn === "capibara") {
      const timeoutId = setTimeout(() => {
        capibaraPlayCard();

        // После хода капибары проверяем результат раунда, если обе карты сыграны
        if (playedCards.player) {
          setTimeout(() => {
            evaluateRound();
          }, 1500);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    currentTurn,
    gameStatus,
    capibaraPlayCard,
    playedCards.player,
    evaluateRound,
  ]);

  // Проверка результата раунда, когда обе карты сыграны
  useEffect(() => {
    if (playedCards.player && playedCards.capibara) {
      const timeoutId = setTimeout(() => {
        evaluateRound();
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [playedCards, evaluateRound]);

  const handleCardClick = (card: any) => {
    if (currentTurn === "player" && gameStatus === "playing") {
      selectCard(card);
    }
  };

  const handlePlayCard = () => {
    if (selectedCard && currentTurn === "player") {
      playCard();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-2rem)] p-4">
      {/* Заголовок и очки */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Магическая Колода: Битва с Капибарой
        </h1>
        <div className="flex justify-center space-x-8">
          <div className="text-lg">
            <span className="font-semibold">Ваши очки:</span> {playerScore}
          </div>
          <div className="text-lg">
            <span className="font-semibold">Очки капибары:</span>{" "}
            {capibaraScore}
          </div>
        </div>
      </div>

      {/* Игровое поле */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Капибара и её рука */}
        <div className="flex flex-col items-center mb-4">
          <CapibaraOpponent
            isThinking={currentTurn === "capibara" && gameStatus === "playing"}
            expression={
              gameStatus === "capibaraWon"
                ? "happy"
                : gameStatus === "playerWon"
                  ? "sad"
                  : "neutral"
            }
          />

          <div className="flex justify-center mt-2">
            {capibaraHand.map((_, index) => (
              <div
                key={index}
                className="w-16 h-24 bg-secondary rounded-md shadow-md mx-1 transform rotate-180 border-2 border-amber-700"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="%23A67C52" stroke-width="2"/><text x="20" y="25" font-family="Arial" font-size="10" text-anchor="middle" fill="%23A67C52">К</text></svg>\')',
                }}
              />
            ))}
          </div>
        </div>

        {/* Зона игры карт */}
        <div className="flex justify-center items-center h-48 my-4">
          {gameStatus === "waiting" ? (
            <Button
              onClick={startGame}
              className="bg-secondary hover:bg-secondary/80 text-white px-8 py-6 text-xl"
            >
              Начать игру
            </Button>
          ) : gameStatus === "playing" ? (
            <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
              <div className="flex justify-center">
                {playedCards.player ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card card={playedCards.player} isPlayed={true} />
                  </motion.div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md w-32 h-44 flex items-center justify-center text-gray-400">
                    Ваша карта
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {playedCards.capibara ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card card={playedCards.capibara} isPlayed={true} />
                  </motion.div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md w-32 h-44 flex items-center justify-center text-gray-400">
                    Карта капибары
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {gameStatus === "playerWon"
                  ? "Поздравляем! Вы победили!"
                  : gameStatus === "capibaraWon"
                    ? "Капибара победила! Попробуйте еще раз."
                    : "Ничья! Равная борьба."}
              </h2>
              <Button
                onClick={resetGame}
                className="mt-4 bg-secondary hover:bg-secondary/80"
              >
                Сыграть еще раз
              </Button>
            </div>
          )}
        </div>

        {/* Рука игрока */}
        <div className="mt-4">
          <div className="flex justify-center mb-4">
            {playerHand.map((card) => (
              <div
                key={card.id}
                className={`mx-1 transform transition-transform duration-200 hover:-translate-y-2 ${selectedCard?.id === card.id ? "-translate-y-4" : ""}`}
                onClick={() => handleCardClick(card)}
              >
                <Card card={card} isSelected={selectedCard?.id === card.id} />
              </div>
            ))}
          </div>

          {gameStatus === "playing" &&
            selectedCard &&
            currentTurn === "player" && (
              <div className="flex justify-center">
                <Button
                  onClick={handlePlayCard}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Сыграть карту
                </Button>
              </div>
            )}

          {currentTurn === "capibara" && gameStatus === "playing" && (
            <div className="text-center text-lg font-medium text-secondary animate-pulse">
              Капибара думает...
            </div>
          )}
        </div>
      </div>

      {/* Статус игры */}
      <div className="text-center mt-4 text-sm text-gray-600">
        {gameStatus === "playing" && (
          <p>
            {currentTurn === "player"
              ? 'Ваш ход: выберите карту и нажмите "Сыграть карту"'
              : "Ход капибары: ждите, пока она сделает свой ход"}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
