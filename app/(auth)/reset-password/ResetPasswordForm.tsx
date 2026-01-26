"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputPassword } from "@/components/ui/InputPassword";
import { resetPassword } from "@/actions/account";

type inferSchema = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });
  const disabled = form.formState.isSubmitting;

  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    const { newPassword, confirmNewPassword } = data;

    // const res = await fetch("/api/account/reset-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token, email, newPassword, confirmNewPassword }),
    // });
    // const result = await res.json();
    const result = await resetPassword(token, email, newPassword, confirmNewPassword);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setTimeout(() => router.replace("/signin"), 1000);
  };

  return (
    <div className="space-y-4">
      <h1 className="h1 text-center mb-4">Reset Password</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* name */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <InputPassword placeholder="New password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <InputPassword placeholder="Confirm New password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={disabled} className="w-full">
            {disabled && <Spinner />}
            Ubah Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
