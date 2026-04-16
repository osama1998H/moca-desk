import { useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useAuth } from "@/providers/AuthProvider"
import { useI18n } from "@/providers/I18nProvider"
import { MocaApiError } from "@/api/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CircleAlertIcon } from "lucide-react"

export function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    const returnTo = searchParams.get("returnTo") ?? "/desk/app"
    void navigate(returnTo, { replace: true })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      const returnTo = searchParams.get("returnTo") ?? "/desk/app"
      void navigate(returnTo, { replace: true })
    } catch (err) {
      if (err instanceof MocaApiError) {
        setError(err.message)
      } else {
        setError(t("An unexpected error occurred. Please try again."))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Moca</CardTitle>
          <CardDescription>{t("Sign in to your account")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <CircleAlertIcon data-icon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={(e) => void handleSubmit(e)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t("Email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={submitting}
            >
              {submitting && <Spinner data-icon="inline-start" />}
              {submitting ? t("Signing in...") : t("Sign in")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
