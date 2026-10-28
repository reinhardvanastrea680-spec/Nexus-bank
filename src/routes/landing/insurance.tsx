import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import InsurancePage from "../../landing/pages/InsurancePage";

export const Route = createFileRoute("/landing/insurance")({
  component: () => (
    <LandingLayout>
      <InsurancePage />
    </LandingLayout>
  ),
});
