import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Brain, Sparkle, User } from "@phosphor-icons/react";
import { MemoizedMarkdown } from "./memoized-markdown";
import { UIMessage } from "@ai-sdk/ui-utils";

export const Message = ({ id, role, parts }: UIMessage) => {
  return (
    <div key={id} className="flex items-start gap-2">
      <div>
        {role === "user" ? (
          <User className="size-4 mt-6 mr-6" />
        ) : (
          <Sparkle className="size-4 mt-6 mr-6" />
        )}
      </div>
      <div>
        {parts?.map((part, index) => {
          if (part.type === "reasoning") {
            return (
              <Accordion
                key={`reasoning-${index}`}
                type="single"
                collapsible
                className="w-full text-sm mb-2 border rounded-md"
              >
                <AccordionItem
                  value={`reasoning-${index}`}
                  className="border-none"
                >
                  <AccordionTrigger className="flex gap-2 items-center justify-between text-sm font-medium px-3 py-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Reasoning</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-3 bg-secondary/20 rounded-b-md">
                    <MemoizedMarkdown
                      id={`${id}-reasoning-${index}`}
                      content={part.reasoning}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }
          if (part.type === "text") {
            return (
              <div key={`text-${index}`} className="prose prose-sm max-w-none">
                <MemoizedMarkdown
                  id={`${id}-text-${index}`}
                  content={part.text}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
