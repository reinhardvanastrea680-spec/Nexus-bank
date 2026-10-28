import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import CreditCardsPage from "../../landing/pages/CreditCardsPage";

export const Route = createFileRoute("/landing/credit-cards")({
  component: () => (
    <LandingLayout>
      <CreditCardsPage />
    </LandingLayout>
  ),
});
