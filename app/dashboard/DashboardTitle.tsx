import { User } from "next-auth";

interface DashboardTitleProps {
  user: User | undefined;
}

export default function DashboardTitle({ user }: DashboardTitleProps) {
  return (
    <div>
      Hi {user?.name} | {user?.email} | {user?.role} | {user?.emailVerified ? "Verified" : "Not Verified"}
    </div>
  );
}
