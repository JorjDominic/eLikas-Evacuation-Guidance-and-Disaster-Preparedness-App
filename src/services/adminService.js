import { supabase } from '../config/supabase';

// ── Profiles / Users ────────────────────────────────────────────────────────
// Requires a `profiles` table synced from auth.users via a trigger, e.g.:
//   create table profiles (
//     id uuid references auth.users on delete cascade primary key,
//     name text, email text, role text default 'user',
//     is_active boolean default true,
//     created_at timestamptz default now(),
//     updated_at timestamptz default now()
//   );
//   create or replace function handle_new_user() returns trigger as $$
//   begin
//     insert into profiles(id, name, email, role)
//     values (new.id, new.raw_user_meta_data->>'name', new.email, coalesce(new.raw_user_meta_data->>'role','user'));
//     return new;
//   end; $$ language plpgsql security definer;
//   create trigger on_auth_user_created after insert on auth.users
//   for each row execute procedure handle_new_user();

export async function listProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, is_active, created_at')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateProfile(id, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function setUserActive(id, isActive) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Requires the `admin-invite-user` Supabase Edge Function deployed with
// a service-role key, which calls supabase.auth.admin.inviteUserByEmail().
// Deploy with: supabase functions deploy admin-invite-user
export async function inviteUser({ name, email, role }) {
  const { data, error } = await supabase.functions.invoke('admin-invite-user', {
    body: { name, email, role }
  });
  return { data, error };
}

// ── Audit Logs ──────────────────────────────────────────────────────────────
// Requires an `audit_logs` table:
//   create table audit_logs (
//     id uuid primary key default gen_random_uuid(),
//     actor_id uuid, actor_name text,
//     action text not null,
//     target_type text, target_id text,
//     meta jsonb default '{}',
//     created_at timestamptz default now()
//   );
//   alter table audit_logs enable row level security;
//   create policy "admins can read audit_logs"
//     on audit_logs for select using (
//       (select role from profiles where id = auth.uid()) = 'admin'
//     );
//   create policy "admins can insert audit_logs"
//     on audit_logs for insert with check (
//       (select role from profiles where id = auth.uid()) = 'admin'
//     );

export async function writeAuditLog({ actorId, actorName, action, targetType, targetId, meta }) {
  const { error } = await supabase.from('audit_logs').insert({
    actor_id: actorId,
    actor_name: actorName,
    action,
    target_type: targetType || null,
    target_id: targetId ? String(targetId) : null,
    meta: meta || {}
  });
  return { error };
}

export async function listAuditLogs({ limit = 50, offset = 0, action = '', search = '' } = {}) {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.eq('action', action);
  if (search) query = query.ilike('actor_name', `%${search}%`);

  const { data, error, count } = await query;
  return { data, error, count };
}
