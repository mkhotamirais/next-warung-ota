import { redirect } from "next/navigation";

export default function User() {
  return redirect("/dashboard/user/profile");
}
