import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfeeulxbvcakgmnmoouu.supabase.co'
const supabaseAnonKey = 'sb_publishable_Il09eceJ_z22MZi1KR27bA_O8eTbiby'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)