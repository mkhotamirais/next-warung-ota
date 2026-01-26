"use client";

import { updateProfileData } from "@/actions/account";
import FallbackUpdateData from "@/components/fallbacks/FallbackUpdateData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaX } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ProfileDataSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof ProfileDataSchema>;

export default function UpdateDataForm() {
  const { data: session, update, status } = useSession();
  const user = session?.user;

  const form = useForm<inferSchema>({
    resolver: zodResolver(ProfileDataSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", email: user?.email || "" },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const isDataUnchanged =
    (watchedValues.name || "") === (user?.name || "") &&
    (watchedValues.email || "") === (user?.email || "") &&
    (watchedValues.phone || "") === (user?.phone || "");

  const pending = form.formState.isSubmitting;

  const [pendingResend, startResend] = useTransition();
  const [isResend, setIsResend] = useState(false);

  const router = useRouter();

  const handleResend = () => {
    startResend(async () => {
      const res = await fetch("/api/account/verify-email-request", { method: "POST" });
      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
      }
      toast.success(data?.message);
      setIsResend(true);
      setTimeout(() => {
        setIsResend(false);
      }, 3000);
    });
  };

  const onSubmit = async (data: inferSchema) => {
    // const res = await fetch("/api/account/profile", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // const result = await res.json();
    const result = await updateProfileData(data);

    if (result?.error) {
      toast.error(result?.error);
      return;
    }

    toast.success(result?.message);
    await update({});
    router.refresh();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  let content;

  if (status === "loading") {
    content = <FallbackUpdateData />;
  } else {
    content = (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
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
          <div className="mb-3">
            {user?.emailVerified ? (
              <div className="flex items-center gap-1 text-sm text-primary">
                <FaCheck className="" />
                verified
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center gap-1 text-sm">
                <span className="flex items-center gap-1 text-red-500">
                  <FaX />
                  {user?.pendingEmail || "Email"} is unverified
                </span>
                (<span>Check your email or </span>
                <button
                  disabled={pendingResend}
                  type="button"
                  onClick={handleResend}
                  className="underline text-primary flex items-center gap-1 disabled:opacity-50"
                >
                  Request Verification {pendingResend && <FaSpinner className="animate-spin" />}{" "}
                  {isResend && <FaCheck className="text-green-500" />}
                </button>
                )
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending || isDataUnchanged}>
            {pending && <Spinner />}
            Save
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="h2 mb-2">Your Data</h2>
      {content}
    </div>
  );
}
