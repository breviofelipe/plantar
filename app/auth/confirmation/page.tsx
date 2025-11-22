import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="space-y-6 p-8 text-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">Verifique seu email</h1>
            <p className="mt-2 text-gray-600">
              Enviamos um link de confirmação para seu email. Clique no link para confirmar sua conta.
            </p>
          </div>

          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Não recebeu o email? Verifique sua pasta de spam.</p>
          </div>

          <Link href="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Voltar para login</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
