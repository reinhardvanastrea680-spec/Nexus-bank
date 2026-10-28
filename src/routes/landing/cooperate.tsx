import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import CooperatePage from "../../landing/pages/CooperatePage";

export const Route = createFileRoute("/landing/cooperate")({
  component: () => (
    <LandingLayout>
      <CooperatePage />
    </LandingLayout>
  ),
});
