import { useRef, useEffect } from 'react';

export const useInstantSound = (soundPath: string) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Создаем AudioContext только при монтировании
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Загружаем и декодируем аудиофайл
    fetch(soundPath)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContextRef.current!.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        audioBufferRef.current = audioBuffer;
      })
      .catch(error => console.error('Error loading sound:', error));

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [soundPath]);

  const play = () => {
    if (!audioBufferRef.current || !audioContextRef.current) {
      return;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  };

  return play;
};