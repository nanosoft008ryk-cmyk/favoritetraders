import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/terms")({
  component: () => (
    <LegalLayout title="Terms & Conditions" updated="June 2026">
      <p>These terms govern your use of favoritetradinginc.com and the purchase of products from Favorite Trading INC.</p>
      <h2>Acceptance</h2>
      <p>By using our site, you agree to these terms. If you disagree, please discontinue use of the site.</p>
      <h2>Orders & Payment</h2>
      <p>All orders are subject to acceptance and availability. Prices are listed in USD and may change without notice. We accept major credit and debit cards.</p>
      <h2>Intellectual Property</h2>
      <p>All content, designs, photography, and trademarks on this site are owned by Favorite Trading INC and may not be reproduced without written permission.</p>
      <h2>Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Favorite Trading INC is not liable for indirect, incidental, or consequential damages arising from use of our products or website.</p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of the State of New York.</p>
    </LegalLayout>
  ),
  head: () => ({ meta: [{ title: "Terms & Conditions — Favorite Trading INC" }] }),
});
