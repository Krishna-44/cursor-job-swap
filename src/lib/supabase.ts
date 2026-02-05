/**
 * Supabase Client Module
 * Provides database access with fallback to mock data
 */

// Note: Install @supabase/supabase-js if using real Supabase
// npm install @supabase/supabase-js

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let supabaseClient: any = null;

/**
 * Initialize Supabase client
 */
export function initSupabase(): any {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found, using mock mode');
    return null;
  }

  // Lazy load Supabase client
  if (!supabaseClient) {
    try {
      // Dynamic import to avoid errors if package not installed
      // In production, you would do: import { createClient } from '@supabase/supabase-js'
      // For now, return null to use mock mode
      console.info('Supabase package not installed. Install with: npm install @supabase/supabase-js');
      return null;
    } catch (error) {
      console.error('Error initializing Supabase:', error);
      return null;
    }
  }

  return supabaseClient;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseAnonKey);
}

/**
 * Database table interfaces
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company: string;
  job_title: string;
  skills: string[];
  home_location: { address: string; lat: number; lng: number };
  work_location: { address: string; lat: number; lng: number };
  resume_embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface ResumeDocument {
  id: string;
  user_id: string;
  text: string;
  embedding: number[];
  parsed_data: any;
  created_at: string;
}

/**
 * Mock database operations (fallback when Supabase not configured)
 */
export const mockDB = {
  async saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    console.log('Mock: Saving user profile', profile);
    return {
      id: profile.id || `user-${Date.now()}`,
      email: profile.email || '',
      name: profile.name || '',
      company: profile.company || '',
      job_title: profile.job_title || '',
      skills: profile.skills || [],
      home_location: profile.home_location || { address: '', lat: 0, lng: 0 },
      work_location: profile.work_location || { address: '', lat: 0, lng: 0 },
      resume_embedding: profile.resume_embedding,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async saveResume(resume: Partial<ResumeDocument>): Promise<ResumeDocument> {
    console.log('Mock: Saving resume', resume);
    return {
      id: resume.id || `resume-${Date.now()}`,
      user_id: resume.user_id || '',
      text: resume.text || '',
      embedding: resume.embedding || [],
      parsed_data: resume.parsed_data || {},
      created_at: new Date().toISOString(),
    };
  },

  async findSimilarProfiles(
    embedding: number[],
    limit: number = 10
  ): Promise<UserProfile[]> {
    console.log('Mock: Finding similar profiles');
    return [];
  },
};
