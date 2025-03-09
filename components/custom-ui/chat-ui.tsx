"use client";
import { Button } from "../ui/button";
import { RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Message } from "./message";
import { useChat } from "@ai-sdk/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChatIcon } from "./chat-icon";
import { titleCaser } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ProviderNamesType } from "@/lib/config";

export default function ChatUi({
  providerSlugs,
}: {
  providerSlugs: ProviderNamesType[];
}) {
    console.log(providerSlugs);
  const [provider, setProvider] = useState(providerSlugs[0]);

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

  const scrollRef = useRef<HTMLDivElement>(null);

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
    <>
      <div className="flex-1 w-full to-background overflow-hidden">
        <ScrollArea className="h-full w-full" ref={scrollRef}>
          <div className="w-full max-w-4xl mx-auto space-y-6 p-6 pb-24">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
                <div className="rounded-full bg-primary/10 p-6 w-24 h-24 flex items-center justify-center">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-foreground mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Choose a provider from the dropdown and send a message to
                    begin chatting.
                  </p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 w-full px-4 pb-4 pt-2 bg-gradient-to-t from-background to-transparent">
        <form
          onSubmit={handleSubmit}
          className="bg-card shadow-xl rounded-lg border border-muted p-3 flex gap-3 items-center max-w-4xl mx-auto"
        >
          <Select
            value={provider}
            onValueChange={(p) => {
              setProvider(p);
              localStorage.setItem("provider", p);
              setMessages([]);
            }}
          >
            <SelectTrigger className="w-[80px] md:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providerSlugs.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  <div className="flex items-center gap-2">
                    <ChatIcon provider={provider} />
                    <span>{titleCaser(provider)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[20vh] flex-1 py-2 resize-none bg-background/70 border-0 focus-visible:ring-1 focus-visible:ring-primary"
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
              className="h-10 w-10 flex-shrink-0 cursor-pointer bg-primary hover:bg-primary/90 transition-colors"
            >
              <Send size={18} />
            </Button>
          ) : status === "error" ? (
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="h-10 w-10 flex-shrink-0 cursor-pointer text-amber-500 hover:text-amber-600 hover:bg-amber-100/20"
              onClick={() => reload()}
            >
              <RotateCcw size={18} />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="destructive"
              type="button"
              className="h-10 w-10 flex-shrink-0 cursor-pointer"
              onClick={stop}
            >
              <Square size={18} />
            </Button>
          )}
        </form>
      </div>
    </>
  );
}
