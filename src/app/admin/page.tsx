import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getIsAdmin } from "@/lib/admin";
import {
  CONTENT_DEFAULTS,
  CONTENT_LABELS,
  getContents,
  type ContentKey,
} from "@/lib/content";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!(await getIsAdmin())) redirect("/");

  const keys = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
  const [content, customizedRows, hasPassword] = await Promise.all([
    getContents(keys),
    supabase.from("site_content").select("key, updated_at"),
    supabase.rpc("has_numerology_password"),
  ]);

  return (
    <AdminPanel
      content={content}
      defaults={CONTENT_DEFAULTS}
      labels={CONTENT_LABELS}
      updatedAt={Object.fromEntries(
        (customizedRows.data ?? []).map((r) => [r.key, r.updated_at]),
      )}
      hasPassword={hasPassword.data === true}
    />
  );
}
