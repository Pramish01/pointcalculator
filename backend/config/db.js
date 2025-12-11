import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const connectDB = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('Supabase Connected Successfully');
  } catch (error) {
    console.error(`Supabase Connection Error: ${error.message}`);
    console.log('Continuing without connection test...');
  }
};

export default connectDB;
