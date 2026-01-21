"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signinUser } from "@/lib/auth_actions";
import { useRouter } from "next/navigation";
import toast  from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};

export default function Login() {
  const router = useRouter();
  const [state, formAction] = useActionState(signinUser, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success) router.push("/dashboard");
    else if (state.message) toast.error(state.message);
  }, [state, router]);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form action={formAction} className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="john.doe@gmail.com"
              />
              <label className="label">Password</label>
              <label className="input flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="grow"
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-sm btn-circle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </label>
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
              <div className="text-sm mt-2">
                {"Don't have an account? "}
                <Link href="/registration" className="link link-hover">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
