import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { WorkoutExercise, WorkoutDraft } from '@/types/workout';

// Ключи для localStorage
const DRAFT_STORAGE_KEY = 'bolvan_workout_drafts';

export const useWorkoutDraft = () => {
  const { user } = useAuth();
  const [draft, setDraft] = useState<WorkoutDraft | null>(null);
  const [loading, setLoading] = useState(false);

  // Загрузить черновик за указанную дату
  const loadDraft = useCallback(async (date: Date): Promise<WorkoutDraft | null> => {
    if (!user) return null;

    const dateKey = date.toISOString().split('T')[0];
    
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      const allDrafts = stored ? JSON.parse(stored) : {};
      
      const draftData = allDrafts[dateKey] || null;
      
      if (draftData) {
        const formattedDraft: WorkoutDraft = {
          id: `draft-${dateKey}`,
          user_id: user.id,
          date: dateKey,
          start_time: draftData.start_time || null,
          end_time: draftData.end_time || null,
          photo_url: draftData.photo_url || null,
          notes: draftData.notes || null,
          exercises: draftData.exercises || [],
          created_at: draftData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setDraft(formattedDraft);
        return formattedDraft;
      }
      
      setDraft(null);
      return null;
    } catch (error) {
      console.error('Ошибка загрузки черновика:', error);
      return null;
    }
  }, [user]);

  // Сохранить черновик
  const saveDraft = useCallback(async (
    date: Date,
    exercises: WorkoutExercise[],
    startTime?: string,
    endTime?: string,
    notes?: string,
    photoUrl?: string
  ): Promise<WorkoutDraft | null> => {
    if (!user) return null;

    const dateKey = date.toISOString().split('T')[0];
    setLoading(true);

    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      const allDrafts = stored ? JSON.parse(stored) : {};
      
      const draftData = {
        start_time: startTime || null,
        end_time: endTime || null,
        notes: notes || null,
        photo_url: photoUrl || null,
        exercises: exercises,
        created_at: allDrafts[dateKey]?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      allDrafts[dateKey] = draftData;
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(allDrafts));
      
      const formattedDraft: WorkoutDraft = {
        id: `draft-${dateKey}`,
        user_id: user.id,
        date: dateKey,
        start_time: draftData.start_time,
        end_time: draftData.end_time,
        photo_url: draftData.photo_url,
        notes: draftData.notes,
        exercises: draftData.exercises,
        created_at: draftData.created_at,
        updated_at: draftData.updated_at,
      };
      
      setDraft(formattedDraft);
      setLoading(false);
      return formattedDraft;
    } catch (error) {
      console.error('Ошибка сохранения черновика:', error);
      setLoading(false);
      return null;
    }
  }, [user]);

  // Удалить черновик
  const deleteDraft = useCallback(async (date: Date) => {
    if (!user) return;

    const dateKey = date.toISOString().split('T')[0];
    
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      const allDrafts = stored ? JSON.parse(stored) : {};
      
      delete allDrafts[dateKey];
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(allDrafts));
      setDraft(null);
    } catch (error) {
      console.error('Ошибка удаления черновика:', error);
    }
  }, [user]);

  // Автосохранение (каждые 30 секунд)
  const autoSave = useCallback((
    date: Date,
    exercises: WorkoutExercise[],
    startTime?: string,
    endTime?: string,
    notes?: string,
    photoUrl?: string
  ) => {
    const timer = setInterval(async () => {
      await saveDraft(date, exercises, startTime, endTime, notes, photoUrl);
      console.log('💾 Автосохранение черновика...');
    }, 30000);

    return () => clearInterval(timer);
  }, [saveDraft]);

  return {
    draft,
    loading,
    loadDraft,
    saveDraft,
    deleteDraft,
    autoSave
  };
};