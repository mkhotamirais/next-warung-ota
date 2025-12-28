"use client";

import { updateProfileData } from "@/actions/account";
import FallbackUpdateData from "@/components/fallbacks/FallbackUpdateData";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaX } from "react-icons/fa6";
import { toast } from "sonner";

const normalizeValue = (value: string | undefined | null) => {
  if (value === null || value === undefined || value.trim() === "") {
    return undefined;
  }
  return value;
};

export default function UpdateDataForm() {
  const { data: session, update, status } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [pending, startTransition] = useTransition();
  const [pendingResend, startResend] = useTransition();
  const [isResend, setIsResend] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const setInitialData = () => {
      if (user) {
        setName(user?.name || "");
        setPhone(user?.phone || "");
        setEmail(user?.email || "");
      }
    };
    setInitialData();
  }, [user]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      // const res = await fetch("/api/account/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, phone }),
      // });
      // const result = await res.json();
      const result = await updateProfileData({ name, email, phone });

      if (result?.errors) {
        setErrors(result.errors);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result?.message);
      setErrors(undefined);
      await update({});
      router.refresh();

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  };

  const isNameUnchanged = normalizeValue(name) === normalizeValue(user?.name);
  const isPhoneUnchanged = normalizeValue(phone) === normalizeValue(user?.phone);
  const isEmailUnchanged = normalizeValue(email) === normalizeValue(user?.email);

  const isDataUnchanged = isNameUnchanged && isPhoneUnchanged && isEmailUnchanged;

  let content;

  if (status === "loading") {
    content = <FallbackUpdateData />;
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <div>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.email?.errors}
            className="mb-1!"
          />
          <div className="mb-3">
            {user?.emailVerified ? (
              <div className="flex items-center gap-1 text-sm text-primary">
                <FaCheck className="" />
                verified
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-sm">
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
        </div>
        <Input
          label="Phone"
          id="phone"
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors?.phone?.errors}
        />
        <Button type="submit" disabled={pending || isDataUnchanged} pending={pending} className="w-fit">
          Save
        </Button>
      </form>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="h2 mb-2">Your Data</h2>
      {/* <FallbackUpdateData /> */}
      {content}
    </div>
  );
}
