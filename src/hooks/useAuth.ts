/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bolvan_user';

export type Profile = {
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

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setUser({ id: data.id, email: data.email });
      setProfile(data);
    }
    setLoading(false);
  }, []); // <--- ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ ОБЯЗАТЕЛЕН

   
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signIn = async (email: string, _password?: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.email === email) {
        setUser({ id: data.id, email: data.email });
        setProfile(data);
        return { data: { user: data }, error: null };
      }
    }

    const newUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      username: email.split('@')[0],
      full_name: email.split('@')[0],
      avatar_url: null,
      weight: null,
      height: null,
      daily_water_goal: 2000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser({ id: newUser.id, email: newUser.email });
    setProfile(newUser);
    return { data: { user: newUser }, error: null };
  };

  const signUp = async (email: string, _password: string, username: string, fullName?: string | null, weight?: number | null, height?: number | null, dailyWaterGoal?: number) => {
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      username: username || email.split('@')[0],
      full_name: fullName || null,
      avatar_url: null,
      weight: weight || null,
      height: height || null,
      daily_water_goal: dailyWaterGoal || (weight ? Math.round(weight * 30) : 2000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser({ id: newUser.id, email: newUser.email });
    setProfile(newUser);
    return { data: { user: newUser }, error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { error: new Error('No user') };

    const current = JSON.parse(saved);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfile(updated);
    return { data: updated, error: null };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};