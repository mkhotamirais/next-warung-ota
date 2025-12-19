import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  let token: string;
  let userId: string;

  try {
    const bodyText = await req.text();
    if (!bodyText) return Response.json({ message: "Missing token and user ID in request body." }, { status: 400 });

    const body = JSON.parse(bodyText);
    token = body.token;
    userId = body.userId;
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return Response.json({ message: "Invalid JSON format in request." }, { status: 400 });
  }

  if (!token || !userId) {
    return Response.json({ message: "Missing token or user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, emailChangeVerificationToken: token },
      select: { id: true, pendingEmail: true, emailVerified: true },
    });

    if (!user) {
      return Response.json({ message: "Token not found, invalid, or expired." }, { status: 404 });
    }

    if (!user.pendingEmail) {
      return Response.json({ message: "Email change request not found or already processed." }, { status: 400 });
    }
    // Asumsi: Anda menambahkan logic cek kadaluarsa token di sini jika token Anda memiliki expires field.
    // Jika tidak, kita langsung proses.

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: user.pendingEmail,
        emailVerified: new Date(),
        pendingEmail: null,
        emailChangeVerificationToken: null,
      },
    });

    return Response.json(
      { message: "Email successfully updated", newEmail: user.pendingEmail },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
