// import { sendVerificationEmail } from "@/actions/send-verification";
import { sendVerificationEmail } from "@/actions/send-verification";
import prisma from "@/lib/prisma";
import { SignupSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = SignupSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log(existingUser);
    if (existingUser) {
      return Response.json({ error: `Email '${email}' sudah terdaftar.` }, { status: 409 });
    }

    const hashedPassword = hashSync(password, 10);
    const newUser = { name, email, password: hashedPassword, emailVerified: null };

    const user = await prisma.user.create({ data: newUser });
    await sendVerificationEmail(newUser.email, user.id);

    return Response.json({ message: "Pendaftaran berhasil." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
