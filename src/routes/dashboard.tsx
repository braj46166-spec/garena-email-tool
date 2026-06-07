import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, LogOut, MessageCircle, Send, Loader2, Rocket, Hourglass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  
  const [targetEmail, setTargetEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
    navigate({ to: "/" });
  };

  const handleSendCode = async () => {
    if (!targetEmail) {
      toast.error("Please enter a valid email");
      return;
    }
    
    setIsSending(true);
    try {
      // API call directly
      const response = await fetch("https://vinnyyy-otp-sender.vercel.app/api/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      if (response.ok) {
        toast.success("Code sent successfully!");
      } else {
        toast.error("Failed to send. Check API URL or format.");
      }
    } catch {
      toast.error("Network error. CORS might be blocking this.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        <div className="mb-6 rounded-3xl border border-border bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
          <p className="text-sm opacity-80">AVAILABLE CREDITS</p>
          <p className="font-display text-5xl font-bold mt-1">{profile?.credits ?? 0}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" /> ENTER EMAIL ADDRESS
          </h2>
          
          <input
            type="email"
            placeholder="user@example.com"
            className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none mb-4"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
          />

          <button
            onClick={handleSendCode}
            disabled={isSending || (profile?.credits ?? 0) <= 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {isSending ? "Sending..." : "Send Register Code (1 credit)"}
          </button>

          <div className="mt-4 rounded-xl border border-border bg-black/20 p-4 text-sm text-muted-foreground flex items-center gap-2">
            <Hourglass className="h-4 w-4" />
            {isSending ? "Sending code..." : "Ready to send..."}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="https://wa.me/918709353461" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href="https://t.me/xnitehere" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white hover:opacity-90">
              <Send className="h-4 w-4" /> Telegram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}