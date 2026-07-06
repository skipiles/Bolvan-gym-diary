import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWater } from '@/hooks/useWater';

interface WaterSettings {
  reminderInterval: number;
  soundEnabled: boolean;
}

const SETTINGS_STORAGE_KEY = 'bolvan_water_settings';
const TIMER_STORAGE_KEY = 'bolvan_water_timer';

export const useWaterTracker = () => {
  const { profile } = useAuth();
  const { getWaterForDate, addWater, resetWaterForDate, getProgress, refresh } = useWater();
  
  const [settings, setSettings] = useState<WaterSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { reminderInterval: 30, soundEnabled: true };
  });
  
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => settings.reminderInterval * 60);
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [totalToday, setTotalToday] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Функция обновления статистики (без вызова refresh)
  const updateStats = useCallback(() => {
    const today = new Date();
    const newTotal = getWaterForDate(today).total;
    const newProgress = getProgress(today);
    setTotalToday(newTotal);
    setProgress(newProgress);
  }, [getWaterForDate, getProgress]);

  // Инициализация (только один раз)
  useEffect(() => {
    if (isInitialized) return;
    
    // Восстановление таймера
    const savedTimer = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedTimer) {
      const timerState = JSON.parse(savedTimer);
      const timePassed = Math.floor((Date.now() - timerState.lastUpdated) / 1000);
      const remainingTime = Math.max(0, timerState.timeLeft - timePassed);
      setTimeLeft(remainingTime);
      
      if (remainingTime <= 0 && timerState.isTimerActive) {
        setIsReminderActive(true);
        setIsTimerActive(false);
      } else if (remainingTime > 0 && timerState.isTimerActive) {
        setIsTimerActive(true);
      }
    }
    
    updateStats();
    setIsInitialized(true);
  }, [isInitialized, updateStats]);

  // Сохранение настроек
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isInitialized]);

  // Сохранение состояния таймера
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({
      isTimerActive,
      timeLeft,
      interval: settings.reminderInterval,
      lastUpdated: Date.now()
    }));
  }, [isTimerActive, timeLeft, settings.reminderInterval, isInitialized]);

  // Основной таймер
  useEffect(() => {
    if (!isTimerActive || !isInitialized) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsReminderActive(true);
          setIsTimerActive(false);
          
          if (settings.soundEnabled) {
            try {
              const audio = new Audio(import.meta.env.BASE_URL + 'sounds/gta5menu.mp3');
              audio.play().catch(() => {});
            } catch (e) {
              console.warn('Sound error:', e);
            }
          }
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Пора пить воду!', {
              body: 'Выпейте стакан воды для поддержания водного баланса',
              icon: '/vite.svg'
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, settings.soundEnabled, isInitialized]);

  const startTimer = useCallback(() => {
    if (isReminderActive) return;
    setTimeLeft(settings.reminderInterval * 60);
    setIsTimerActive(true);
    setIsReminderActive(false);
  }, [settings.reminderInterval, isReminderActive]);

  const stopReminder = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsReminderActive(false);
    setIsTimerActive(false);
    setTimeLeft(0);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<WaterSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.reminderInterval !== undefined) {
      const newInterval = newSettings.reminderInterval;
      if (isTimerActive) {
        setTimeLeft(newInterval * 60);
      } else if (!isTimerActive && !isReminderActive) {
        setTimeLeft(newInterval * 60);
      }
    }
  }, [isTimerActive, isReminderActive]);

  const addWaterEntry = useCallback(async (amount: number) => {
    await addWater(new Date(), amount);
    await refresh();
    updateStats();
  }, [addWater, refresh, updateStats]);

  const resetTodayWater = useCallback(async () => {
    await resetWaterForDate(new Date());
    await refresh();
    updateStats();
  }, [resetWaterForDate, refresh, updateStats]);

  return {
    profile,
    totalToday,
    progress,
    settings,
    isTimerActive,
    timeLeft,
    isReminderActive,
    addWater: addWaterEntry,
    resetTodayWater,
    updateSettings,
    stopReminder,
    startTimer,
  };
};