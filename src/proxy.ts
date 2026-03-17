import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 重要：呼叫 getUser() 以刷新 session，確保 cookie 維持有效
  // 不可在此處依賴 getSession()，因為它不會向 Supabase 驗證 token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 若要保護特定路由（例如 /protected），可在此加入守衛邏輯：
  // if (!user && request.nextUrl.pathname.startsWith('/protected')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // 已登入使用者造訪 /login 頁面時自動導回首頁
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 比對所有請求路徑，但排除：
     * - _next/static (靜態檔案)
     * - _next/image (圖片最佳化)
     * - favicon.ico, sitemap.xml, robots.txt 等
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
