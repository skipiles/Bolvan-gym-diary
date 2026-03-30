import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

type WaterLogEntry = {
  amount: number;
  timestamp: string;
};

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

    const { data, error } = await supabase
      .from('water_logs')
      .select('date, total_amount, entries')
      .eq('user_id', user.id);

    if (!error && data) {
      const logsMap: Record<string, { total_amount: number; entries: WaterLogEntry[] }> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((log: any) => {
        logsMap[log.date] = {
          total_amount: log.total_amount,
          entries: log.entries || []
        };
      });
      setWaterLogs(logsMap);
    }
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
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const dateKey = date.toISOString().split('T')[0];
    
    // Получаем текущие данные напрямую из Supabase
    const { data: existingData } = await supabase
      .from('water_logs')
      .select('total_amount, entries')
      .eq('user_id', user.id)
      .eq('date', dateKey)
      .single();

    const currentTotal = existingData?.total_amount || 0;
    const currentEntries = existingData?.entries || [];
    const newTotal = currentTotal + amount;
    const newEntries = [...currentEntries, { amount, timestamp: new Date().toISOString() }];

    const { error: updateError } = await supabase
      .from('water_logs')
      .update({
        total_amount: newTotal,
        entries: newEntries
      })
      .eq('user_id', user.id)
      .eq('date', dateKey);

    if (updateError && updateError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('water_logs')
        .insert({
          user_id: user.id,
          date: dateKey,
          total_amount: newTotal,
          entries: newEntries
        });
      
      if (insertError) {
        return { error: insertError };
      }
    } else if (updateError) {
      return { error: updateError };
    }

    // Обновляем локальное состояние
    await fetchWaterLogs();
    return { data: null, error: null };
  };

  const resetWaterForDate = async (date: Date) => {
    if (!user) return { error: new Error('Not authenticated') };

    const dateKey = date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('water_logs')
      .delete()
      .eq('user_id', user.id)
      .eq('date', dateKey);

    if (!error) {
      await fetchWaterLogs();
    }

    return { error };
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