export type ExerciseSet = {
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  notes?: string;
};

export type WorkoutSession = {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  photoUrl?: string;
  notes?: string;
  exercises: WorkoutExercise[];
  durationMinutes?: number;
  totalVolume?: number;
};

export type ActiveWorkout = {
  id: string;
  startTime: Date;
  exercises: WorkoutExercise[];
  date: Date;
};

// Черновик тренировки
export type WorkoutDraft = {
  id: string;
  user_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  photo_url: string | null;
  notes: string | null;
  exercises: WorkoutExercise[];
  created_at: string;
  updated_at: string;
};

// Тип для пропсов ActiveWorkout
export interface ActiveWorkoutProps {
  workout: {
    id: string;
    startTime: Date;
    exercises: WorkoutExercise[];
    date: Date;
  };
  onSave: (workout: WorkoutSession) => void | Promise<void>;
  onCancel: () => void;
  draftData?: WorkoutDraft | null;
}