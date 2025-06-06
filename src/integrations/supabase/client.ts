
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xhuazohviheoxibwkozf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodWF6b2h2aWhlb3hpYndrb3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Njc0MDMsImV4cCI6MjA2NDA0MzQwM30.6xj4N4Aed6agKEpUkjP6xDyQXNqxy4ws6iqrp8VbnHc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
