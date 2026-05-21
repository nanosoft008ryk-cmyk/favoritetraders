import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/refund-policy")({
  component: () => (
    <LegalLayout title="Refund Policy" updated="June 2026">
      <p>We want you to love every Favorite Trading piece. If you do not, we will gladly refund eligible items.</p>
      <h2>Eligibility</h2>
      <p>Refund requests must be made within 30 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached.</p>
      <h2>Process</h2>
      <p>Email hello@favoritetradinginc.com with your order number to start a refund. Once your return is received and inspected, your refund will be processed to the original payment method within 5–7 business days.</p>
      <h2>Non-Refundable Items</h2>
      <p>Final sale items, gift cards, and altered pieces are not eligible for refund.</p>
      <h2>Shipping</h2>
      <p>Original shipping costs are non-refundable unless the item arrived damaged or incorrect.</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Refund Policy — Favorite Trading INC" }] }),
});
