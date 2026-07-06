import { useState, useEffect, useCallback } from 'react';
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

const WORKOUTS_STORAGE_KEY = 'bolvan_workouts';

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

    const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    setWorkouts(data);
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
    const dateKey = date.toISOString().split('T')[0];
    const updated = { ...workouts, [dateKey]: exercises };
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
    setWorkouts(updated);
    return { data: null, error: null };
  };

  const deleteWorkoutForDate = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const updated = { ...workouts };
    delete updated[dateKey];
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
    setWorkouts(updated);
    return { error: null };
  };

  const hasWorkoutOnDate = (date: Date): boolean => {
    const key = date.toISOString().split('T')[0];
    return !!workouts[key] && workouts[key].length > 0;
  };

  return {
    workouts,
    loading,
    getWorkoutForDate,
    saveWorkout,
    deleteWorkoutForDate,
    hasWorkoutOnDate,
    refresh: fetchWorkouts
  };
};