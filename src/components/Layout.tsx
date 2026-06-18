import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, Sparkles, Mail, Github, Twitter, Linkedin, LogIn, LayoutDashboard, LogOut, MessageCircle } from "lucide-react";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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

          <Link to="/quiz" className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover-lift">
            Take Quiz
          </Link>

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
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-display text-lg font-bold">FuturePath <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">India's AI-powered career guidance ecosystem helping students from Class 10 onwards discover streams, careers, colleges and skills for a future-ready life.</p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/streams" className="hover:text-primary">Streams</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/colleges" className="hover:text-primary">Colleges</Link></li>
              <li><Link to="/scholarships" className="hover:text-primary">Scholarships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Grow</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/quiz" className="hover:text-primary">Career Quiz</Link></li>
              <li><Link to="/skills" className="hover:text-primary">Skills</Link></li>
              <li><Link to="/success-stories" className="hover:text-primary">Success Stories</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} FuturePath AI · Built for students, by educators.</div>
      </footer>
    </div>
  );
}
