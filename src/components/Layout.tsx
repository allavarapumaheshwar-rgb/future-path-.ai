import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, Sparkles, Mail, Phone, Github, Twitter, Linkedin, LogIn, LayoutDashboard, LogOut, MessageCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const nav = [
  { to: "/", label: "Home" },
  { to: "/streams", label: "Streams" },
  { to: "/careers", label: "Careers" },
  { to: "/mentor", label: "AI Mentor" },
  { to: "/quiz", label: "Quiz" },
  { to: "/colleges", label: "Colleges" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/skills", label: "Skills" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight">FuturePath <span className="gradient-text">AI</span></span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Discover · Decide · Succeed</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link key={n.to} to={n.to}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-primary hover:bg-primary/5"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={signOut} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-destructive hover:bg-destructive/5">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" search={{ mode: "login" }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link to="/mentor" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover-lift">
                  <MessageCircle className="h-4 w-4" /> Ask AI Mentor
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <nav className="flex flex-col p-4 gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary">
                  {n.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                    <button onClick={() => { setOpen(false); signOut(); }} className="px-3 py-2.5 rounded-lg text-sm font-medium text-left hover:bg-destructive/5 hover:text-destructive inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary inline-flex items-center gap-2"><LogIn className="h-4 w-4" /> Login</Link>
                    <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-semibold gradient-primary text-primary-foreground text-center">Sign up</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 sm:mt-20 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-display text-lg font-bold">FuturePath <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">India's AI-powered career guidance ecosystem helping students from Class 10 onwards discover streams, careers, colleges and skills for a future-ready life.</p>
            <div className="mt-5 space-y-1.5 text-sm">
              <div><span className="text-muted-foreground">Founder: </span><span className="font-semibold">Sharanya Allavarapu</span></div>
              <div className="break-all"><span className="text-muted-foreground">Email: </span><a href="mailto:allavarapulakshmisharanya33@gmail.com" className="hover:text-primary">allavarapulakshmisharanya33@gmail.com</a></div>
              <div><span className="text-muted-foreground">Phone: </span><a href="tel:+917095879590" className="hover:text-primary">+91 7095879590</a></div>
            </div>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/streams" className="hover:text-primary">Streams</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/colleges" className="hover:text-primary">Colleges</Link></li>
              <li><Link to="/scholarships" className="hover:text-primary">Scholarships</Link></li>
              <li><Link to="/quiz" className="hover:text-primary">Career Quiz</Link></li>
              <li><Link to="/skills" className="hover:text-primary">Skills</Link></li>
              <li><Link to="/mentor" className="hover:text-primary">AI Mentor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="mailto:allavarapulakshmisharanya33@gmail.com" className="hover:text-primary break-all">allavarapulakshmisharanya33@gmail.com</a></li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="tel:+917095879590" className="hover:text-primary">+91 7095879590</a></li>
              <li><Link to="/contact" className="hover:text-primary">Contact Page →</Link></li>
              <li><Link to="/success-stories" className="hover:text-primary">Success Stories</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 sm:py-6 px-4 text-center text-xs text-muted-foreground space-y-1">
          <div>© 2026 FuturePath AI. All Rights Reserved.</div>
          <div>Designed and Managed by <span className="text-foreground font-medium">Sharanya Allavarapu</span>.</div>
        </div>
      </footer>
    </div>
  );
}
