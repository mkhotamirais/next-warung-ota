import React from "react";
import UpdateDataForm from "./UpdateDataForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccount from "./DeleteAccount";

export default function Profile() {
  return (
    <>
      <h1 className="h1 mb-4">Profile</h1>
      <div>
        <UpdateDataForm />
        <UpdatePasswordForm />
        <DeleteAccount />
      </div>
    </>
  );
}
