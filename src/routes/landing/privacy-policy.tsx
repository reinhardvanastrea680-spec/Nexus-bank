import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import PrivacyPolicyPage from "../../landing/pages/PrivacyPolicyPage";

export const Route = createFileRoute("/landing/privacy-policy")({
  component: () => (
    <LandingLayout>
      <PrivacyPolicyPage />
    </LandingLayout>
  ),
});
