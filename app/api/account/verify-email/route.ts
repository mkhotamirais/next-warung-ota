import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  let token: string;
  let email: string;

  try {
    const bodyText = await req.text();
    if (!bodyText) return Response.json({ message: "Missing token and email in request body." }, { status: 400 });

    const body = JSON.parse(bodyText);
    token = body.token;
    email = body.email;
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Invalid JSON format in request." }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { identifier: email, token } });

    if (!verificationToken) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && user.emailVerified) return Response.json({ message: "Email already verified" }, { status: 200 });
      return Response.json({ message: "Token not found or invalid" }, { status: 404 });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: email, token: token } });
      return Response.json({ message: "Token has expired" }, { status: 400 });
    }

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({ where: { email: email }, data: { emailVerified: new Date() } }),
      prisma.verificationToken.deleteMany({ where: { identifier: email, token: token } }),
    ]);

    return Response.json(
      { message: "Email successfully verified", email: updatedUser.email },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
