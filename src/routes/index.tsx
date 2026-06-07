import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthCard } from "@/components/AuthCard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garena Email Tool — Send Registration Codes" },
      {
        name: "description",
        content:
          "Garena Email Tool — login or sign up to send registration codes with credits. Fast, simple, and secure.",
      },
      { property: "og:title", content: "Garena Email Tool" },
      {
        property: "og:description",
        content: "Login or sign up to send registration codes with credits.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden
      />
      <AuthCard />
    </main>
  );
}
