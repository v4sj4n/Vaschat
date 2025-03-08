"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Brain, Sparkles, User } from "lucide-react";
import { UIMessage } from "@ai-sdk/ui-utils";
import { MemoizedMarkdown } from "./memoized-markdown";

export const Message = ({ id, role, parts }: UIMessage) => {
  const reasoningParts = parts?.filter((part) => part.type === "reasoning") || [];
  const textParts = parts?.filter((part) => part.type === "text") || [];

  return (
    <div key={id} className="flex items-start gap-2 w-full">
      <div className="flex-shrink-0">
        {role === "user" ? (
          <User className="size-4 mt-6 mr-6" />
        ) : (
          <Sparkles className="size-4 mt-6 mr-6" />
        )}
      </div>
      <div className="flex-grow overflow-hidden w-full max-w-full">
        {reasoningParts.map((part, index) => (
          <Accordion
            key={`reasoning-${index}`}
            type="single"
            collapsible
            className="w-full text-sm mb-2 border rounded-md"
          >
            <AccordionItem value={`reasoning-${index}`} className="border-none">
              <AccordionTrigger className="flex gap-2 items-center justify-between text-sm font-medium px-3 py-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Reasoning</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 bg-secondary/20 rounded-b-md overflow-hidden">
                <MemoizedMarkdown
                  id={`${id}-reasoning-${index}`}
                  content={part.reasoning}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        {textParts.map((part, index) => (
          <div key={`text-${index}`} className="prose prose-sm w-full max-w-full overflow-hidden">
            <MemoizedMarkdown
              id={`${id}-text-${index}`}
              content={part.text}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
