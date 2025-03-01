import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { Key } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AxiosInstance from "@/lib/AxiosInstance";
import { saveToLocalStorage } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  beforeLoad() {
    if (localStorage.getItem("access_token")) {
      throw redirect({
        to: "/chat",
      });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email().max(100, {
      message: "Username must be at the maximum 100 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AxiosInstance.post("/auth/signin", values);
      if (response.status === 200) {
        console.log(response.data.access_token);
        saveToLocalStorage("access_token", response.data.access_token.toString());
        saveToLocalStorage("provider", "google");
        navigate({
          to: "/chat",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Key className="w-8 h-8 text-primary" weight="fill" />
          </div>
          <h1 className="text-2xl font-bold">Sign in to VasChat</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer"
              disabled={!form.formState.isValid}
            >
              Sign In
            </Button>
          </form>
        </Form>

        <div className="flex flex-col items-center space-y-6">
          <Link
            to="/signup"
            className="flex items-center gap-2 text-primary hover:underline transition-all hover:gap-3"
          >
            <span>Don't have an account?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
