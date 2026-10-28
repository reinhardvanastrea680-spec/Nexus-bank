import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import MortgagesPage from "../../landing/pages/MortgagesPage";

export const Route = createFileRoute("/landing/mortgage")({
  component: () => (
    <LandingLayout>
      <MortgagesPage />
    </LandingLayout>
  ),
});
