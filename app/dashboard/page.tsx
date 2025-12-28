import DashboardTitle from "./DashboardTitle";
import EmailVerificationBanner from "./EmailVerificationBanner";

export default async function DashboardPage() {
  return (
    <section>
      <EmailVerificationBanner />
      <DashboardTitle />
    </section>
  );
}
