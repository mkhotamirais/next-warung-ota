import Link from "next/link";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="container max-w-sm! border border-gray-300 my-12 py-6! px-6! bg-white rounded-lg">
        <h1 className="h1 mb-4">Sign Up</h1>
        <SignupForm />
        <p className="text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
