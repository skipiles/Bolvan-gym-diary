import type {  WaterRecord } from './types';

// Формула: 30 мл на 1 кг веса
export const calculateDailyGoal = (weight: number): number => {
  return Math.round(weight * 30);
};

export const getTodayRecords = (records: WaterRecord[]): WaterRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  return records.filter(record => record.date === today);
};

export const getTotalWaterToday = (records: WaterRecord[]): number => {
  const todayRecords = getTodayRecords(records);
  return todayRecords.reduce((total, record) => total + record.amount, 0);
};