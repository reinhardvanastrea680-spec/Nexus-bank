import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import ContactPage from "../../landing/pages/ContactPage";

export const Route = createFileRoute("/landing/contact")({
  component: () => (
    <LandingLayout>
      <ContactPage />
    </LandingLayout>
  ),
});
