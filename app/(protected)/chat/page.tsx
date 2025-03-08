"use client";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { Message } from "@/components/custom-ui/message";
import { providerNames } from "@/lib/config";
import { titleCaser } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Send, Square } from "lucide-react";
import { ChatIcon } from "@/components/custom-ui/chat-icon";

export default function Page() {
  const [provider, setProvider] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("provider") || "openai"
      : "openai"
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
    body: { provider: provider.toLowerCase() },
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
    <div className="flex flex-col w-full h-full relative">
      <div className="flex-1 w-full bg-muted/30 overflow-hidden">
        <ScrollArea className="h-full pt-4 pb-20" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6 p-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center">
                  <Send size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a provider from the dropdown and send a message to
                  begin chatting.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-4">
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
                  <ChatIcon provider={provider} />
                  {titleCaser(provider)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Type your message..."
            className="min-h-[30px] max-h-[20vh] flex-1 py-2 resize-none bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <Send size={20} />
            </Button>
          ) : status === "error" ? (
            <Button
              size="icon"
              variant="ghost"
              type="submit"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
              onClick={() => reload()}
            >
              <RotateCcw size={20} />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="destructive"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
              onClick={stop}
            >
              <Square size={20} />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}