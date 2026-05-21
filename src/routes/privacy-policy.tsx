import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/privacy-policy")({
  component: () => (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <p>Favorite Trading INC ("we", "us") respects your privacy. This policy explains what information we collect, how we use it, and the choices you have regarding it.</p>
      <h2>Information We Collect</h2>
      <p>We collect contact details (name, email, shipping address, phone), order history, and basic device/browser data when you visit favoritetradinginc.com.</p>
      <h2>How We Use Your Information</h2>
      <p>To process orders, send shipping updates, provide customer service, prevent fraud, and (with consent) send marketing communications.</p>
      <h2>Sharing</h2>
      <p>We share data only with trusted partners required to fulfill your order (payment processors, shipping carriers). We never sell personal data.</p>
      <h2>Your Rights</h2>
      <p>You may request access, correction, or deletion of your data by emailing hello@favoritetradinginc.com.</p>
      <h2>Contact</h2>
      <p>Favorite Trading INC · 750 Manhattan Ave, Unit 2nd Fl, Brooklyn, NY 11222</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Privacy Policy — Favorite Trading INC" }] }),
});
