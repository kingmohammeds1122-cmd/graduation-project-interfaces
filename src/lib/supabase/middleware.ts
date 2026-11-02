import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * وسيط إدارة وتحديث الجلسات (Middleware)
 * يدعم التبديل السلس بين وضع المحاكاة (Mock API) ووضع الربط الفعلي (FastAPI / Supabase).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isRoot = pathname === "/";

  // التحقق من تفعيل وضع المحاكاة
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
  const authToken = request.cookies.get("auth_token")?.value;

  if (useMockApi) {
    // في وضع المحاكاة:
    // إذا كان المستخدم مسجلاً دخول مسبقاً وزار /login أو /register أو /: يوجهه إلى /dashboard
    if (authToken && (isAuthRoute || isRoot)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // إذا زار الجذر دون جلسة: يوجهه إلى /login
    if (!authToken && isRoot) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // السماح بالمرور في وضع المحاكاة
    return supabaseResponse;
  }

  // في وضع الاتصال الفعلي: التحقق من التوكن أو عميل Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (authToken) {
    if (isAuthRoute || isRoot) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (!isAuthRoute && !isRoot) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // إذا لم يكن موثقاً وحاول الوصول للمسارات المحمية
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // إذا كان موثقاً وزار صفحات الدخول
  if (user && (isAuthRoute || isRoot)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
