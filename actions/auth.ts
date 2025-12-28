"use server";

import { signIn } from "@/auth";

export async function signInGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}
