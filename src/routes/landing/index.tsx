import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import HomePage from "../../landing/pages/HomePage";
export const Route = createFileRoute("/landing/")({
  component: () => (
    <LandingLayout>
      <HomePage />
    </LandingLayout>
  ),
});
