import { useRef } from 'react';

export const useSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    // Создаем аудио элемент только при первом использовании
    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.3; // Устанавливаем комфортную громкость
    }

    try {
      // Сбрасываем на начало и воспроизводим
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log('Не удалось воспроизвести звук:', error);
      });
    } catch (error) {
      console.log('Ошибка воспроизведения звука:', error);
    }
  };

  return play;
};