import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  }
  return (
    <main className="flex items-center justify-center h-screen  p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Sign in to Vaschat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="flex flex-col items-center"
          >
            <Button
              className="w-full flex items-center justify-center gap-2 py-5 cursor-pointer"
              type="submit"
            >
              <SiGoogle className="h-4 w-4" />
              <span>Sign in with Google</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
