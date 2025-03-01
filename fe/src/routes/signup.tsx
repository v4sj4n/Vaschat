import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "@phosphor-icons/react";
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

export const Route = createFileRoute("/signup")({
  beforeLoad() {
    if (localStorage.getItem("access_token")) {
      throw redirect({
        to: "/chat",
      });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email().max(100, {
      message: "Email must be valid and at maximum 100 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AxiosInstance.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (response.status === 201) {
        saveToLocalStorage("access_token", response.data.access_token);
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
            <UserPlus className="w-8 h-8 text-primary" weight="fill" />
          </div>
          <h1 className="text-2xl font-bold">Create your VasChat account</h1>
          <p className="text-muted-foreground">
            Enter your details to create a new account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="flex flex-col items-center space-y-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-primary hover:underline transition-all hover:gap-3"
          >
            <span>Already have an account?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}