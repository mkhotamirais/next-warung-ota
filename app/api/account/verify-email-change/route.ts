import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { token, userId } = body || {};

    if (!token || !userId) return Response.json({ message: "Missing token or user ID" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: userId, emailChangeVerificationToken: token },
      select: { pendingEmail: true },
    });

    if (!user) return Response.json({ error: "Token not found, invalid, or expired." }, { status: 404 });

    if (!user.pendingEmail) return Response.json({ error: "No pending email found." }, { status: 400 });

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: user.pendingEmail,
        emailVerified: new Date(),
        pendingEmail: null,
        emailChangeVerificationToken: null,
      },
    });

    return Response.json({ message: "Email successfully updated", newEmail: user.pendingEmail });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
