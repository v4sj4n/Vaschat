import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  console.log(session);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-extrabold">VasChat</h1>
          <nav className="space-x-6">
          <Link
              href={session ? "/chat" : "/sign-in"}
              className="relative inline-block group"
            >
              <span className="px-2 py-1">
                {session ? "Go to chat" : "Sign In"}
              </span>
              <span className="absolute bottom-0 top-5 left-0 w-0 h-0.5 bg-white mt-2 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-6">
          <h2 className="text-5xl font-extrabold mb-6">
            Unlock AI Potential with Ease
          </h2>
          <p className="text-xl mb-10">
            Experience seamless AI integration with our intuitive frontend
            service.
          </p>
          {session ? (
            <Button className="cursor-pointer shadow px-8 py-4">
              <Link href="/chat">Go to chat</Link>
            </Button>
          ) : (
            <Button className="px-8 py-3 rounded-lg shadow transition transform hover:scale-105 cursor-pointer">
              Sign In
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8 px-6">
            <Card className="hover:shadow-xl transition-shadow transform hover:-translate-y-1 rounded-xl">
              <CardHeader className="text-2xl font-bold">
                Easy Integration
              </CardHeader>
              <CardContent>
                Seamlessly integrate with various AI services.
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow transform hover:-translate-y-1 rounded-xl">
              <CardHeader className="text-2xl font-bold">
                Cost-Effective
              </CardHeader>
              <CardContent>
                Save money with our efficient AI solutions.
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow transform hover:-translate-y-1 rounded-xl">
              <CardHeader className="text-2xl font-bold">
                User-Friendly
              </CardHeader>
              <CardContent>
                Enjoy an intuitive interface for a hassle-free experience.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} AI Frontend Service. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
