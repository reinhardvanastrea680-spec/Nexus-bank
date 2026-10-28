import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import OpenAccount from "../../landing/pages/OpenAccount";

export const Route = createFileRoute("/landing/open-account")({
  component: () => (
    <LandingLayout>
      <OpenAccount />
    </LandingLayout>
  ),
});
