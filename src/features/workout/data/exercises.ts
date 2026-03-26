export const muscleGroups = {
  chest: 'Грудные',
  back: 'Спина',
  shoulders: 'Плечи',
  legs: 'Ноги',
  arms: 'Руки',
  core: 'Кор',
  abs: 'Пресс',
} as const;

export type MuscleGroup = keyof typeof muscleGroups;

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  isBodyweight?: boolean; // для упражнений с собственным весом
};

export const exercises: Exercise[] = [
  // Грудные
  { id: 'bench-press', name: 'Жим лёжа', muscleGroup: 'chest' },
  { id: 'incline-bench', name: 'Жим на наклонной', muscleGroup: 'chest' },
  { id: 'decline-bench', name: 'Жим с наклоном вниз', muscleGroup: 'chest' },
  { id: 'dumbbell-fly', name: 'Разводка гантелей', muscleGroup: 'chest' },
  { id: 'dips', name: 'Брусья', muscleGroup: 'chest', isBodyweight: true },
  { id: 'ring-dips', name: 'Брусья на кольцах', muscleGroup: 'chest', isBodyweight: true },
  
  // Спина
  { id: 'pull-ups', name: 'Подтягивания', muscleGroup: 'back', isBodyweight: true },
  { id: 'ring-pull-ups', name: 'Подтягивания на кольцах', muscleGroup: 'back', isBodyweight: true },
  { id: 'bent-over-row', name: 'Тяга штанги в наклоне', muscleGroup: 'back' },
  { id: 'lat-pulldown', name: 'Тяга верхнего блока', muscleGroup: 'back' },
  { id: 'seated-cable-row', name: 'Тяга блока сидя', muscleGroup: 'back' },
  
  // Плечи
  { id: 'shoulder-press', name: 'Жим гантелей сидя', muscleGroup: 'shoulders' },
  { id: 'lateral-raises', name: 'Махи гантелями в стороны', muscleGroup: 'shoulders' },
  { id: 'front-raises', name: 'Подъём гантелей перед собой', muscleGroup: 'shoulders' },
  { id: 'reverse-fly', name: 'Обратное разведение рук', muscleGroup: 'shoulders' },
  { id: 'reverse-fly-machine', name: 'Обратное разведение в тренажёре', muscleGroup: 'shoulders' },
  
  // Ноги
  { id: 'squat', name: 'Приседания со штангой', muscleGroup: 'legs' },
  { id: 'deadlift', name: 'Становая тяга', muscleGroup: 'legs' },
  { id: 'leg-press', name: 'Жим ногами', muscleGroup: 'legs' },
  { id: 'lunges', name: 'Выпады', muscleGroup: 'legs' },
  { id: 'leg-curl', name: 'Сгибание ног в тренажёре', muscleGroup: 'legs' },
  { id: 'leg-extension', name: 'Разгибание ног в тренажёре', muscleGroup: 'legs' },
  { id: 'hip-adduction', name: 'Сведение бедра', muscleGroup: 'legs' },
  { id: 'hip-abduction', name: 'Разведение бедра', muscleGroup: 'legs' },
  { id: 'lying-leg-curl', name: 'Сгибание ног лёжа (лежа на животе)', muscleGroup: 'legs' },
  
  // Руки
  { id: 'bicep-curl', name: 'Сгибание рук с гантелями', muscleGroup: 'arms' },
  { id: 'tricep-extension', name: 'Разгибание рук на блоке', muscleGroup: 'arms' },
  { id: 'hammer-curl', name: 'Молотковые сгибания', muscleGroup: 'arms' },
  { id: 'skull-crusher', name: 'Французский жим', muscleGroup: 'arms' },
  
  // Кор
  { id: 'plank', name: 'Планка', muscleGroup: 'core', isBodyweight: true },
  { id: 'russian-twist', name: 'Русский твист', muscleGroup: 'core', isBodyweight: true },
  
  // Пресс
  { id: 'leg-raises', name: 'Подъём ног в висе', muscleGroup: 'abs', isBodyweight: true },
  { id: 'hanging-leg-raises', name: 'Подъём ног на турнике', muscleGroup: 'abs', isBodyweight: true },
  { id: 'crunches', name: 'Скручивания', muscleGroup: 'abs', isBodyweight: true },
  { id: 'machine-crunch', name: 'Пресс на тренажёре (прямой)', muscleGroup: 'abs' },
  { id: 'machine-oblique-crunch', name: 'Пресс на тренажёре (боковые)', muscleGroup: 'abs' },
  { id: 'russian-twist-weight', name: 'Русский твист с весом', muscleGroup: 'abs' },
];