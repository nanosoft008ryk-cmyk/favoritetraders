import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/shipping-policy")({
  component: () => (
    <LegalLayout title="Shipping Policy" updated="June 2026">
      <h2>Processing Time</h2>
      <p>Orders are processed within 1–2 business days from our Brooklyn atelier.</p>
      <h2>Domestic Shipping (US)</h2>
      <p>Standard (5–7 business days): Free on orders over $250, $12 otherwise. Express (2–3 business days): $22. NYC Overnight White-Glove Delivery: $48.</p>
      <h2>International Shipping</h2>
      <p>We ship worldwide via DHL Express (3–7 business days). Rates are calculated at checkout. Duties and taxes are the responsibility of the recipient.</p>
      <h2>Tracking</h2>
      <p>A tracking number is emailed as soon as your order ships. You can also track from your account.</p>
      <h2>Delays</h2>
      <p>Occasional carrier delays may occur during peak seasons. Please reach out if your order has not arrived within the estimated timeframe.</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Shipping Policy — Favorite Trading INC" }] }),
});
