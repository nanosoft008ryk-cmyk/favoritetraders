import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/cookie-policy")({
  component: () => (
    <LegalLayout title="Cookie Policy" updated="June 2026">
      <p>This policy explains how Favorite Trading INC uses cookies and similar technologies on favoritetradinginc.com.</p>
      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>
      <h2>Types We Use</h2>
      <p>Essential cookies (cart, session), analytics cookies (anonymous traffic data), and marketing cookies (with consent) to personalize advertising.</p>
      <h2>Managing Cookies</h2>
      <p>You can disable cookies through your browser settings. Disabling essential cookies may impact site functionality such as cart and checkout.</p>
      <h2>Third Parties</h2>
      <p>We may use trusted analytics and marketing tools (e.g. Google Analytics, Meta Pixel). These vendors have their own privacy policies.</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Cookie Policy — Favorite Trading INC" }] }),
});
