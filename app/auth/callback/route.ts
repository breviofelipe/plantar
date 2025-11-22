import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const proto = request.headers.get("x-forwarded-proto")
      const host = forwardedHost || request.headers.get("host")
      const redirectUrl = `${proto}://${host}${next}`
      return NextResponse.redirect(redirectUrl)
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host")
  const proto = request.headers.get("x-forwarded-proto")
  const host = forwardedHost || request.headers.get("host")
  const redirectUrl = `${proto}://${host}/auth/auth-error`
  return NextResponse.redirect(redirectUrl)
}
