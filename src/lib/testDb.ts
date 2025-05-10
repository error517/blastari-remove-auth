import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function testDatabaseConnection() {
  try {
    console.log('Testing connection to Supabase...');
    console.log('URL:', supabaseUrl);
    
    // First test the connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth error:', authError);
      return false;
    }
    console.log('Auth connection successful');

    // Test the connection by querying the website_analyses table
    const { data, error } = await supabase
      .from('website_analyses')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Database connection error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('Successfully connected to database');
    console.log('Current records in website_analyses:', data);
    return true;
  } catch (error) {
    console.error('Error testing database connection:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
} 