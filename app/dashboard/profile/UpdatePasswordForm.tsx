"use client";

import { profileChangePassword } from "@/actions/account";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      // const res = await fetch("/api/account/profile", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      // });
      // const result = await res.json();
      const result = await profileChangePassword({ currentPassword, newPassword, confirmNewPassword });

      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors(undefined);
    });
  };

  return (
    <div className="mb-4">
      <h2 className="h2 mb-2">Change Password</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors?.currentPassword?.errors}
        />
        <Input
          label="New Password"
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors?.newPassword?.errors}
        />
        <Input
          label="Confirm New Password"
          id="confirmNewPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={errors?.confirmNewPassword?.errors}
        />
        <Button
          type="submit"
          disabled={pending || !currentPassword || !newPassword || !confirmNewPassword}
          className="mt-2 w-fit"
          pending={pending}
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}
