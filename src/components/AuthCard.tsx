import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, KeyRound, Sparkles, Lock, MessageCircle, Send, Loader2 } from "lucide-react";
import { signInWithUsername, signUpWithUsername } from "@/lib/auth";

type Tab = "login" | "signup";

const credentialsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username कम से कम 3 अक्षर का हो")
    .max(30, "Username 30 अक्षर से कम रखें")
    .regex(/^[a-zA-Z0-9_]+$/, "सिर्फ अक्षर, अंक और _ इस्तेमाल करें"),
  password: z
    .string()
    .min(6, "Password कम से कम 6 अक्षर का हो")
    .max(72, "Password बहुत लंबा है"),
});

export function AuthCard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const parsed = credentialsSchema.safeParse({ username, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      if (tab === "signup") {
        await signUpWithUsername(parsed.data.username, parsed.data.password);
        toast.success("Account बन गया! आपको 25 credits मिले हैं।");
      } else {
        await signInWithUsername(parsed.data.username, parsed.data.password);
        toast.success("Login सफल!");
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "कुछ गलत हो गया";
      if (/already registered|already exists/i.test(message)) {
        toast.error("यह username पहले से मौजूद है। Login करें।");
      } else if (/invalid login credentials/i.test(message)) {
        toast.error("गलत username या password।");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Glow behind card */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-[1.75rem] opacity-40 blur-2xl"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden
      />

      <div
        className="relative rounded-3xl border border-border bg-card p-8"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"
            style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
              Garena Email Tool
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Send registration codes with credits
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl bg-input p-1.5">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "login"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="h-4 w-4 text-yellow-400" /> Login
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "signup"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" /> Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete={tab === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 text-yellow-300" />
            )}
            {tab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Contact actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/919902108280"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp py-3 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-[1.02] hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href="https://t.me/madmaxxtg"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-telegram py-3 text-sm font-bold text-telegram-foreground transition-transform hover:scale-[1.02] hover:brightness-110"
          >
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Contact for credits: +91 9902108280 | @madmaxxtg
        </p>
      </div>
    </div>
  );
}
