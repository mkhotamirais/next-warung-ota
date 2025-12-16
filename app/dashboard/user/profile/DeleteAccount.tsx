"use client";

import Button from "@/components/ui/Button";
import React, { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import Input from "@/components/ui/Input";
import { profileDeleteAccount } from "@/actions/profile";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isDel, setIsDel] = useState(false);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      // const res = await fetch("/api/account/delete-account", {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text }),
      // });
      // const result = await res.json();
      const result = await profileDeleteAccount({ text });
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.errors) {
        toast.error("errors");
        return;
      }

      toast.success(result.message);
      setText("");
      setIsDel(false);

      await signOut({ callbackUrl: "/", redirect: true });
    });
  };

  return (
    <div>
      <h2 className="h2 mb-2">Delete Your Account</h2>
      {isDel ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              id="delete-confirmation"
              label="Delete Confirmation"
              placeholder="type 'delete my account' to confirm deletion"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-1">
              <Button
                type="submit"
                variant="destructive"
                disabled={pending || text !== "delete my account"}
                className="w-fit"
                pending={pending}
              >
                Confirm
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsDel(false)} className="w-fit">
                Cancel
              </Button>
            </div>
          </form>
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
