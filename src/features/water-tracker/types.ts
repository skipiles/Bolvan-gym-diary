export interface UserProfile {
  weight: number; // вес в кг
  dailyGoal: number; // суточная норма в мл
}

export interface WaterRecord {
  id: string;
  amount: number; // количество воды в мл
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface AppSettings {
  reminderInterval: number; // интервал в минутах
  soundEnabled: boolean;
}

export interface WaterState {
  profile: UserProfile | null;
  records: WaterRecord[];
  settings: AppSettings;
  isTimerActive:boolean;
  timeLeft: number;
  isReminderActive: boolean;
}