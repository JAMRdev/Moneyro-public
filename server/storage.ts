// Simple storage interface - not used with Supabase client-side implementation
export interface IStorage {
  // This storage interface is maintained for compatibility but not used
  // All data operations are handled by Supabase client-side
}

// Minimal storage implementation for server compatibility
export class MinimalStorage implements IStorage {
  // All operations are handled by Supabase client
}

export const storage = new MinimalStorage();