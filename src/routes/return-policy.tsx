import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/return-policy")({
  component: () => (
    <LegalLayout title="Return Policy" updated="June 2026">
      <h2>30-Day Returns</h2>
      <p>You may return any unworn item within 30 days of delivery for a full refund or exchange.</p>
      <h2>How to Return</h2>
      <p>1. Email hello@favoritetradinginc.com with your order number. 2. We will email a prepaid shipping label (US orders). 3. Pack the item securely with the original tags. 4. Drop it at any USPS location.</p>
      <h2>Exchanges</h2>
      <p>Need a different size or color? We will ship your replacement immediately upon receipt of the original item.</p>
      <h2>Damaged or Incorrect Items</h2>
      <p>If your order arrives damaged or you received the wrong piece, please contact us within 7 days of delivery. We will make it right at no cost to you.</p>
      <h2>International Returns</h2>
      <p>International customers are responsible for return shipping. Please contact us before sending the package.</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Return Policy — Favorite Trading INC" }] }),
});
