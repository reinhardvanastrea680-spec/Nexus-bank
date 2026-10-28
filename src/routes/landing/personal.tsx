import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import PersonalPage from "../../landing/pages/PersonalPage";

export const Route = createFileRoute("/landing/personal")({
  component: () => (
    <LandingLayout>
      <PersonalPage />
    </LandingLayout>
  ),
});
