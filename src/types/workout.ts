export type ExerciseSet = {
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
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