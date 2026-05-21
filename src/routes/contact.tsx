import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Favorite Trading INC" }] }),
});

function Contact() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-primary text-center">Get in Touch</div>
      <h1 className="text-4xl md:text-6xl mt-3 text-center">We'd love to hear from you.</h1>
      <p className="text-muted-foreground text-center mt-3 max-w-xl mx-auto">Visit the atelier, drop us a note, or follow along.</p>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <form
          onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); toast.success("Message sent — we'll respond within 24 hours."); }}
          className="glass rounded-3xl p-8 space-y-4"
        >
          <h2 className="text-2xl">Send a message</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Subject" name="subject" required />
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea required rows={5} className="mt-1.5 w-full rounded-3xl bg-white/60 border border-border px-5 py-3 focus:outline-none focus:border-primary" />
          </label>
          <button className="btn-luxury w-full">Send Message</button>
        </form>

        <div className="space-y-4">
          <div className="glass rounded-3xl p-7 space-y-4">
            <h3 className="text-xl">Atelier & Showroom</h3>
            <Row Icon={MapPin} t="750 Manhattan Ave, Unit 2nd Fl" s="Brooklyn, NY 11222" />
            <Row Icon={Mail} t="hello@favoritetradinginc.com" s="Replies within 24 hours" />
            <Row Icon={Phone} t="+1 (718) 555-0142" s="Mon–Sat, 10am–7pm EST" />
            <Row Icon={Clock} t="Showroom Hours" s="Mon–Sat 11am–6pm · By appointment on Sundays" />
            <div className="flex gap-3 pt-2">
              {[Instagram, Facebook, Twitter].map((I, i) => <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition"><I className="w-4 h-4" /></a>)}
            </div>
          </div>
          <div className="glass rounded-3xl overflow-hidden">
            <iframe
              title="Favorite Trading INC location"
              src="https://www.google.com/maps?q=750+Manhattan+Ave,+Brooklyn,+NY+11222&output=embed"
              className="w-full h-72 border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...r } = props;
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...r} className="mt-1.5 w-full rounded-full bg-white/60 border border-border px-5 py-3 focus:outline-none focus:border-primary" />
    </label>
  );
}

function Row({ Icon, t, s }: { Icon: React.ComponentType<{ className?: string }>; t: string; s: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-ocean text-white flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
      <div><div className="font-medium">{t}</div><div className="text-xs text-muted-foreground">{s}</div></div>
    </div>
  );
}
