import { useAuth } from "@/providers/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DeskHome() {
  const { user } = useAuth()

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Moca Desk</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Signed in as {user?.full_name || user?.email || "Administrator"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
