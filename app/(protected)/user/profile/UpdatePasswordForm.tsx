"use client";

import { profileChangePassword } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ChangePasswordSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { InputPassword } from "@/components/ui/InputPassword";

type inferSchema = z.infer<typeof ChangePasswordSchema>;

export default function UpdatePasswordForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const isAllPasswordFilled =
    (watchedValues.currentPassword || "") !== "" &&
    (watchedValues.newPassword || "") !== "" &&
    (watchedValues.confirmNewPassword || "") !== "";

  const pending = form.formState.isSubmitting;

  const onSubmit = async (data: inferSchema) => {
    // const res = await fetch("/api/account/profile", {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    // });
    // const result = await res.json();
    const result = await profileChangePassword(data);
    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    form.reset();
  };

  return (
    <div className="mb-6">
      <h2 className="h2 mb-2">Change Password</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <InputPassword placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <InputPassword placeholder="********" {...field} />
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
                  <InputPassword placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending || !isAllPasswordFilled} className="mt-2 w-fit">
            {pending && <Spinner />}
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
