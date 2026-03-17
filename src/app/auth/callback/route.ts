import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // If user has no nickname in metadata, seed it from their email
      const meta = data.user.user_metadata ?? {};
      if (!meta.nickname) {
        const emailPrefix = (data.user.email ?? "").split("@")[0];
        await supabase.auth.updateUser({
          data: {
            nickname: meta.full_name ?? meta.name ?? emailPrefix,
            phone: meta.phone ?? "",
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("OAuth 驗證失敗，請重新嘗試")}`,
  );
}
