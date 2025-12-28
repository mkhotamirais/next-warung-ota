import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { token, email } = body || {};

    if (!token || !email) {
      return Response.json({ message: "Token and email are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail, token },
    });

    if (!verificationToken) {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      const status = user?.emailVerified ? 200 : 404;
      const message = user?.emailVerified ? "Email already verified" : "Token not found or invalid";
      return Response.json({ message }, { status });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } });
      return Response.json({ message: "Token has expired" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail, token },
      }),
    ]);

    return Response.json({ message: "Email successfully verified" });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => null);

//     if (!body?.token || !body?.email)
//       return Response.json({ message: "Token and email are required." }, { status: 400 });

//     const { token, email } = body;
//     const normalizedEmail = email.toLowerCase();

//     const verificationToken = await prisma.verificationToken.findFirst({
//       where: { identifier: normalizedEmail, token },
//     });

//     if (!verificationToken) {
//       const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
//       if (user?.emailVerified) return Response.json({ message: "Email already verified" }, { status: 200 });
//       return Response.json({ message: "Token not found or invalid" }, { status: 404 });
//     }

//     if (verificationToken.expires < new Date()) {
//       await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } });
//       return Response.json({ message: "Token has expired" }, { status: 400 });
//     }

//     const [updatedUser] = await prisma.$transaction([
//       prisma.user.update({ where: { email: normalizedEmail }, data: { emailVerified: new Date() } }),
//       prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } }),
//     ]);

//     return Response.json({ message: "Email successfully verified", email: updatedUser.email }, { status: 200 });
//   } catch (error) {
//     console.error("Verification error:", error);
//     return Response.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
