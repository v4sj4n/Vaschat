import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowCounterClockwise,
  PaperPlaneTilt,
  Square,
} from "@phosphor-icons/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRandomPrompts, providerNames } from "@/lib/config";
import { titleCaser } from "@/lib/utils";
import { ChatIconProvider } from "@/components/custom-ui/chat-icon-provider";
import { useChat } from "@ai-sdk/react";
import { Message } from "@/components/custom-ui/message";

export const Route = createFileRoute("/chat")({
  beforeLoad() {
    if (!localStorage.getItem("access_token")) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: ChatPage,
});

function ChatPage() {
  const [provider, setProvider] = useState(
    localStorage.getItem("provider") || "openai"
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    stop,
    status,
    reload,
  } = useChat({
    id: "chat",
    experimental_throttle: 50,
    api: "http://localhost:3000/api/chat/stream-data",
    body: { provider },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  return (
    <div className="flex flex-col w-full flex-1 relative">
      <div className="flex-1 w-full bg-muted/30">
        <ScrollArea className="h-[calc(100vh-10rem)] pt-4 pb-8" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6 p-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center">
                  <PaperPlaneTilt size={28} weight="duotone" className="text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground">Start a conversation</h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a provider from the dropdown and send a message to begin chatting.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-md mt-2">
                  {getRandomPrompts().map((suggestion) => (
                    <Button 
                      key={suggestion}
                      variant="outline" 
                      className="justify-start text-left hover:bg-primary/5 transition-colors"
                      onClick={() => {
                        handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLTextAreaElement>)
                        handleSubmit()
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-6 left-0 right-0 mx-auto max-w-3xl px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-card shadow-lg rounded-lg border p-3 flex gap-3 items-center"
        >
          <Select
            value={provider}
            onValueChange={(p) => {
              setProvider(p);
              localStorage.setItem("provider", p);
              setMessages([]);
            }}
          >
            <SelectTrigger className="w-[70px] md:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providerNames.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  <ChatIconProvider provider={provider} />
                  {titleCaser(provider)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Type your message..."
            className="min-h-[30px] max-h-[20h] flex-1 py-2 resize-none bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={input}
            onChange={handleInputChange}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          {status === "ready" ? (
            <Button
              size="icon"
              type="submit"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
            >
              <PaperPlaneTilt size={20} weight="fill" />
            </Button>
          ) : status === "error" ? (
            <Button
              size="icon"
              variant="ghost"
              type="submit"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
              onClick={() => reload()}
            >
              <ArrowCounterClockwise size={20} weight="fill" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="destructive"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
              onClick={stop}
            >
              <Square size={20} weight="fill" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
