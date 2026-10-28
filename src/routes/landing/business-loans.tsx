import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import BusinessLoansPage from "../../landing/pages/BusinessLoansPage";

export const Route = createFileRoute("/landing/business-loans")({
  component: () => (
    <LandingLayout>
      <BusinessLoansPage />
    </LandingLayout>
  ),
});
