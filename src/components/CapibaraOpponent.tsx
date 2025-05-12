
import React from 'react';
import { motion } from 'framer-motion';

interface CapibaraOpponentProps {
  isThinking?: boolean;
  expression?: 'happy' | 'sad' | 'neutral' | 'thinking';
}

const CapibaraOpponent: React.FC<CapibaraOpponentProps> = ({ 
  isThinking = false,
  expression = 'neutral'
}) => {
  return (
    <div className="relative">
      {/* Мыслительный пузырь, когда капибара думает */}
      {isThinking && (
        <motion.div 
          className="absolute -top-14 -right-6 bg-white p-2 rounded-lg shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-secondary text-sm font-medium mb-1">Хммм...</div>
          <div className="absolute bottom-0 right-8 w-4 h-4 bg-white transform rotate-45 translate-y-1/2"></div>
        </motion.div>
      )}
      
      {/* Контейнер капибары с эмоциями */}
      <div className="relative w-40 h-40 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden">
        {/* Изображение капибары */}
        <img 
          src="https://cdn.poehali.dev/files/9368ccab-a325-402b-8b3a-8fb05bec6789.jpg" 
          alt="Капибара" 
          className="w-36 h-36 object-cover rounded-full border-4 border-secondary"
        />
        
        {/* Эмоции поверх изображения */}
        {expression === 'happy' && (
          <motion.div 
            className="absolute bottom-8 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/70 px-2 py-1 rounded-full text-xl">
              😊
            </div>
          </motion.div>
        )}
        
        {expression === 'sad' && (
          <motion.div 
            className="absolute bottom-8 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/70 px-2 py-1 rounded-full text-xl">
              😢
            </div>
          </motion.div>
        )}
        
        {isThinking && (
          <motion.div 
            className="absolute top-6 right-6"
            animate={{ 
              rotate: [0, 15, 0, -15, 0],
              y: [0, -2, 0, 2, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className="bg-white/70 px-2 py-1 rounded-full text-lg">
              🤔
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Имя противника */}
      <div className="text-center mt-2 font-medium">
        Капибара-Маг
      </div>
    </div>
  );
};

export default CapibaraOpponent;
