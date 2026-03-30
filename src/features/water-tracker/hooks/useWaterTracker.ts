import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface WaterSettings {
  reminderInterval: number;
  soundEnabled: boolean;
}

export const useWaterTracker = () => {
  const { user, profile } = useAuth();
  const [totalToday, setTotalToday] = useState(0);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<WaterSettings>({
    reminderInterval: 30,
    soundEnabled: true,
  });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Загрузка данных воды
  const fetchWaterData = useCallback(async () => {
    if (!user) {
      setTotalToday(0);
      setProgress(0);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('water_logs')
      .select('total_amount')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (!error && data) {
      const total = data.total_amount || 0;
      const goal = profile?.daily_water_goal || 2000;
      setTotalToday(total);
      setProgress((total / goal) * 100);
    } else {
      setTotalToday(0);
      setProgress(0);
    }
    setLoading(false);
  }, [user, profile]);

  // Загрузка при монтировании и при изменении user/profile
  useEffect(() => {
    fetchWaterData();
  }, [fetchWaterData]);

  // Добавление воды
  const addWater = useCallback(async (amount: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const newTotal = totalToday + amount;

    const { error } = await supabase
      .from('water_logs')
      .upsert({
        user_id: user.id,
        date: today,
        total_amount: newTotal,
      }, {
        onConflict: 'user_id,date'
      });

    if (!error) {
      setTotalToday(newTotal);
      const goal = profile?.daily_water_goal || 2000;
      setProgress((newTotal / goal) * 100);
    }
  }, [user, totalToday, profile]);

  // Сброс воды
  const resetTodayWater = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('water_logs')
      .delete()
      .eq('user_id', user.id)
      .eq('date', today);

    if (!error) {
      setTotalToday(0);
      setProgress(0);
    }
  }, [user]);

  // Загрузка настроек
  useEffect(() => {
    const savedSettings = localStorage.getItem('waterSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
      setTimeLeft(parsed.reminderInterval * 60);
    }
  }, []);

  // Сохранение настроек
  useEffect(() => {
    localStorage.setItem('waterSettings', JSON.stringify(settings));
  }, [settings]);

  // Таймер
  useEffect(() => {
    if (!isTimerActive) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsReminderActive(true);
          setIsTimerActive(false);
          
          if (settings.soundEnabled) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            } else {
              const audio = new Audio(import.meta.env.BASE_URL + 'sounds/gta5menu.mp3');
              audioRef.current = audio;
              audio.play().catch(() => {});
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
  }, [isTimerActive, settings.soundEnabled]);

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

  return {
    profile,
    totalToday,
    progress,
    settings,
    isTimerActive,
    timeLeft,
    isReminderActive,
    loading,
    addWater,
    resetTodayWater,
    updateSettings,
    stopReminder,
    startTimer,
  };
};