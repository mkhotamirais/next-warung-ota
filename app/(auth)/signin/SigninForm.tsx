"use client";

import { Button } from "@/components/ui/button-tmp";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input-tmp";
import { SigninSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { InputPassword } from "@/components/ui/InputPassword";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type inferSchema = z.infer<typeof SigninSchema>;

export default function SigninForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(SigninSchema),
    defaultValues: { email: "", password: "" },
  });

  const pending = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    const { email, password } = data;
    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      if (res.code === "credentials") {
        toast.error("Invalid email or password.");
      } else {
        toast.error(res.code);
      }
    }

    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="exaple@email.com" {...field} />
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
                <InputPassword {...field} />
              </FormControl>
              <FormDescription className="flex justify-end">
                <Link href="/reset-password-request" className="text-primary hover:underline" tabIndex={-1}>
                  Forgot password?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending && <Spinner />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
