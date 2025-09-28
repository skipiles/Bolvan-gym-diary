import { useState, useEffect } from 'react';
import type {  WaterRecord, AppSettings, WaterState } from '../types';
import { calculateDailyGoal, getTodayRecords, getTotalWaterToday } from '../utils';

const STORAGE_KEY = 'water-tracker-data';

const defaultSettings: AppSettings = {
  reminderInterval: 60,
  soundEnabled: true,
};

const initialState: WaterState = {
  profile: null,
  records: [],
  settings: defaultSettings,
  isTimerActive: true,
  timeLeft: 60 * 60,
  isReminderActive: false,
};

export const useWaterTracker = () => {
  const [state, setState] = useState<WaterState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const timeLeft = typeof parsed.timeLeft === 'number' ? parsed.timeLeft : 60 * 60;
      return { ...initialState, ...parsed, timeLeft };
    }
    return initialState;
  });

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Таймер обратного отсчета
  useEffect(() => {
    if (!state.isTimerActive || state.isReminderActive) return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          return { 
            ...prev, 
            isReminderActive: true,
            isTimerActive: false
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isTimerActive, state.isReminderActive, state.timeLeft]);

  const setProfile = (weight: number) => {
    const dailyGoal = calculateDailyGoal(weight);
    setState(prev => ({
      ...prev,
      profile: { weight, dailyGoal },
    }));
  };

  const addWater = (amount: number) => {
    const newRecord: WaterRecord = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    setState(prev => ({
      ...prev,
      records: [...prev.records, newRecord],
      isReminderActive: false,
      isTimerActive: true,
      timeLeft: prev.settings.reminderInterval * 60,
    }));
  };

  // Функция сброса воды за сегодня
  const resetTodayWater = () => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      records: prev.records.filter(record => record.date !== today),
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
      timeLeft: newSettings.reminderInterval ? newSettings.reminderInterval * 60 : prev.timeLeft,
    }));
  };

  const stopReminder = () => {
    setState(prev => ({
      ...prev,
      isReminderActive: false,
      isTimerActive: false,
    }));
  };

  const startTimer = () => {
    setState(prev => ({
      ...prev,
      isTimerActive: true,
      timeLeft: prev.settings.reminderInterval * 60,
    }));
  };

  const todayRecords = getTodayRecords(state.records);
  const totalToday = getTotalWaterToday(state.records);
  const progress = state.profile ? (totalToday / state.profile.dailyGoal) * 100 : 0;

  return {
    ...state,
    todayRecords,
    totalToday,
    progress,
    setProfile,
    addWater,
    resetTodayWater, // Добавляем функцию сброса
    updateSettings,
    stopReminder,
    startTimer,
  };
};