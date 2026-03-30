import { supabase } from '@/lib/supabase';

type LocalWorkout = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: { reps: number; weight: number }[];
};

type LocalWaterLog = {
  total: number;
  entries: { amount: number; timestamp: string }[];
};

export const migrateLocalData = async (userId: string) => {
  // Миграция тренировок
  const localWorkouts = localStorage.getItem('workoutData');
  if (localWorkouts) {
    const workouts = JSON.parse(localWorkouts) as Record<string, LocalWorkout[]>;
    for (const [date, exercises] of Object.entries(workouts)) {
      await supabase.from('workouts').upsert({
        user_id: userId,
        date,
        exercises,
      });
    }
    localStorage.removeItem('workoutData');
  }

  // Миграция воды
  const localWater = localStorage.getItem('waterData');
  if (localWater) {
    const waterLogs = JSON.parse(localWater) as Record<string, LocalWaterLog>;
    for (const [date, log] of Object.entries(waterLogs)) {
      await supabase.from('water_logs').upsert({
        user_id: userId,
        date,
        total_amount: log.total || 0,
        entries: log.entries || [],
      });
    }
    localStorage.removeItem('waterData');
  }

  // Миграция настроек
  const localSettings = localStorage.getItem('waterRemindersEnabled');
  if (localSettings) {
    await supabase.from('user_settings').upsert({
      user_id: userId,
      notifications_enabled: JSON.parse(localSettings) as boolean,
    });
    localStorage.removeItem('waterRemindersEnabled');
  }
};