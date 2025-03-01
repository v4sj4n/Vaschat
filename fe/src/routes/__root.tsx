import { ModeToggle } from "@/components/custom-ui/mode-toggle";
import { Chat } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen items-center bg-background">
      <header className="container flex items-center max-w-3xl justify-between py-6 px-12">
        <div className="flex items-center gap-2">
          <Chat className="size-8 text-primary" />
          <span className="text-xl font-bold">VasChat</span>
        </div>
        <ModeToggle />
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
