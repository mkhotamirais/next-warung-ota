import { sendEmailChangeVerification, sendEmailVerification } from "@/actions/account";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function POST() {
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.emailVerified) {
    redirect("/dashboard");
  }
  const userEmail = session.user.email;

  try {
    if (session.user.pendingEmail) {
      await sendEmailChangeVerification(session.user.pendingEmail, session.user.id);
    } else {
      await sendEmailVerification(userEmail, session.user.id);
    }

    return Response.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error sending verification email:", error);
    return Response.json({ error: "Failed to send verification email." }, { status: 500 });
  }
}
