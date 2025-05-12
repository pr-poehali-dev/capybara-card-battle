
import React from 'react';
import { CardType } from '@/types/game';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayed?: boolean;
  onClick?: () => void;
}

const getElementIcon = (element: string) => {
  switch (element) {
    case 'water': return 'Droplet';
    case 'earth': return 'Mountain';
    case 'fire': return 'Flame';
    case 'air': return 'Wind';
    default: return 'CircleAlert';
  }
};

const Card: React.FC<CardProps> = ({ card, isSelected = false, isPlayed = false, onClick }) => {
  const { name, element, value, description } = card;

  return (
    <div 
      className={cn(
        "relative w-32 h-44 rounded-md p-2 cursor-pointer transition-all duration-300",
        `element-${element}`,
        isSelected && "ring-4 ring-white/50",
        isPlayed && "transform scale-110"
      )}
      onClick={onClick}
    >
      {/* Заголовок карты */}
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs font-bold">{value}</div>
        <Icon name={getElementIcon(element)} size={16} />
      </div>
      
      {/* Название карты */}
      <h3 className="text-sm font-bold mb-2 text-center">{name}</h3>
      
      {/* Иллюстрация элемента */}
      <div className="w-full h-16 bg-white/20 rounded-sm mb-2 flex items-center justify-center">
        <Icon 
          name={getElementIcon(element)} 
          size={36} 
          className="text-white/80 animate-pulse-glow"
        />
      </div>
      
      {/* Описание карты */}
      <p className="text-xs text-center line-clamp-2">{description}</p>
      
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/20"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-white/20"></div>
      </div>
    </div>
  );
};

export default Card;
