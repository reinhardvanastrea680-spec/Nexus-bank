import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import AboutPage from "../../landing/pages/AboutPage";

export const Route = createFileRoute("/landing/about")({
  component: () => (
    <LandingLayout>
      <AboutPage />
    </LandingLayout>
  ),
});
