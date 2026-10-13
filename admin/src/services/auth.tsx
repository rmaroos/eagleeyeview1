import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSupabaseAuthConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'eev_admin_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();
  const isSupabaseAuthConnected = Boolean(supabase);

  useEffect(() => {
    // 1. Check local session cache
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {
      // ignore
    }

    // 2. Validate session with Supabase Auth
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Administrator',
            role: 'super_admin',
          };
          setUser(adminUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        } else {
          // If no active Supabase session, clear local storage
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Administrator',
            role: 'super_admin',
          };
          setUser(adminUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        } else {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setLoading(false);
    }
  }, [supabase]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    if (!supabase) {
      setLoading(false);
      return {
        success: false,
        error: 'Supabase client is not configured. Please check your environment variables.',
      };
    }

    try {
      // Authenticate STRICTLY via Supabase Auth:
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setLoading(false);
        return {
          success: false,
          error: error?.message || 'Invalid credentials. Only users registered in Supabase can sign in.',
        };
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0] || 'Administrator',
        role: 'super_admin',
      };

      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        error: err?.message || 'Authentication failed. Please verify your Supabase credentials.',
      };
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isSupabaseAuthConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
