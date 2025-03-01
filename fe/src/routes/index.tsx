import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Chat, Sparkle, Key, Lightning } from '@phosphor-icons/react';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
  return (
  
<>

      {/* Hero Section */}
      <main className="container flex flex-col items-center justify-center flex-1 px-4 text-center gap-10 py-16">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Streamline Your AI Experience
          </h1>
          <p className="text-xl text-muted-foreground">
            Tired of exorbitant fees just to chat with AI? VasChat lets you use your own API keys,
            saving you money while delivering seamless interactions.
          </p>
        </div>

        <Link to='/chat'>
        <Button size="lg" className="group gap-2 cursor-pointer">
          Start Chatting
          <Sparkle className="w-4 h-4 transition-transform group-hover:rotate-12" />
        </Button>
        </Link>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Key className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Use Your API Keys</h3>
            <p className="text-muted-foreground">
              Enter your own API keys and get started immediately – no intermediaries, no extra fees.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Chat className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Unified AI Platform</h3>
            <p className="text-muted-foreground">
              Engage with multiple AI services in one place, ensuring a smooth and efficient experience.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Lightning className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Pay as You Go</h3>
            <p className="text-muted-foreground">
              Enjoy transparent pricing with no hidden fees – only pay for what you use.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-6 border-t">
        <div className="flex justify-center text-sm text-muted-foreground">
          © 2025 VasChat. All rights reserved.
        </div>
      </footer>
    </>
);
}

export default Index;
