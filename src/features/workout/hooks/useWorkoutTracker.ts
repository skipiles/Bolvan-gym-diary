import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkouts } from '@/hooks/useWorkouts';

export type WorkoutSet = {
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
  notes?: string;
};

export const useWorkoutTracker = () => {
  const { user } = useAuth();
  const { 
    getWorkoutForDate, 
    saveWorkout, 
    hasWorkoutOnDate, 
    loading,
    refresh 
  } = useWorkouts();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const addExerciseToWorkout = useCallback(async (date: Date, exercise: WorkoutExercise) => {
    if (!user) {
      console.error('❌ Нет пользователя');
      return;
    }
    console.log('➕ addExerciseToWorkout:', { date, exercise });
    
    const current = getWorkoutForDate(date);
    const updated = [...current, exercise];
    
    console.log('📝 Текущие упражнения:', current.length, '→ после добавления:', updated.length);
    
    await saveWorkout(date, updated);
    await refresh();
  }, [user, getWorkoutForDate, saveWorkout, refresh]);

  const removeExerciseFromWorkout = useCallback(async (date: Date, exerciseId: string) => {
    if (!user) return;
    const current = getWorkoutForDate(date);
    const updated = current.filter(ex => ex.id !== exerciseId);
    await saveWorkout(date, updated);
    await refresh();
  }, [user, getWorkoutForDate, saveWorkout, refresh]);

  const updateExercise = useCallback(async (date: Date, exerciseId: string, updatedExercise: WorkoutExercise) => {
    if (!user) return;
    const current = getWorkoutForDate(date);
    const updated = current.map(ex => ex.id === exerciseId ? updatedExercise : ex);
    await saveWorkout(date, updated);
    await refresh();
  }, [user, getWorkoutForDate, saveWorkout, refresh]);

  return {
    selectedDate,
    setSelectedDate,
    getWorkoutForDate,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExercise,
    hasWorkoutOnDate,
    loading
  };
};