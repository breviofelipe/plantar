import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Paths que não precisam de autenticação
  const publicPaths = ["/auth/login", "/auth/signup", "/auth/confirmation", "/auth/callback", "/auth/auth-error"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Se não tem usuário e está tentando acessar rota protegida, redireciona para login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Se tem usuário e está na página de auth, redireciona para home
  if (user && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return response
}
