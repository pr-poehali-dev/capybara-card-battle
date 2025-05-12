
import { CardType, ElementType } from "@/types/game";

// Набор имен для карт разных элементов
const cardNames = {
  water: ['Водяной Туз', 'Дождевой Поток', 'Морская Волна', 'Речной Шторм', 'Ледяной Щит', 
          'Туманное Облако', 'Водоворот', 'Волшебный Фонтан', 'Снежный Ураган', 'Акватическая Стрела'],
  earth: ['Каменный Столб', 'Песчаный Шторм', 'Корневая Ловушка', 'Горный Обвал', 'Землетрясение', 
          'Плодородная Почва', 'Кристальная Броня', 'Изумрудный Щит', 'Янтарная Аура', 'Магнитный Камень'],
  fire: ['Огненный Шар', 'Лавовый Поток', 'Вулканическое Извержение', 'Пепельная Буря', 'Солнечная Вспышка', 
         'Пламенный Меч', 'Адское Пламя', 'Метеоритный Дождь', 'Искра Феникса', 'Звездная Вспышка'],
  air: ['Ветряной Вихрь', 'Грозовая Туча', 'Торнадо', 'Молниеносный Удар', 'Ураганный Порыв', 
        'Воздушный Щит', 'Громовая Волна', 'Электрический Разряд', 'Туманная Завеса', 'Небесный Клинок']
};

// Описания для карт
const cardDescriptions = {
  water: ['Омывает врагов волной силы', 'Атака холодной стихией', 'Замораживает противников', 
          'Смывает все преграды', 'Создает защитный барьер из льда'],
  earth: ['Призывает силу камней', 'Сокрушает врагов своей мощью', 'Защищает крепостью гор', 
          'Дарует силу земли', 'Возводит непробиваемую стену'],
  fire: ['Сжигает все на своем пути', 'Воспламеняет ярость внутри', 'Превращает врагов в пепел', 
         'Проникает сквозь любую броню', 'Дарует неистовую мощь'],
  air: ['Рассеивает облака сомнений', 'Ускоряет время атаки', 'Вызывает молнии с небес', 
        'Создает непроницаемый туман', 'Поднимает ввысь над полем боя']
};

// Генерация уникального ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Создание карты
export const createCard = (element: ElementType, value: number): CardType => {
  const elementNames = cardNames[element];
  const elementDescriptions = cardDescriptions[element];
  
  // Выбираем имя и описание в зависимости от значения карты
  const nameIndex = (value - 1) % elementNames.length;
  const descIndex = Math.floor(Math.random() * elementDescriptions.length);
  
  return {
    id: generateId(),
    name: elementNames[nameIndex],
    element,
    value,
    description: elementDescriptions[descIndex]
  };
};

// Генерация полной колоды карт
export const generateDeck = (): CardType[] => {
  const deck: CardType[] = [];
  const elements: ElementType[] = ['water', 'earth', 'fire', 'air'];
  
  // Для каждой стихии создаем карты со значениями от 1 до 10
  elements.forEach(element => {
    for (let value = 1; value <= 10; value++) {
      deck.push(createCard(element, value));
    }
  });
  
  // Перемешиваем колоду
  return shuffleDeck(deck);
};

// Перемешивание колоды (алгоритм Фишера-Йейтса)
export const shuffleDeck = (deck: CardType[]): CardType[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// Определение победителя в противостоянии двух карт
export const determineWinner = (playerCard: CardType, capibaraCard: CardType): 'player' | 'capibara' | 'draw' => {
  // Логика противостояния стихий:
  // Вода побеждает Огонь
  // Огонь побеждает Воздух
  // Воздух побеждает Землю
  // Земля побеждает Воду
  
  if (playerCard.element === capibaraCard.element) {
    // Если стихии одинаковые, то сравниваем по значению
    if (playerCard.value > capibaraCard.value) return 'player';
    if (playerCard.value < capibaraCard.value) return 'capibara';
    return 'draw';
  }
  
  if (
    (playerCard.element === 'water' && capibaraCard.element === 'fire') ||
    (playerCard.element === 'fire' && capibaraCard.element === 'air') ||
    (playerCard.element === 'air' && capibaraCard.element === 'earth') ||
    (playerCard.element === 'earth' && capibaraCard.element === 'water')
  ) {
    return 'player';
  }
  
  return 'capibara';
};
