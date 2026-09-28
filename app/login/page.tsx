"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to authenticate your account.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, role, dealer_id, display_name")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError(
          "Your account is authenticated but no application profile was found."
        );
        return;
      }

      if (!["SUPER_ADMIN", "ADMIN", "DEALER"].includes(profile.role)) {
        await supabase.auth.signOut();
        setError("Your account does not have access to this application.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-screen bg-[#090b0e] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e31b23] text-xl font-black">
              F
            </div>

            <div>
              <div className="text-2xl font-bold">Fleeto</div>
              <div className="text-sm text-white/55">
                Tertiary Invoice Platform
              </div>
            </div>
          </div>

          <div className="mt-32 max-w-xl">
            <div className="mb-7 h-1 w-16 rounded-full bg-[#e31b23]" />

            <h1 className="text-5xl font-black leading-[1.08]">
              Enterprise billing.
              <br />
              Built for control.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">
              Secure dealer inventory, customer billing, invoice management
              and enterprise administration from one controlled platform.
            </p>
          </div>
        </div>

        <div className="text-sm text-white/40">
          Secure • Controlled • Auditable
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e31b23] font-black text-white">
              F
            </div>
            <div className="text-xl font-bold text-[#0b0d10]">Fleeto</div>
          </div>

          <div className="rounded-[24px] border border-black/5 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:p-10">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d71920]">
                Authorized Access
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#0b0d10]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign in to access the Fleeto Tertiary Invoice platform.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#e31b23] focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#e31b23] focus:ring-4 focus:ring-red-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#e31b23] px-5 text-sm font-bold text-white transition hover:bg-[#c9151c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs leading-5 text-gray-400">
              Access is restricted to authorized Fleeto users.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Fleeto Tertiary Invoice • Enterprise Dealer Portal
          </p>
        </div>
      </section>
    </main>
  );
}
