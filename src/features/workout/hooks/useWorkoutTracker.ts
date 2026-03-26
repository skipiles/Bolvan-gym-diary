import { useState, useEffect } from 'react';

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

type WorkoutData = {
  [date: string]: WorkoutExercise[];
};

const STORAGE_KEY = 'workoutData';

export const useWorkoutTracker = () => {
  const [workouts, setWorkouts] = useState<WorkoutData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  // Вспомогательная функция: дата → строка YYYY-MM-DD
  const dateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Получить тренировку на выбранную дату
  const getWorkoutForDate = (date: Date): WorkoutExercise[] => {
    const key = dateToKey(date);
    return workouts[key] || [];
  };

  // Добавить упражнение в тренировку на выбранную дату
  const addExerciseToWorkout = (date: Date, exercise: WorkoutExercise) => {
    const key = dateToKey(date);
    setWorkouts((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), exercise],
    }));
  };

  // Удалить упражнение из тренировки на выбранную дату
  const removeExerciseFromWorkout = (date: Date, exerciseId: string) => {
    const key = dateToKey(date);
    setWorkouts((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((ex) => ex.id !== exerciseId),
    }));
  };

  // Обновить упражнение целиком
  const updateExercise = (date: Date, exerciseId: string, updatedExercise: WorkoutExercise) => {
    const key = dateToKey(date);
    setWorkouts((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((ex) =>
        ex.id === exerciseId ? updatedExercise : ex
      ),
    }));
  };

  // Обновить подходы у упражнения
  const updateExerciseSets = (
    date: Date,
    exerciseId: string,
    sets: WorkoutSet[]
  ) => {
    const key = dateToKey(date);
    setWorkouts((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((ex) =>
        ex.id === exerciseId ? { ...ex, sets } : ex
      ),
    }));
  };

  // Проверить, есть ли тренировка на выбранную дату
  const hasWorkoutOnDate = (date: Date): boolean => {
    const key = dateToKey(date);
    return !!workouts[key] && workouts[key].length > 0;
  };

  return {
    workouts,
    selectedDate,
    setSelectedDate,
    getWorkoutForDate,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExercise,
    updateExerciseSets,
    hasWorkoutOnDate,
  };
};