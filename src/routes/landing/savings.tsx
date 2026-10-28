import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import SavingsPage from "../../landing/pages/SavingsPage";

export const Route = createFileRoute("/landing/savings")({
  component: () => (
    <LandingLayout>
      <SavingsPage />
    </LandingLayout>
  ),
});
