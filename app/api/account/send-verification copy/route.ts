import { auth } from "@/auth";
import { sendEmailChangeVerification, sendVerificationEmail } from "@/actions/send-verification";

export async function POST() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    if (session.user.pendingEmail) {
      await sendEmailChangeVerification(session.user.pendingEmail, session.user.id);
    } else {
      await sendVerificationEmail(userEmail, session.user.id);
    }

    return Response.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return Response.json(
      { message: "Failed to send verification email. Check server logs." },
      {
        status: 500,
      }
    );
  }
}
