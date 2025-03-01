/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Components } from "react-markdown";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's utility function

interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

interface CodeProps extends ComponentProps {
  inline?: boolean;
  className?: string;
}

const markdownComponents: Components = {
  // Headings
  h1: ({ children, ...props }: ComponentProps) => (
    <h1
      className={cn(
        "text-3xl font-bold mt-8 mb-4 text-primary border-b-2 border-border pb-2"
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps) => (
    <h2 className={cn("text-2xl font-bold mt-6 mb-3 text-primary")} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps) => (
    <h3
      className={cn("text-xl font-bold mt-5 mb-2 text-primary/90")}
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentProps) => (
    <h4
      className={cn("text-lg font-bold mt-4 mb-2 text-primary/80")}
      {...props}
    >
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }: ComponentProps) => (
    <p
      className={cn("my-4 leading-relaxed text-foreground text-lg")}
      {...props}
    >
      {children}
    </p>
  ),

  // Links
  a: ({ children, ...props }: ComponentProps) => (
    <a
      className={cn(
        "text-primary-foreground bg-primary/90 px-1 rounded-sm",
        "hover:bg-primary transition-colors duration-200"
      )}
      {...props}
    >
      {children}
    </a>
  ),

  // Lists
  ul: ({ children, ...props }: ComponentProps) => (
    <ul
      className={cn("my-4 ml-6 list-disc space-y-2 text-foreground")}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps) => (
    <ol
      className={cn("my-4 ml-6 list-decimal space-y-2 text-foreground")}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps) => (
    <li className={cn("ml-2 text-lg")} {...props}>
      {children}
    </li>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }: ComponentProps) => (
    <blockquote
      className={cn(
        "border-l-4 border-primary/50 pl-4 py-2 my-6",
        "bg-secondary text-secondary-foreground rounded-r-md italic"
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code blocks and inline code
  code: ({ inline, className, children, ...props }: CodeProps) => {
    return !inline ? (
      <code
        className={cn(
          className,
          "block text-sm rounded-md p-4 bg-card text-card-foreground",
          "overflow-x-auto border border-border"
        )}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className={cn(
          "px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground",
          "font-mono text-sm mx-0.5"
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: ComponentProps) => (
    <pre
      className={cn(
        "my-6 rounded-md overflow-hidden shadow-md border border-border"
      )}
      {...props}
    >
      {children}
    </pre>
  ),

  // Images
  img: ({ ...props }: ComponentProps) => (
    <img
      className={cn(
        "rounded-md shadow-md max-w-full h-auto my-6",
        "hover:shadow-lg transition-shadow duration-300",
        "border border-border"
      )}
      {...props}
    />
  ),

  // Tables
  table: ({ children, ...props }: ComponentProps) => (
    <div className="overflow-x-auto my-6">
      <table
        className={cn(
          "min-w-full divide-y divide-border border border-border",
          "rounded-md overflow-hidden shadow-sm"
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentProps) => (
    <thead className={cn("bg-muted")} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: ComponentProps) => (
    <tbody className={cn("bg-card divide-y divide-border")} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: ComponentProps) => (
    <tr
      className={cn("hover:bg-muted/50 transition-colors duration-150")}
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }: ComponentProps) => (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-muted-foreground",
        "uppercase tracking-wider"
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentProps) => (
    <td
      className={cn("px-6 py-4 whitespace-nowrap text-sm text-foreground")}
      {...props}
    >
      {children}
    </td>
  ),

  // Horizontal rule
  hr: (props: ComponentProps) => (
    <hr
      className={cn("my-8 h-1 bg-border rounded-full border-none opacity-80")}
      {...props}
    />
  ),

  // Custom Bold
  strong: ({ children, ...props }: ComponentProps) => (
    <strong className={cn("font-extrabold text-lg text-primary")} {...props}>
      {children}
    </strong>
  ),
};

export default markdownComponents;
