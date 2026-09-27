import { createClient } from "@/utils/supabase/server";

/** 目前登入者是否為調香師管理員（admin_users 表，見 db.sql） */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
