import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

type WaterLogEntry = {
  amount: number;
  timestamp: string;
};

const WATER_STORAGE_KEY = 'bolvan_water_logs';

export const useWater = () => {
  const { user, profile } = useAuth();
  const [waterLogs, setWaterLogs] = useState<Record<string, { total_amount: number; entries: WaterLogEntry[] }>>({});
  const [loading, setLoading] = useState(true);

  const fetchWaterLogs = useCallback(async () => {
    if (!user) {
      setWaterLogs({});
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(WATER_STORAGE_KEY);
    const logs = stored ? JSON.parse(stored) : {};
    setWaterLogs(logs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWaterLogs();
  }, [fetchWaterLogs]);

  const getWaterForDate = (date: Date): { total: number; entries: WaterLogEntry[] } => {
    const key = date.toISOString().split('T')[0];
    const log = waterLogs[key];
    return {
      total: log?.total_amount || 0,
      entries: log?.entries || []
    };
  };

  const addWater = async (date: Date, amount: number) => {
    const dateKey = date.toISOString().split('T')[0];
    const current = getWaterForDate(date);
    const newTotal = current.total + amount;
    const newEntries = [...current.entries, { amount, timestamp: new Date().toISOString() }];

    const updated = {
      ...waterLogs,
      [dateKey]: { total_amount: newTotal, entries: newEntries }
    };

    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(updated));
    setWaterLogs(updated);
    return { data: null, error: null };
  };

  const resetWaterForDate = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const updated = { ...waterLogs };
    delete updated[dateKey];
    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(updated));
    setWaterLogs(updated);
    return { error: null };
  };

  const getProgress = (date: Date): number => {
    const { total } = getWaterForDate(date);
    const goal = profile?.daily_water_goal || 2000;
    return (total / goal) * 100;
  };

  return {
    waterLogs,
    loading,
    getWaterForDate,
    addWater,
    resetWaterForDate,
    getProgress,
    refresh: fetchWaterLogs
  };
};