import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — FuturePath AI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Welcome back!");
    navigate({ to: "/dashboard" });
  }

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-4 p-8 rounded-2xl border border-border bg-card shadow-soft">
          <h1 className="font-display text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Choose a strong password you'll remember.</p>
          <input
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </button>
        </form>
      </section>
    </Layout>
  );
}
