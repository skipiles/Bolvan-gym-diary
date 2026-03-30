import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

type ExerciseSet = {
  reps: number;
  weight: number;
};

type ExerciseType = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
};

export const useWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Record<string, ExerciseType[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    if (!user) {
      setWorkouts({});
      setLoading(false);
      return;
    }

    console.log('🔄 fetchWorkouts: загрузка тренировок для пользователя:', user.id);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('date, exercises')
      .eq('user_id', user.id);

    if (!error && data) {
      const workoutsMap: Record<string, ExerciseType[]> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((workout: any) => {
        workoutsMap[workout.date] = workout.exercises || [];
      });
      setWorkouts(workoutsMap);
      console.log('✅ fetchWorkouts: загружено', Object.keys(workoutsMap).length, 'дней');
    } else if (error) {
      console.error('❌ fetchWorkouts ошибка:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const getWorkoutForDate = (date: Date): ExerciseType[] => {
    const key = date.toISOString().split('T')[0];
    return workouts[key] || [];
  };

  const saveWorkout = async (date: Date, exercises: ExerciseType[]) => {
    if (!user) {
      console.error('❌ Нет пользователя');
      return { error: new Error('Not authenticated') };
    }

    const dateKey = date.toISOString().split('T')[0];
    console.log('💾 saveWorkout:', { dateKey, exercisesCount: exercises.length, userId: user.id });

    const { error } = await supabase
      .from('workouts')
      .upsert({
        user_id: user.id,
        date: dateKey,
        exercises: exercises
      }, {
        onConflict: 'user_id,date'
      });

    if (error) {
      console.error('❌ Ошибка сохранения тренировки:', error);
      return { error };
    }

    console.log('✅ Тренировка сохранена успешно');
    await fetchWorkouts();
    return { data: null, error: null };
  };

  const hasWorkoutOnDate = (date: Date): boolean => {
    const key = date.toISOString().split('T')[0];
    const exercises = workouts[key];
    return !!exercises && exercises.length > 0;
  };

  return {
    workouts,
    loading,
    getWorkoutForDate,
    saveWorkout,
    hasWorkoutOnDate,
    refresh: fetchWorkouts
  };
};