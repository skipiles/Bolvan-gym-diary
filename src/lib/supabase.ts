import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для наших таблиц
export type Profile = {
  daily_goal: number;
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  weight: number | null;
  height: number | null;
  daily_water_goal: number;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  date: string;
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: string;
    sets: Array<{ reps: number; weight: number }>;
  }>;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WaterLogEntry = {
  amount: number;
  timestamp: string;
};

export type WaterLog = {
  id: string;
  user_id: string;
  date: string;
  total_amount: number;
  entries: WaterLogEntry[];
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  user_id: string;
  reminder_interval: number;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
};