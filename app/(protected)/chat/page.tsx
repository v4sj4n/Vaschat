import { auth } from "@/auth";
import ChatUi from "@/components/custom-ui/chat-ui";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ChatPage() {
  const { user: userSession } = await auth();
  const availableProviders = await prisma.modelProviderUserKey.findMany({
    where: {
      user: {
        email: userSession.email,
      },
      apiKey: {
        not: "",
      },
    },
    select: {
      modelProvider: {
        select: {
          slug: true,
        },
      },
    },
  });
  
  const providerToSend = availableProviders
    .map((provider) => {
      if (provider.modelProvider.slug === "groq") {
        return ["llama", "qwen"];
      }
      return provider.modelProvider.slug;
    })
    .flat();

  if (providerToSend.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">No AI Providers Available</h2>
          <p className="text-muted-foreground mb-6">
            You need to add at least one API key before you can start chatting with AI models.
          </p>
          <Link 
            href="/settings" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add API Keys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <ChatUi providerSlugs={providerToSend} />
    </div>
  );
}