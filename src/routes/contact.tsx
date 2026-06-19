import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Mail, Phone, Send, GraduationCap, Sparkles, HeartHandshake, Compass, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FuturePath AI" },
      { name: "description", content: "Reach out to Sharanya Allavarapu, Founder of FuturePath AI, for career guidance, feedback or partnership opportunities." },
    ],
  }),
  component: ContactPage,
});

const FOUNDER_EMAIL = "allavarapulakshmisharanya33@gmail.com";
const FOUNDER_PHONE = "+91 7095879590";
const FOUNDER_NAME = "Sharanya Allavarapu";

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-2">Get in touch</div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">We'd love to hear from you</h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Thank you for visiting FuturePath AI. Our mission is to help students discover their strengths,
            explore career opportunities, and make informed decisions about their future.
          </p>
        </div>

        {/* Founder + quick cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6 sm:mb-8">
          <div className="md:col-span-1 rounded-3xl border border-border bg-card p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground mb-4 shadow-glow">
                <User className="h-8 w-8" />
              </div>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Founder</div>
              <h3 className="font-display text-xl font-bold">{FOUNDER_NAME}</h3>
              <p className="text-sm text-muted-foreground mt-1">Founder & Creator of FuturePath AI</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 leading-relaxed">
                Passionate about empowering Indian students with personalized career guidance,
                AI-driven insights, and access to opportunities that shape their future.
              </p>
            </div>
          </div>

          <a href={`mailto:${FOUNDER_EMAIL}`} className="rounded-3xl border border-border bg-card p-5 sm:p-6 hover-lift block">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground mb-3 sm:mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Email</div>
            <div className="font-semibold break-all text-sm sm:text-base">{FOUNDER_EMAIL}</div>
            <p className="text-xs text-muted-foreground mt-2">We typically respond within 24 hours.</p>
          </a>

          <a href={`tel:${FOUNDER_PHONE.replace(/\s/g, "")}`} className="rounded-3xl border border-border bg-card p-5 sm:p-6 hover-lift block">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground mb-3 sm:mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Phone</div>
            <div className="font-semibold text-sm sm:text-base">{FOUNDER_PHONE}</div>
            <p className="text-xs text-muted-foreground mt-2">Mon – Sat · 10 AM to 7 PM IST</p>
          </a>
        </div>

        {/* Support + Inquiry */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold mb-1">Student Support</h3>
                <p className="text-sm text-muted-foreground">
                  Stuck on a decision? Confused about streams, exams or college choices?
                  Our team and AI Mentor are here to guide you — completely free for students.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Compass className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold mb-1">Career Guidance Inquiry</h3>
                <p className="text-sm text-muted-foreground">
                  Schools, parents and counselors can reach out for personalized career
                  guidance sessions, workshops and partnership opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl sm:text-2xl font-bold">Send us a message</h2>
          </div>
          {sent ? (
            <div className="text-center py-12 sm:py-16">
              <div className="grid h-14 w-14 mx-auto place-items-center rounded-full gradient-primary text-primary-foreground mb-4"><Send className="h-6 w-6" /></div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">Message sent!</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-6 px-5 py-2.5 rounded-lg border border-border font-medium hover:bg-muted">Send another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required><input required className={inputCls} placeholder="Your full name" /></Field>
                <Field label="Email Address" required><input type="email" required className={inputCls} placeholder="you@example.com" /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mobile Number" required><input type="tel" required className={inputCls} placeholder="+91 ..." /></Field>
                <Field label="Subject" required><input required className={inputCls} placeholder="How can we help?" /></Field>
              </div>
              <Field label="Message" required>
                <textarea required rows={5} className={`${inputCls} resize-none`} placeholder="Tell us about your goals or question..." />
              </Field>
              <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover-lift min-h-12">
                Submit <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 sm:mt-10 rounded-3xl border border-border bg-primary/5 p-5 sm:p-6 flex items-start gap-3 sm:gap-4">
          <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-foreground/80">
            <strong className="font-semibold">Thank you for visiting FuturePath AI.</strong>{" "}
            Our mission is to help students discover their strengths, explore career opportunities,
            and make informed decisions about their future.
          </p>
        </div>
      </section>
    </Layout>
  );
}

const inputCls = "w-full px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm sm:text-base min-h-11";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}
