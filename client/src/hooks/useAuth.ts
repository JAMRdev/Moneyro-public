
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { logActivity } from '@/lib/logger';

type Profile = {
  username: string | null;
  theme: string;
  role: 'admin' | 'member';
  avatar_url?: string;
};

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
          } else if (data) {
            const profileData = { ...data, avatar_url: currentUser.user_metadata.avatar_url };
            setProfile(profileData as Profile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (_event === 'SIGNED_IN' && !session?.user.user_metadata.is_reauthenticated) {
            logActivity({
              action: 'Inicio de Sesión',
              location: 'Auth',
            });
          }
          
          setSession(session);
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            if (error) {
              console.error("Error fetching profile on auth change:", error);
              setProfile(null);
            } else if (data) {
              const profileData = { ...data, avatar_url: currentUser.user_metadata.avatar_url };
              setProfile(profileData as Profile);
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, profile, loading, isAdmin: profile?.role === 'admin' };
};
