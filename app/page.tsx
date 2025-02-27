"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrainCircuit, RotateCcw, Send, Square, Loader2 } from "lucide-react";
import { titleCaser } from "@/lib/utils";
import { MemoizedMarkdown } from "@/components/ui/memoized-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function Chat() {
  const [provider, setProvider] = useState(
    localStorage.getItem("provider") || "openai"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    api: "/api/chat",
    body: { provider },
  });

  const isLoading = ["streaming", "submitted"].includes(status);
  const isError = status === "error";

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [provider, setMessages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen flex flex-col py-6 px-4 md:px-0 relative">
      <Card className="flex-grow shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Vaschat</CardTitle>
          <Separator className="mt-2" />
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="flex-1 pr-4 h-[75vh]" ref={scrollAreaRef}>
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Start a new conversation</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="flex gap-3 mb-6">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        {m.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">
                        {m.role === "user" ? "You" : titleCaser(provider)}
                      </p>

                      {m.parts
                        ? m.parts.map((part, idx) => {
                            if (part.type === "reasoning") {
                              return (
                                <Accordion
                                  key={`reasoning-${idx}`}
                                  type="single"
                                  collapsible
                                  className="w-full text-sm mb-2 border rounded-md"
                                >
                                  <AccordionItem
                                    value={`reasoning-${idx}`}
                                    className="border-none"
                                  >
                                    <AccordionTrigger className="flex gap-2 items-center justify-between text-sm font-medium px-3 py-2 rounded-md">
                                      <div className="flex items-center gap-2">
                                        <BrainCircuit className="h-4 w-4" />
                                        <span>Reasoning</span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-3 bg-secondary/20 rounded-b-md">
                                      <MemoizedMarkdown
                                        id={`${m.id}-reasoning-${idx}`}
                                        content={part.reasoning}
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              );
                            } else if (part.type === "text") {
                              return (
                                <div
                                  key={`text-${idx}`}
                                  className="prose prose-sm max-w-none"
                                >
                                  <MemoizedMarkdown
                                    id={`${m.id}-text-${idx}`}
                                    content={part.text}
                                  />
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })
                        : m.content && (
                            <div className="prose prose-sm max-w-none">
                              <MemoizedMarkdown id={m.id} content={m.content} />
                            </div>
                          )}
                    </div>
                  </div>
                ))
              )}
              {/* Invisible element for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="mt-4">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            // Additional scroll after submission
            setTimeout(scrollToBottom, 100);
          }}
          className="relative w-full mx-auto"
        >
          <div className="border rounded-lg shadow-sm bg-card p-2">
            <div className="flex gap-2 items-center">
              <Select
                value={provider}
                onValueChange={(val) => {
                  localStorage.setItem("provider", val);
                  setProvider(val);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="cohere">Cohere</SelectItem>
                </SelectContent>
              </Select>

              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={`Chat with ${titleCaser(provider)}...`}
                className="flex-1"
                disabled={isLoading}
              />

              {status === "ready" ? (
                <Button type="submit" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              ) : isLoading ? (
                <Button variant="destructive" onClick={stop} size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button onClick={() => reload()} size="sm" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Generating response...</span>
              </div>
            )}

            {isError && (
              <div className="text-xs text-destructive mt-2">
                An error occurred. Please try again.
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
