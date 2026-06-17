import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Mail, MapPin, Phone, Send, Twitter, Linkedin, Instagram, MessageSquare } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FuturePath AI" },
      { name: "description", content: "Reach out for career guidance, feedback or partnership opportunities." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Get in touch</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">We'd love to hear from you</h1>
          <p className="text-muted-foreground">Questions, feedback, partnerships — drop us a message.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-16">
                <div className="grid h-14 w-14 mx-auto place-items-center rounded-full gradient-primary text-primary-foreground mb-4"><Send className="h-6 w-6" /></div>
                <h3 className="font-display text-2xl font-bold mb-2">Message sent!</h3>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 px-5 py-2 rounded-lg border border-border font-medium">Send another</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Your name</label>
                    <input required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <input type="email" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <input required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover-lift">
                  Send Message <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email", value: "hello@futurepath.ai" },
              { icon: Phone, title: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, title: "Office", value: "Bengaluru, India" },
              { icon: MessageSquare, title: "Feedback", value: "We read every message" },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5 flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground shrink-0"><c.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{c.title}</div>
                  <div className="font-medium truncate">{c.value}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Follow us</div>
              <div className="flex gap-2">
                {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"><Icon className="h-4 w-4" /></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
