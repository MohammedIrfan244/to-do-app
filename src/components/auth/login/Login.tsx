"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import PrivacyModal from "@/components/auth/login/Privacy-policy";

function Login() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 w-screen h-screen flex items-center justify-center">
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-[380px] text-center">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Welcome to DURIO
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Plan smarter — focus on what matters
        </p>

        <button
          onClick={() => signIn("google")}
          className="
            mt-8 w-full flex items-center justify-center gap-3
            bg-white border border-slate-300 hover:border-slate-400
            shadow-sm hover:shadow transition-all duration-200
            py-2.5 rounded-lg cursor-pointer"
        >
          <span className="text-sm text-slate-800 font-medium">
            Sign in with <span className="text-blue-500 font-semibold">G</span>
            <span className="text-red-500 font-semibold">o</span>
            <span className="text-yellow-500 font-semibold">o</span>
            <span className="text-blue-500 font-semibold">g</span>
            <span className="text-green-500 font-semibold">l</span>
            <span className="text-orange-500 font-semibold transition-all transform -rotate-12 inline-block">
              e
            </span>
          </span>
        </button>

        <p className="text-[11px] text-slate-400 mt-6 leading-normal">
          By continuing, you agree to our{" "}
          <span
            onClick={() => setPrivacyOpen(true)}
            className="underline cursor-pointer text-slate-600 hover:text-slate-800"
          >
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default Login;
