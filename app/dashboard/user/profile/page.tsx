import React from "react";
import UpdateDataForm from "./UpdateDataForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccount from "./DeleteAccount";

export default function UserProfile() {
  return (
    <div>
      <UpdateDataForm />
      <UpdatePasswordForm />
      <DeleteAccount />
    </div>
  );
}
