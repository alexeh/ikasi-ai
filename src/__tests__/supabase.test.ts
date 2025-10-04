import { supabase } from '@/lib/supabase';

describe('Supabase Client', () => {
  it('should be defined', () => {
    expect(supabase).toBeDefined();
  });

  it('should have auth property', () => {
    expect(supabase.auth).toBeDefined();
  });

  it('should have from method', () => {
    expect(typeof supabase.from).toBe('function');
  });
});
