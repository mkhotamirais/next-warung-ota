"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { profileDeleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button-tmp";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { DeleteAccountSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof DeleteAccountSchema>;

export default function DeleteAccount() {
  const [isDel, setIsDel] = useState(false);

  const form = useForm<inferSchema>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      text: "",
    },
  });

  const pending = form.formState.isSubmitting;
  const text = useWatch({ control: form.control, name: "text" });

  const onSubmit = async (data: inferSchema) => {
    // const res = await fetch("/api/account/profile", {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ text }),
    // });
    // const result = await res.json();
    const result = await profileDeleteAccount(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.errors) {
      toast.error("errors");
      return;
    }

    toast.success(result.message);
    setIsDel(false);

    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="mb-6">
      <h2 className="h2 mb-2">Delete Your Account</h2>
      {isDel ? (
        <div>
          <p>
            Type <b>&quot;delete my account&quot;</b> to confirm
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Type confirmation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={pending || text !== "delete my account"}
                  className="w-fit"
                >
                  {pending && <Spinner />}
                  Confirm
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsDel(false)} className="w-fit">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div>
          <p className="mb-2">
            If you delete your account, All of your data will be permanently removed from our servers.
          </p>
          <Button className="w-fit" type="button" variant="destructive" onClick={() => setIsDel(true)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
