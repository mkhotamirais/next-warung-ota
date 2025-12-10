import Link from "next/link";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <>
      <h1 className="h1 mb-4 text-center">Sign Up</h1>
      <SignupForm />
      <p className="text-sm text-center text-gray-700 mt-4">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}
