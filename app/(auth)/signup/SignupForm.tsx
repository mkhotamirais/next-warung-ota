"use client";

import { signup } from "@/actions/account";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { SignupSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input-tmp";
import { InputPassword } from "@/components/ui/InputPassword";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const disabled = form.formState.isSubmitting;

  const onSubmit = async (data: inferSchema) => {
    try {
      const res = await signup(data);
      if (res?.message) {
        form.reset();
        form.clearErrors();
        signIn("credentials", { email: data.email, password: data.password });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
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
                  <Input placeholder="email" {...field} />
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
                  <InputPassword {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4" disabled={disabled}>
            {disabled && <Spinner />}
            Sign Up
          </Button>
        </form>
      </Form>
    </>
  );
}
